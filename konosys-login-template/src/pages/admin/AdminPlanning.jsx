import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaClock, FaBook, FaChalkboardTeacher, FaUsers, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminPlanning = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    heureDebut: '',
    classe: '',
    course: '',
    professeur: '',
    salle: '',
    groupe: '',
    status: 'active'
  });

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch all seances/schedules - try different endpoints
        let schedulesResponse;
        try {
          schedulesResponse = await axios.get('/api/seances/etudiant/all', {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          // Fallback to admin courses endpoint
          const coursesResponse = await axios.get('/api/courses', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Convert courses to schedule format
          const courses = coursesResponse.data.courses || coursesResponse.data;
          schedulesResponse = {
            data: courses.map(course => ({
              _id: course._id,
              date: new Date().toISOString().split('T')[0],
              heureDebut: course.horaire || '08:00',
              heureFin: course.horaire ? `${parseInt(course.horaire.split(':')[0]) + 2}:00` : '10:00',
              matiere: course.matiere?.nom || 'Non définie',
              classe: course.classe,
              professeur: course.teacher,
              salle: course.salle || 'Salle à définir',
              status: 'active'
            }))
          };
        }
        
        // Fetch teachers
        const teachersResponse = await axios.get('/api/admin/teachers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch courses
        const coursesResponse = await axios.get('/api/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSchedules(schedulesResponse.data);
        setTeachers(teachersResponse.data);
        setCourses(coursesResponse.data.courses || coursesResponse.data);
        setFilteredSchedules(schedulesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter schedules based on search and filters
  useEffect(() => {
    let filtered = schedules;

    if (searchTerm) {
      filtered = filtered.filter(schedule => 
        schedule.matiere?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.classe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.professeur?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.salle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDay !== 'all') {
      filtered = filtered.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        const dayOfWeek = scheduleDate.getDay();
        const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        return dayNames[dayOfWeek] === selectedDay;
      });
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(schedule => schedule.classe === selectedClass);
    }

    if (selectedTeacher !== 'all') {
      filtered = filtered.filter(schedule => schedule.professeur?._id === selectedTeacher);
    }

    setFilteredSchedules(filtered);
  }, [schedules, searchTerm, selectedDay, selectedClass, selectedTeacher]);

  const handleAddSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/seances', newSchedule, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSchedules([...schedules, response.data.seance]);
      setShowAddModal(false);
      setNewSchedule({
        date: '',
        heureDebut: '',
        classe: '',
        course: '',
        professeur: '',
        salle: '',
        groupe: '',
        status: 'active'
      });
    } catch (err) {
      console.error('Error adding schedule:', err);
      setError('Erreur lors de l\'ajout du créneau');
    }
  };

  const handleEditSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/seances/${editingSchedule._id}`, editingSchedule, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSchedules(schedules.map(schedule => 
        schedule._id === editingSchedule._id ? response.data : schedule
      ));
      setShowEditModal(false);
      setEditingSchedule(null);
    } catch (err) {
      console.error('Error updating schedule:', err);
      setError('Erreur lors de la mise à jour du créneau');
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/seances/${editingSchedule._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSchedules(schedules.filter(schedule => schedule._id !== editingSchedule._id));
      setShowDeleteModal(false);
      setEditingSchedule(null);
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError('Erreur lors de la suppression du créneau');
    }
  };

  const handleBulkAction = (action) => {
    if (selectedSchedules.length === 0) return;
    
    // Implement bulk actions here
    console.log(`${action} for schedules:`, selectedSchedules);
    setSelectedSchedules([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDayColor = (day) => {
    switch (day) {
      case 'lundi': return 'bg-blue-100 text-blue-800';
      case 'mardi': return 'bg-green-100 text-green-800';
      case 'mercredi': return 'bg-yellow-100 text-yellow-800';
      case 'jeudi': return 'bg-purple-100 text-purple-800';
      case 'vendredi': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const day = dayNames[date.getDay()];
    const formattedDate = date.toLocaleDateString('fr-FR');
    return `${day} ${formattedDate}`;
  };

  const getUniqueClasses = () => {
    const classes = [...new Set(schedules.map(schedule => schedule.classe))];
    return classes.filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
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
              <FaCalendarAlt className="mr-4 text-pink-500" /> Gestion du planning
            </h1>
            <p className="text-lg text-gray-600">Gérez les emplois du temps de votre établissement. Créez, modifiez ou supprimez des créneaux.</p>
          </div>
          <motion.button 
            onClick={() => setShowAddModal(true)} 
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-3" /> Ajouter un créneau
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher un créneau..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
            />
          </div>
          
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
          >
            <option value="all">Tous les jours</option>
            <option value="lundi">Lundi</option>
            <option value="mardi">Mardi</option>
            <option value="mercredi">Mercredi</option>
            <option value="jeudi">Jeudi</option>
            <option value="vendredi">Vendredi</option>
            <option value="samedi">Samedi</option>
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
          >
            <option value="all">Toutes les classes</option>
            {getUniqueClasses().map(classe => (
              <option key={classe} value={classe}>
                {classe}
              </option>
            ))}
          </select>

          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
          >
            <option value="all">Tous les professeurs</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>

          {selectedSchedules.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg"
              >
                Supprimer ({selectedSchedules.length})
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Schedules Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
              <tr>
                <th className="px-8 py-6 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSchedules(filteredSchedules.map(schedule => schedule._id));
                      } else {
                        setSelectedSchedules([]);
                      }
                    }}
                    checked={selectedSchedules.length === filteredSchedules.length && filteredSchedules.length > 0}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 w-5 h-5"
                  />
                </th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Date</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Horaire</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Matière</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Professeur</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Classe</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Salle</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Statut</th>
                <th className="px-8 py-6 text-left text-lg font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => (
                <motion.tr
                  key={schedule._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      checked={selectedSchedules.includes(schedule._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSchedules([...selectedSchedules, schedule._id]);
                        } else {
                          setSelectedSchedules(selectedSchedules.filter(id => id !== schedule._id));
                        }
                      }}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500 w-5 h-5"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <div className="font-medium text-gray-900 text-lg">{formatDate(schedule.date)}</div>
                      <div className="text-gray-500 text-base">
                        {new Date(schedule.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaClock className="text-pink-500 mr-3 text-lg" />
                      <span className="text-gray-900 text-lg">
                        {schedule.heureDebut} - {schedule.heureFin}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaBook className="text-gray-400 mr-3 text-lg" />
                      <span className="text-gray-900 text-lg">{schedule.matiere}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaChalkboardTeacher className="text-indigo-500 mr-3 text-lg" />
                      <span className="text-gray-900 text-lg">{schedule.professeur?.name || 'Non assigné'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-gray-900 text-lg">{schedule.classe}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-400 mr-3 text-lg" />
                      <span className="text-gray-900 text-lg">{schedule.salle}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(schedule.status || 'active')}`}>
                      {schedule.status || 'active'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setShowEditModal(true);
                        }}
                        className="text-pink-600 hover:text-pink-900 transition-colors text-xl"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSchedule(schedule);
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

      {/* Add Schedule Modal */}
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
              <h3 className="text-xl font-bold mb-4">Ajouter un nouveau créneau</h3>
              <div className="space-y-4">
                <input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={newSchedule.heureDebut}
                  onChange={(e) => setNewSchedule({...newSchedule, heureDebut: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <select
                  value={newSchedule.course}
                  onChange={(e) => setNewSchedule({...newSchedule, course: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un cours</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.nom} - {course.classe}
                    </option>
                  ))}
                </select>
                <select
                  value={newSchedule.professeur}
                  onChange={(e) => setNewSchedule({...newSchedule, professeur: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                  value={newSchedule.classe}
                  onChange={(e) => setNewSchedule({...newSchedule, classe: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Salle"
                  value={newSchedule.salle}
                  onChange={(e) => setNewSchedule({...newSchedule, salle: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Groupe"
                  value={newSchedule.groupe}
                  onChange={(e) => setNewSchedule({...newSchedule, groupe: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Ajouter
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

        {/* Edit Schedule Modal */}
        {showEditModal && editingSchedule && (
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
              <h3 className="text-xl font-bold mb-4">Modifier le créneau</h3>
              <div className="space-y-4">
                <input
                  type="date"
                  value={editingSchedule.date ? new Date(editingSchedule.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingSchedule({...editingSchedule, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={editingSchedule.heureDebut}
                  onChange={(e) => setEditingSchedule({...editingSchedule, heureDebut: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <select
                  value={editingSchedule.course?._id || editingSchedule.course}
                  onChange={(e) => setEditingSchedule({...editingSchedule, course: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un cours</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.nom} - {course.classe}
                    </option>
                  ))}
                </select>
                <select
                  value={editingSchedule.professeur?._id || editingSchedule.professeur}
                  onChange={(e) => setEditingSchedule({...editingSchedule, professeur: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                  value={editingSchedule.classe}
                  onChange={(e) => setEditingSchedule({...editingSchedule, classe: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Salle"
                  value={editingSchedule.salle}
                  onChange={(e) => setEditingSchedule({...editingSchedule, salle: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Groupe"
                  value={editingSchedule.groupe}
                  onChange={(e) => setEditingSchedule({...editingSchedule, groupe: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleEditSchedule}
                  className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
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

        {/* Delete Schedule Modal */}
        {showDeleteModal && editingSchedule && (
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
              <h3 className="text-xl font-bold mb-4">Supprimer le créneau</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer le créneau du {formatDate(editingSchedule.date)} ? Cette action est irréversible.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteSchedule}
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

export default AdminPlanning; 