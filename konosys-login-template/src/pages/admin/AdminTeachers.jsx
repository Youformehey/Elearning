import React, { useState, useEffect } from 'react';
import { 
  FaChalkboardTeacher, FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, 
  FaEye, FaDownload, FaUpload, FaSync, FaCheck, FaTimes,
  FaKey, FaLock, FaUnlock, FaEyeSlash, FaEye as FaEyeOpen,
  FaChevronDown, FaChevronRight, FaBars, FaTimes as FaClose,
  FaHome, FaArrowLeft, FaArrowRight, FaExpand, FaCompress,
  FaExternalLinkAlt, FaArrowsAlt, FaSchool, FaBook, FaCalendarAlt, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaUserTie, 
  FaUserFriends, FaChartBar, FaTrophy, FaStar, FaExclamationTriangle,
  FaInfoCircle, FaQuestionCircle, FaLifeRing, FaHeadset, FaGlobe,
  FaClock, FaCalendar, FaCog, FaTools, FaWrench, FaHammer, FaBolt, 
  FaMagic, FaPalette, FaCode, FaDatabase, FaServer, FaNetworkWired, 
  FaWifi, FaSatellite, FaSatelliteDish, FaBroadcastTower, FaCogs, 
  FaShieldAlt, FaChartLine, FaFileAlt, FaClipboardList, FaComments, 
  FaBell, FaTachometerAlt, FaUsers, FaUserGraduate
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllTeachers, useAutoRefresh } from '../../services/adminService';

const AdminTeachers = () => {
  const { data: teachersData, loading: teachersLoading, error: teachersError, refetch: refetchTeachers } = useAutoRefresh(getAllTeachers);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    tel: '',
    matiere: '',
    adresse: '',
    status: 'active'
  });

  // Debug logs
  useEffect(() => {
    console.log('🔍 Teachers Data:', teachersData);
    console.log('❌ Teachers Error:', teachersError);
  }, [teachersData, teachersError]);

  // Update local state when data changes
  useEffect(() => {
    if (teachersData) {
      console.log('✅ Setting teachers:', teachersData);
      setTeachers(teachersData);
    }
  }, [teachersData]);

  const departments = ['Sciences', 'Lettres', 'Sciences Humaines', 'Langues', 'Arts', 'Sport'];
  const subjects = [
    'Mathématiques', 'Français', 'Histoire-Géo', 'Sciences', 'Anglais', 
    'Espagnol', 'Allemand', 'Arts Plastiques', 'Musique', 'EPS', 'Philosophie'
  ];
  const statuses = ['active', 'inactive', 'suspended'];

  useEffect(() => {
    filterTeachers();
  }, [searchTerm, selectedStatus, selectedDepartment, teachers]);

  const filterTeachers = () => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.matiere?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === selectedStatus);
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(teacher => teacher.matiere === selectedDepartment);
    }

    setFilteredTeachers(filtered);
  };

  const handleAddTeacher = async () => {
    try {
      console.log('🔄 Création du professeur:', newTeacher);
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const teacherData = {
        name: `${newTeacher.firstName} ${newTeacher.lastName}`,
        email: newTeacher.email,
        telephone: newTeacher.phone,
        matiere: newTeacher.subject,
        status: newTeacher.status || 'active'
      };
      
      const response = await fetch(`http://localhost:5001/api/admin/teachers`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(teacherData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }
      
      const newTeacherData = await response.json();
      console.log('✅ Réponse création:', newTeacherData);
      
      // Ajouter le nouveau professeur à la liste locale
      const teacherItem = {
        _id: newTeacherData.teacher._id,
        name: newTeacherData.teacher.name,
        email: newTeacherData.teacher.email,
        tel: newTeacherData.teacher.telephone,
        matiere: newTeacherData.teacher.matiere,
        status: newTeacherData.teacher.status,
        experience: '0 an',
        students: 0,
        rating: 0,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: '👨‍🏫'
      };
      
      setTeachers([...teachers, teacherItem]);
      setNewTeacher({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        department: '',
        status: 'active'
      });
      setShowAddModal(false);
      alert('Professeur créé avec succès');
    } catch (err) {
      console.error('❌ Error adding teacher:', err);
      const errorMessage = err.message;
      alert(`Erreur lors de la création du professeur: ${errorMessage}`);
    }
  };

  const handleEditTeacher = async () => {
    try {
      console.log('🔄 Modification du professeur:', editingTeacher._id);
      console.log('📝 Données à envoyer:', editingTeacher);
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const teacherData = {
        name: `${editingTeacher.firstName} ${editingTeacher.lastName}`,
        email: editingTeacher.email,
        telephone: editingTeacher.phone,
        matiere: editingTeacher.subject,
        status: editingTeacher.status
      };
      
      const response = await fetch(`http://localhost:5001/api/admin/teachers/${editingTeacher._id}`, {
        method: 'PUT',
        headers: config.headers,
        body: JSON.stringify(teacherData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }
      
      const updatedTeacher = await response.json();
      console.log('✅ Réponse modification:', updatedTeacher);
      
      // Mettre à jour la liste locale
      const updatedTeachers = teachers.map(teacher =>
        teacher._id === editingTeacher._id ? { ...teacher, ...editingTeacher } : teacher
      );
      setTeachers(updatedTeachers);
      setEditingTeacher(null);
      setShowEditModal(false);
      alert('Professeur modifié avec succès');
    } catch (err) {
      console.error('❌ Error updating teacher:', err);
      const errorMessage = err.message;
      alert(`Erreur lors de la modification du professeur: ${errorMessage}`);
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      console.log('🔄 Suppression du professeur:', id);
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await fetch(`http://localhost:5001/api/admin/teachers/${id}`, {
        method: 'DELETE',
        headers: config.headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
      
      console.log('✅ Professeur supprimé avec succès');
      
      // Mettre à jour la liste locale
      setTeachers(teachers.filter(teacher => teacher._id !== id));
      setShowDeleteModal(false);
      alert('Professeur supprimé avec succès');
    } catch (err) {
      console.error('❌ Error deleting teacher:', err);
      const errorMessage = err.message;
      alert(`Erreur lors de la suppression du professeur: ${errorMessage}`);
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        setTeachers(teachers.map(teacher =>
          selectedTeachers.includes(teacher.id)
            ? { ...teacher, status: 'active' }
            : teacher
        ));
        break;
      case 'deactivate':
        setTeachers(teachers.map(teacher =>
          selectedTeachers.includes(teacher.id)
            ? { ...teacher, status: 'inactive' }
            : teacher
        ));
        break;
      case 'delete':
        setTeachers(teachers.filter(teacher => !selectedTeachers.includes(teacher.id)));
        break;
    }
    setSelectedTeachers([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <FaChalkboardTeacher className="mr-3 text-blue-500" />
              Gestion des professeurs
            </h1>
            <p className="text-gray-600">
              Gérez tous les professeurs de votre établissement. Ajoutez, modifiez ou supprimez des profils.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <FaPlus className="mr-2" />
            Ajouter un professeur
          </motion.button>
        </div>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un professeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtre par statut */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>

          {/* Filtre par département */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les départements</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Actions en masse */}
          {selectedTeachers.length > 0 && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('activate')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Activer ({selectedTeachers.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('deactivate')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Désactiver ({selectedTeachers.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('delete')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Supprimer ({selectedTeachers.length})
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tableau des professeurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTeachers(filteredTeachers.map(t => t.id));
                      } else {
                        setSelectedTeachers([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Professeur</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Matière</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Département</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Étudiants</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Note</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher, index) => (
                <motion.tr
                  key={teacher._id || teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher._id || teacher.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeachers([...selectedTeachers, teacher._id || teacher.id]);
                        } else {
                          setSelectedTeachers(selectedTeachers.filter(id => id !== (teacher._id || teacher.id)));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {teacher.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {teacher.name}
                        </p>
                        <p className="text-sm text-gray-500">ID: {teacher._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{teacher.email}</p>
                      <p className="text-sm text-gray-500">{teacher.tel || 'Non renseigné'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {teacher.matiere || 'Non assigné'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {teacher.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(teacher.status || 'active')}`}>
                      {teacher.status === 'active' ? 'Actif' : 
                       teacher.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaUserGraduate className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{Math.floor(Math.random() * 20) + 30}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className={`font-medium ${getRatingColor(4.5)}`}>
                        {4.5}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingTeacher(teacher);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingTeacher(teacher);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal d'ajout */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un professeur</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={newTeacher.firstName}
                    onChange={(e) => setNewTeacher({...newTeacher, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={newTeacher.lastName}
                    onChange={(e) => setNewTeacher({...newTeacher, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                  <select
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une matière</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                  <select
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTeacher}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium"
                >
                  Ajouter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium"
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de modification */}
      <AnimatePresence>
        {showEditModal && editingTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifier le professeur</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={editingTeacher.firstName}
                    onChange={(e) => setEditingTeacher({...editingTeacher, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={editingTeacher.lastName}
                    onChange={(e) => setEditingTeacher({...editingTeacher, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingTeacher.email}
                    onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={editingTeacher.phone}
                    onChange={(e) => setEditingTeacher({...editingTeacher, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                  <select
                    value={editingTeacher.subject}
                    onChange={(e) => setEditingTeacher({...editingTeacher, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                  <select
                    value={editingTeacher.department}
                    onChange={(e) => setEditingTeacher({...editingTeacher, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={editingTeacher.status}
                    onChange={(e) => setEditingTeacher({...editingTeacher, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditTeacher}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium"
                >
                  Modifier
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium"
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de suppression */}
      <AnimatePresence>
        {showDeleteModal && editingTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmer la suppression</h2>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer le professeur <strong>{editingTeacher.firstName} {editingTeacher.lastName}</strong> ? 
                  Cette action est irréversible.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteTeacher(editingTeacher.id)}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium"
                  >
                    Supprimer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium"
                  >
                    Annuler
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTeachers; 