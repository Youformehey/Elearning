import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaClock, FaUsers, FaStar, FaChalkboardTeacher, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    nom: '', 
    matiere: '', 
    teacher: '', 
    classe: '', 
    semestre: '', 
    horaire: '', 
    salle: '', 
    duree: 120,
    status: 'active'
  });

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch courses with populated teacher and subject data
        const coursesResponse = await axios.get('/api/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch teachers
        const teachersResponse = await axios.get('/api/admin/teachers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch subjects/matieres
        const subjectsResponse = await axios.get('/api/matieres', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCourses(coursesResponse.data.courses || coursesResponse.data);
        setTeachers(teachersResponse.data);
        setSubjects(subjectsResponse.data);
        setFilteredCourses(coursesResponse.data.courses || coursesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.classe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.matiere?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(course => course.status === selectedStatus);
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(course => course.matiere?._id === selectedSubject);
    }

    if (selectedTeacher !== 'all') {
      filtered = filtered.filter(course => course.teacher?._id === selectedTeacher);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedStatus, selectedSubject, selectedTeacher]);

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/courses', newCourse, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCourses([...courses, response.data]);
      setShowAddModal(false);
      setNewCourse({
        nom: '', 
        matiere: '', 
        teacher: '', 
        classe: '', 
        semestre: '', 
        horaire: '', 
        salle: '', 
        duree: 120,
        status: 'active'
      });
    } catch (err) {
      console.error('Error adding course:', err);
      setError('Erreur lors de l\'ajout du cours');
    }
  };

  const handleEditCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/courses/${editingCourse._id}`, editingCourse, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCourses(courses.map(course => 
        course._id === editingCourse._id ? response.data : course
      ));
      setShowEditModal(false);
      setEditingCourse(null);
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Erreur lors de la mise à jour du cours');
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/courses/${editingCourse._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCourses(courses.filter(course => course._id !== editingCourse._id));
      setShowDeleteModal(false);
      setEditingCourse(null);
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Erreur lors de la suppression du cours');
    }
  };

  const handleBulkAction = (action) => {
    if (selectedCourses.length === 0) return;
    
    // Implement bulk actions here
    console.log(`${action} for courses:`, selectedCourses);
    setSelectedCourses([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <FaExclamationTriangle className="text-red-400 mr-2 mt-1" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center">
              <FaBook className="mr-4 text-indigo-500" /> Gestion des cours
            </h1>
            <p className="text-lg text-gray-600">Gérez tous les cours de votre établissement. Créez, modifiez ou supprimez des cours.</p>
          </div>
          <motion.button 
            onClick={() => setShowAddModal(true)} 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-3" /> Créer un cours
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="draft">Brouillon</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          >
            <option value="all">Toutes les matières</option>
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>
                {subject.nom}
              </option>
            ))}
          </select>

          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          >
            <option value="all">Tous les professeurs</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>

          {selectedCourses.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg"
              >
                Supprimer ({selectedCourses.length})
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Courses Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="px-8 py-6 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCourses(filteredCourses.map(course => course._id));
                      } else {
                        setSelectedCourses([]);
                      }
                    }}
                    checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                  />
                </th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Cours</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Professeur</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Matière</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Classe</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Horaire</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Étudiants</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Statut</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <motion.tr
                  key={course._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourses([...selectedCourses, course._id]);
                        } else {
                          setSelectedCourses(selectedCourses.filter(id => id !== course._id));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <div className="font-medium text-gray-900 text-lg">{course.nom}</div>
                      <div className="text-gray-500 text-base">{course.semestre}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaChalkboardTeacher className="text-indigo-500 mr-3 text-lg" />
                      <span className="text-gray-900 text-lg">{course.teacher?.name || 'Non assigné'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-gray-900 text-lg">{course.matiere?.nom || 'Non définie'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-gray-900 text-lg">{course.classe}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaClock className="text-gray-400 mr-2 text-lg" />
                      <span className="text-gray-900 text-lg">{course.horaire}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaUsers className="text-gray-400 mr-2 text-lg" />
                      <span className="text-gray-900 text-lg">{course.etudiants?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(course.status || 'active')}`}>
                      {course.status || 'active'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors text-xl"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors text-xl"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Créer un nouveau cours</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom du cours"
                  value={newCourse.nom}
                  onChange={(e) => setNewCourse({...newCourse, nom: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <select
                  value={newCourse.matiere}
                  onChange={(e) => setNewCourse({...newCourse, matiere: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une matière</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.nom}
                    </option>
                  ))}
                </select>
                <select
                  value={newCourse.teacher}
                  onChange={(e) => setNewCourse({...newCourse, teacher: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un professeur</option>
                  {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Classe"
                  value={newCourse.classe}
                  onChange={(e) => setNewCourse({...newCourse, classe: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Semestre"
                  value={newCourse.semestre}
                  onChange={(e) => setNewCourse({...newCourse, semestre: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Horaire (ex: 08:00)"
                  value={newCourse.horaire}
                  onChange={(e) => setNewCourse({...newCourse, horaire: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Salle"
                  value={newCourse.salle}
                  onChange={(e) => setNewCourse({...newCourse, salle: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Durée (minutes)"
                  value={newCourse.duree}
                  onChange={(e) => setNewCourse({...newCourse, duree: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddCourse}
                  className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Créer
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Course Modal */}
        {showEditModal && editingCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Modifier le cours</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom du cours"
                  value={editingCourse.nom}
                  onChange={(e) => setEditingCourse({...editingCourse, nom: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <select
                  value={editingCourse.matiere?._id || editingCourse.matiere}
                  onChange={(e) => setEditingCourse({...editingCourse, matiere: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une matière</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.nom}
                    </option>
                  ))}
                </select>
                <select
                  value={editingCourse.teacher?._id || editingCourse.teacher}
                  onChange={(e) => setEditingCourse({...editingCourse, teacher: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un professeur</option>
                  {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Classe"
                  value={editingCourse.classe}
                  onChange={(e) => setEditingCourse({...editingCourse, classe: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Semestre"
                  value={editingCourse.semestre}
                  onChange={(e) => setEditingCourse({...editingCourse, semestre: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Horaire"
                  value={editingCourse.horaire}
                  onChange={(e) => setEditingCourse({...editingCourse, horaire: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Salle"
                  value={editingCourse.salle}
                  onChange={(e) => setEditingCourse({...editingCourse, salle: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Durée (minutes)"
                  value={editingCourse.duree}
                  onChange={(e) => setEditingCourse({...editingCourse, duree: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleEditCourse}
                  className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Course Modal */}
        {showDeleteModal && editingCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Supprimer le cours</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer le cours "{editingCourse.nom}" ? Cette action est irréversible.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCourse}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCourses; 