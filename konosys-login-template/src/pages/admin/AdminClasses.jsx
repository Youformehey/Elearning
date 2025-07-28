import React, { useState, useEffect } from 'react';
import { 
  FaSchool, FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, 
  FaEye, FaDownload, FaUpload, FaSync, FaCheck, FaTimes,
  FaKey, FaLock, FaUnlock, FaEyeSlash, FaEye as FaEyeOpen,
  FaChevronDown, FaChevronRight, FaBars, FaTimes as FaClose,
  FaHome, FaArrowLeft, FaArrowRight, FaExpand, FaCompress,
  FaExternalLinkAlt, FaArrowsAlt, FaBook, FaCalendarAlt, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaUserTie, 
  FaUserFriends, FaChartBar, FaTrophy, FaStar, FaExclamationTriangle,
  FaInfoCircle, FaQuestionCircle, FaLifeRing, FaHeadset, FaGlobe,
  FaClock, FaCalendar, FaCog, FaTools, FaWrench, FaHammer, FaBolt, 
  FaMagic, FaPalette, FaCode, FaDatabase, FaServer, FaNetworkWired, 
  FaWifi, FaSatellite, FaSatelliteDish, FaBroadcastTower, FaCogs, 
  FaShieldAlt, FaChartLine, FaFileAlt, FaClipboardList, FaComments, 
  FaBell, FaTachometerAlt, FaUsers, FaUserGraduate,
  FaChalkboardTeacher, FaUserShield, FaBuilding, FaUniversity
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllClasses, useAutoRefresh } from '../../services/adminService';

const AdminClasses = () => {
  const { data: classesData, loading: classesLoading, error: classesError, refetch: refetchClasses } = useAutoRefresh(getAllClasses);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({
    nom: '',
    niveau: '',
    effectif: '',
    professeurPrincipal: '',
    status: 'active'
  });

  // Debug logs
  useEffect(() => {
    console.log('🔍 Classes Data:', classesData);
    console.log('❌ Classes Error:', classesError);
  }, [classesData, classesError]);

  // Update local state when data changes
  useEffect(() => {
    if (classesData) {
      console.log('✅ Setting classes:', classesData);
      setClasses(classesData);
    }
  }, [classesData]);

  const levels = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const subjects = [
    'Mathématiques', 'Français', 'Histoire-Géo', 'Sciences', 'Anglais', 
    'Espagnol', 'Allemand', 'Arts Plastiques', 'Musique', 'EPS', 'Philosophie'
  ];
  const rooms = ['Salle 101', 'Salle 102', 'Salle 103', 'Salle 104', 'Labo 201', 'Labo 202', 'Salle Arts', 'Salle Musique'];
  const statuses = ['active', 'inactive', 'maintenance'];

  useEffect(() => {
    filterClasses();
  }, [searchTerm, selectedStatus, selectedLevel, classes]);

  const filterClasses = () => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(cls =>
        cls.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.niveau?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.professeurPrincipal?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(cls => cls.status === selectedStatus);
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(cls => cls.niveau === selectedLevel);
    }

    setFilteredClasses(filtered);
  };

  const handleAddClass = () => {
    const classItem = {
      id: classes.length + 1,
      ...newClass,
      currentStudents: 0,
      averageGrade: 'N/A',
      attendance: 100,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setClasses([...classes, classItem]);
    setNewClass({
      name: '',
      level: '',
      section: '',
      capacity: 30,
      teacher: '',
      subject: '',
      room: '',
      schedule: '',
      status: 'active'
    });
    setShowAddModal(false);
  };

  const handleEditClass = () => {
    const updatedClasses = classes.map(cls =>
      cls.id === editingClass.id ? editingClass : cls
    );
    setClasses(updatedClasses);
    setEditingClass(null);
    setShowEditModal(false);
  };

  const handleDeleteClass = (id) => {
    setClasses(classes.filter(cls => cls.id !== id));
    setShowDeleteModal(false);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        setClasses(classes.map(cls =>
          selectedClasses.includes(cls.id)
            ? { ...cls, status: 'active' }
            : cls
        ));
        break;
      case 'deactivate':
        setClasses(classes.map(cls =>
          selectedClasses.includes(cls.id)
            ? { ...cls, status: 'inactive' }
            : cls
        ));
        break;
      case 'delete':
        setClasses(classes.filter(cls => !selectedClasses.includes(cls.id)));
        break;
    }
    setSelectedClasses([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'text-green-600';
    if (grade.includes('B')) return 'text-blue-600';
    if (grade.includes('C')) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getOccupancyColor = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
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
              <FaSchool className="mr-3 text-blue-500" />
              Gestion des classes
            </h1>
            <p className="text-gray-600">
              Gérez toutes les classes de votre établissement. Créez, modifiez ou supprimez des classes.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <FaPlus className="mr-2" />
            Créer une classe
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
              placeholder="Rechercher une classe..."
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
            <option value="maintenance">Maintenance</option>
          </select>

          {/* Filtre par niveau */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les niveaux</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {/* Actions en masse */}
          {selectedClasses.length > 0 && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('activate')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Activer ({selectedClasses.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('deactivate')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Désactiver ({selectedClasses.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('delete')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Supprimer ({selectedClasses.length})
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tableau des classes */}
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
                        setSelectedClasses(filteredClasses.map(c => c.id));
                      } else {
                        setSelectedClasses([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Classe</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Professeur</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Matière</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Salle</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Élèves</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Note moyenne</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClasses.map((cls, index) => (
                <motion.tr
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClasses([...selectedClasses, cls.id]);
                        } else {
                          setSelectedClasses(selectedClasses.filter(id => id !== cls.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold mr-3">
                        {cls.name}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        <p className="text-sm text-gray-500">{cls.schedule}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <FaChalkboardTeacher className="text-gray-600 text-sm" />
                      </div>
                      <span className="font-medium text-gray-900">{cls.teacher}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {cls.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{cls.room}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaUsers className="text-gray-400 mr-2" />
                      <span className={`font-medium ${getOccupancyColor(cls.currentStudents, cls.capacity)}`}>
                        {cls.currentStudents}/{cls.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cls.status)}`}>
                      {cls.status === 'active' ? 'Actif' : 
                       cls.status === 'inactive' ? 'Inactif' : 'Maintenance'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className={`font-medium ${getGradeColor(cls.averageGrade)}`}>
                        {cls.averageGrade}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingClass(cls);
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
                          setEditingClass(cls);
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer une classe</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                    <select
                      value={newClass.level}
                      onChange={(e) => setNewClass({...newClass, level: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                    <select
                      value={newClass.section}
                      onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {sections.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professeur</label>
                  <input
                    type="text"
                    value={newClass.teacher}
                    onChange={(e) => setNewClass({...newClass, teacher: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom du professeur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                  <select
                    value={newClass.subject}
                    onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une matière</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salle</label>
                  <select
                    value={newClass.room}
                    onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une salle</option>
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
                  <input
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({...newClass, capacity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horaire</label>
                  <input
                    type="text"
                    value={newClass.schedule}
                    onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ex: Lundi, Mercredi, Vendredi"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddClass}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium"
                >
                  Créer
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
        {showEditModal && editingClass && (
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifier la classe</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                    <select
                      value={editingClass.level}
                      onChange={(e) => setEditingClass({...editingClass, level: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                    <select
                      value={editingClass.section}
                      onChange={(e) => setEditingClass({...editingClass, section: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {sections.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professeur</label>
                  <input
                    type="text"
                    value={editingClass.teacher}
                    onChange={(e) => setEditingClass({...editingClass, teacher: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                  <select
                    value={editingClass.subject}
                    onChange={(e) => setEditingClass({...editingClass, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salle</label>
                  <select
                    value={editingClass.room}
                    onChange={(e) => setEditingClass({...editingClass, room: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
                  <input
                    type="number"
                    value={editingClass.capacity}
                    onChange={(e) => setEditingClass({...editingClass, capacity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horaire</label>
                  <input
                    type="text"
                    value={editingClass.schedule}
                    onChange={(e) => setEditingClass({...editingClass, schedule: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={editingClass.status}
                    onChange={(e) => setEditingClass({...editingClass, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditClass}
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
        {showDeleteModal && editingClass && (
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
                  Êtes-vous sûr de vouloir supprimer la classe <strong>{editingClass.name}</strong> ? 
                  Cette action est irréversible.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteClass(editingClass.id)}
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

export default AdminClasses; 