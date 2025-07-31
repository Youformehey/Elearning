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
import axios from 'axios';

const AdminClasses = () => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [newClass, setNewClass] = useState({
    nom: '',
    niveau: '',
    effectif: 30,
    professeurPrincipal: '',
    status: 'active'
  });

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Configuration axios avec token d'authentification
        const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
        
        // Fetch classes (class names) - Correction de l'URL
        const classesResponse = await axios.get('http://localhost:5001/api/admin/classes', config);
        console.log('✅ Classes Data:', classesResponse.data);
        
        // Fetch teachers for dropdown
        const teachersResponse = await axios.get('http://localhost:5001/api/admin/teachers', config);
        setTeachers(teachersResponse.data);
        
        // Fetch students to get class information
        const studentsResponse = await axios.get('http://localhost:5001/api/admin/students', config);
        setStudents(studentsResponse.data);
        
        // Transform class names into class objects with additional data
        const classObjects = classesResponse.data.map((className, index) => {
          const classStudents = studentsResponse.data.filter(student => student.classe === className);
          const classTeacher = teachersResponse.data.find(teacher => 
            teacher.matieres && teacher.matieres.some(matiere => 
              classStudents.some(student => student.classe === className)
            )
          );
          
          return {
            _id: index + 1, // Generate ID since backend only returns strings
            nom: className,
            niveau: className.includes('ème') ? className.split('ème')[0] + 'ème' : 
                   className.includes('ère') ? className.split('ère')[0] + 'ère' : 
                   className.includes('nde') ? className.split('nde')[0] + 'nde' : 
                   className.includes('inale') ? className.split('inale')[0] + 'inale' : className,
            effectif: classStudents.length,
            professeurPrincipal: classTeacher ? classTeacher.name : 'Non assigné',
            status: 'active',
            currentStudents: classStudents.length,
            capacity: 30,
            averageGrade: 'N/A',
            attendance: 95,
            schedule: 'À définir',
            room: 'À définir',
            subject: 'Matières générales'
          };
        });
        
        setClasses(classObjects);
        setFilteredClasses(classObjects);
      } catch (err) {
        console.error('❌ Error fetching classes:', err);
        setError('Erreur lors du chargement des classes');
        
        // Mock teachers data
        const mockTeachers = [
          { _id: 1, name: "Marie Dubois", matiere: "Mathématiques" },
          { _id: 2, name: "Pierre Martin", matiere: "Français" },
          { _id: 3, name: "Sophie Bernard", matiere: "Histoire-Géo" },
          { _id: 4, name: "Jean Dupont", matiere: "Sciences" },
          { _id: 5, name: "Isabelle Moreau", matiere: "Anglais" },
          { _id: 6, name: "François Leroy", matiere: "Espagnol" },
          { _id: 7, name: "Catherine Roux", matiere: "Allemand" },
          { _id: 8, name: "Michel Blanc", matiere: "Arts Plastiques" },
          { _id: 9, name: "Anne Petit", matiere: "Musique" },
          { _id: 10, name: "Laurent Durand", matiere: "EPS" },
          { _id: 11, name: "Nathalie Simon", matiere: "Philosophie" },
          { _id: 12, name: "Philippe Rousseau", matiere: "SVT" },
          { _id: 13, name: "Claire Dubois", matiere: "Physique-Chimie" },
          { _id: 14, name: "Marc Lefevre", matiere: "Technologie" },
          { _id: 15, name: "Julie Moreau", matiere: "Latin" }
        ];
        setTeachers(mockTeachers);
        
        // Fallback to mock data if API fails
        const mockClasses = [
          {
            _id: 1,
            nom: "6ème A",
            niveau: "6ème",
            effectif: 28,
            professeurPrincipal: "Marie Dubois",
            status: "active",
            currentStudents: 28,
            capacity: 30,
            averageGrade: "B+",
            attendance: 95,
            schedule: "Lundi, Mercredi, Vendredi",
            room: "Salle 101",
            subject: "Matières générales"
          },
          {
            _id: 2,
            nom: "5ème B",
            niveau: "5ème",
            effectif: 25,
            professeurPrincipal: "Pierre Martin",
            status: "active",
            currentStudents: 25,
            capacity: 30,
            averageGrade: "A-",
            attendance: 92,
            schedule: "Mardi, Jeudi, Samedi",
            room: "Salle 102",
            subject: "Matières générales"
          },
          {
            _id: 3,
            nom: "4ème C",
            niveau: "4ème",
            effectif: 22,
            professeurPrincipal: "Sophie Bernard",
            status: "active",
            currentStudents: 22,
            capacity: 30,
            averageGrade: "B",
            attendance: 88,
            schedule: "Lundi, Mercredi, Vendredi",
            room: "Salle 103",
            subject: "Matières générales"
          },
          {
            _id: 4,
            nom: "3ème D",
            niveau: "3ème",
            effectif: 24,
            professeurPrincipal: "Jean Dupont",
            status: "active",
            currentStudents: 24,
            capacity: 30,
            averageGrade: "A",
            attendance: 94,
            schedule: "Mardi, Jeudi, Samedi",
            room: "Salle 104",
            subject: "Matières générales"
          },
          {
            _id: 5,
            nom: "2nde A",
            niveau: "2nde",
            effectif: 26,
            professeurPrincipal: "Isabelle Moreau",
            status: "active",
            currentStudents: 26,
            capacity: 30,
            averageGrade: "B+",
            attendance: 91,
            schedule: "Lundi, Mercredi, Vendredi",
            room: "Salle 201",
            subject: "Matières générales"
          },
          {
            _id: 6,
            nom: "1ère S",
            niveau: "1ère",
            effectif: 20,
            professeurPrincipal: "François Leroy",
            status: "active",
            currentStudents: 20,
            capacity: 25,
            averageGrade: "A+",
            attendance: 96,
            schedule: "Mardi, Jeudi, Samedi",
            room: "Salle 202",
            subject: "Sciences"
          },
          {
            _id: 7,
            nom: "1ère ES",
            niveau: "1ère",
            effectif: 18,
            professeurPrincipal: "Catherine Roux",
            status: "active",
            currentStudents: 18,
            capacity: 25,
            averageGrade: "A-",
            attendance: 93,
            schedule: "Lundi, Mercredi, Vendredi",
            room: "Salle 203",
            subject: "Économie et Social"
          },
          {
            _id: 8,
            nom: "Terminale S",
            niveau: "Terminale",
            effectif: 22,
            professeurPrincipal: "Michel Blanc",
            status: "active",
            currentStudents: 22,
            capacity: 25,
            averageGrade: "A",
            attendance: 97,
            schedule: "Mardi, Jeudi, Samedi",
            room: "Salle 301",
            subject: "Sciences"
          },
          {
            _id: 9,
            nom: "Terminale ES",
            niveau: "Terminale",
            effectif: 19,
            professeurPrincipal: "Anne Petit",
            status: "active",
            currentStudents: 19,
            capacity: 25,
            averageGrade: "A-",
            attendance: 94,
            schedule: "Lundi, Mercredi, Vendredi",
            room: "Salle 302",
            subject: "Économie et Social"
          },
          {
            _id: 10,
            nom: "Terminale L",
            niveau: "Terminale",
            effectif: 15,
            professeurPrincipal: "Laurent Durand",
            status: "active",
            currentStudents: 15,
            capacity: 25,
            averageGrade: "B+",
            attendance: 90,
            schedule: "Mardi, Jeudi, Samedi",
            room: "Salle 303",
            subject: "Littéraire"
          },
          {
            _id: 11,
            nom: "6ème B",
            niveau: "6ème",
            effectif: 27,
            professeurPrincipal: "Nathalie Simon",
            status: "active",
            currentStudents: 27,
            capacity: 30,
            averageGrade: "B",
            attendance: 89,
            schedule: "Mardi, Jeudi, Samedi",
            room: "Salle 105",
            subject: "Matières générales"
          },
          {
            _id: 12,
            nom: "5ème A",
            niveau: "5ème",
            effectif: 29,
            professeurPrincipal: "Philippe Rousseau",
            status: "active",
            currentStudents: 29,
            capacity: 30,
            averageGrade: "A",
            attendance: 93,
            schedule: "Lundi, Mercredi, Vendredi",
            room: "Salle 106",
            subject: "Matières générales"
          },
          {
            _id: 13,
            nom: "4ème A",
            niveau: "4ème",
            effectif: 23,
            professeurPrincipal: "Claire Dubois",
            status: "active",
            currentStudents: 23,
            capacity: 30,
            averageGrade: "B+",
            attendance: 91,
            schedule: "Mardi, Jeudi, Samedi",
            room: "Salle 107",
            subject: "Matières générales"
          },
          {
            _id: 14,
            nom: "3ème C",
            niveau: "3ème",
            effectif: 21,
            professeurPrincipal: "Marc Lefevre",
            status: "active",
            currentStudents: 21,
            capacity: 30,
            averageGrade: "A-",
            attendance: 92,
            schedule: "Lundi, Mercredi, Vendredi",
            room: "Salle 108",
            subject: "Matières générales"
          },
          {
            _id: 15,
            nom: "2nde B",
            niveau: "2nde",
            effectif: 24,
            professeurPrincipal: "Julie Moreau",
            status: "active",
            currentStudents: 24,
            capacity: 30,
            averageGrade: "B",
            attendance: 88,
            schedule: "Mardi, Jeudi, Samedi",
            room: "Salle 204",
            subject: "Matières générales"
          }
        ];
        setClasses(mockClasses);
        setFilteredClasses(mockClasses);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        cls.professeurPrincipal?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddClass = async () => {
    try {
      console.log('🔄 Création de la classe:', newClass);
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const classData = {
        nom: `${newClass.niveau} ${newClass.section}`,
        niveau: newClass.niveau,
        section: newClass.section,
        effectif: newClass.effectif,
        professeurPrincipal: newClass.professeurPrincipal,
        status: newClass.status,
        capacite: newClass.effectif
      };
      
      const response = await axios.post(`http://localhost:5001/api/admin/classes`, classData, config);
      console.log('✅ Réponse création:', response.data);
      
      // Ajouter la nouvelle classe à la liste locale
      const newClassItem = {
        _id: response.data.class._id,
        nom: response.data.class.nom,
        niveau: response.data.class.niveau,
        section: response.data.class.section,
        effectif: response.data.class.effectif,
        professeurPrincipal: response.data.class.professeurPrincipal,
        status: response.data.class.status,
        capacite: response.data.class.capacite,
        currentStudents: 0,
        averageGrade: 'N/A',
        attendance: 100,
        schedule: 'À définir',
        room: 'À définir',
        subject: 'Matières générales'
      };
      
      setClasses([...classes, newClassItem]);
      setNewClass({
        nom: '',
        niveau: '',
        effectif: 30,
        professeurPrincipal: '',
        status: 'active'
      });
      setShowAddModal(false);
      alert('Classe créée avec succès');
    } catch (err) {
      console.error('❌ Error adding class:', err);
      const errorMessage = err.response?.data?.message || err.message;
      alert(`Erreur lors de l'ajout de la classe: ${errorMessage}`);
    }
  };

  const handleEditClass = async () => {
    try {
      console.log('🔄 Modification de la classe:', editingClass._id);
      console.log('📝 Données à envoyer:', editingClass);
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.put(`http://localhost:5001/api/admin/classes/${editingClass._id}`, editingClass, config);
      console.log('✅ Réponse modification:', response.data);
      
      // Mettre à jour la liste locale
      const updatedClasses = classes.map(cls =>
        cls._id === editingClass._id ? { ...cls, ...editingClass } : cls
      );
      setClasses(updatedClasses);
      setEditingClass(null);
      setShowEditModal(false);
      alert('Classe modifiée avec succès');
    } catch (err) {
      console.error('❌ Error updating class:', err);
      const errorMessage = err.response?.data?.message || err.message;
      alert(`Erreur lors de la modification de la classe: ${errorMessage}`);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      console.log('🔄 Suppression de la classe:', id);
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.delete(`http://localhost:5001/api/admin/classes/${id}`, config);
      console.log('✅ Réponse suppression:', response.data);
      
      // Mettre à jour la liste locale
      setClasses(classes.filter(cls => cls._id !== id));
      setShowDeleteModal(false);
      alert('Classe supprimée avec succès');
    } catch (err) {
      console.error('❌ Error deleting class:', err);
      const errorMessage = err.response?.data?.message || err.message;
      alert(`Erreur lors de la suppression de la classe: ${errorMessage}`);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      switch (action) {
        case 'activate':
          setClasses(classes.map(cls =>
            selectedClasses.includes(cls._id)
              ? { ...cls, status: 'active' }
              : cls
          ));
          break;
        case 'deactivate':
          setClasses(classes.map(cls =>
            selectedClasses.includes(cls._id)
              ? { ...cls, status: 'inactive' }
              : cls
          ));
          break;
        case 'delete':
          setClasses(classes.filter(cls => !selectedClasses.includes(cls._id)));
          break;
      }
      setSelectedClasses([]);
    } catch (err) {
      console.error('❌ Error in bulk action:', err);
      alert('Erreur lors de l\'action en masse');
    }
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
    if (!grade) return 'text-gray-600';
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

  // Fonction pour obtenir la couleur de la classe basée sur le nom
  const getClassColor = (className) => {
    const colors = {
      '6ème': 'from-blue-500 to-blue-600',
      '5ème': 'from-green-500 to-green-600',
      '4ème': 'from-purple-500 to-purple-600',
      '3ème': 'from-orange-500 to-orange-600',
      '2nde': 'from-red-500 to-red-600',
      '1ère': 'from-indigo-500 to-indigo-600',
      'Terminale': 'from-pink-500 to-pink-600'
    };
    
    for (const [level, color] of Object.entries(colors)) {
      if (className.includes(level)) {
        return color;
      }
    }
    return 'from-gray-500 to-gray-600'; // Couleur par défaut
  };

  // Fonction pour obtenir la couleur du texte de la classe
  const getClassTextColor = (className) => {
    const colors = {
      '6ème': 'text-blue-600',
      '5ème': 'text-green-600',
      '4ème': 'text-purple-600',
      '3ème': 'text-orange-600',
      '2nde': 'text-red-600',
      '1ère': 'text-indigo-600',
      'Terminale': 'text-pink-600'
    };
    
    for (const [level, color] of Object.entries(colors)) {
      if (className.includes(level)) {
        return color;
      }
    }
    return 'text-gray-600'; // Couleur par défaut
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
              <FaSchool className="mr-4 text-blue-500 text-xl" />
              Gestion des classes
            </h1>
            <p className="text-lg text-gray-600">
              Gérez toutes les classes de votre établissement. Créez, modifiez ou supprimez des classes.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <FaPlus className="mr-2 text-lg" />
            Créer une classe
          </motion.button>
        </div>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher une classe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Filtre par statut */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
            className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
                className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-medium"
              >
                Activer ({selectedClasses.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('deactivate')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg font-medium"
              >
                Désactiver ({selectedClasses.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('delete')}
                className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium"
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
                        setSelectedClasses(filteredClasses.map(c => c._id));
                      } else {
                        setSelectedClasses([]);
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 text-lg">Classe</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 text-lg">Professeur</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 text-lg">Matière</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 text-lg">Salle</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 text-lg">Élèves</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 text-lg">Statut</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 text-lg">Note moyenne</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 text-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClasses.map((cls, index) => (
                <motion.tr
                  key={cls._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClasses([...selectedClasses, cls._id]);
                        } else {
                          setSelectedClasses(selectedClasses.filter(id => id !== cls._id));
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${getClassColor(cls.nom)} rounded-xl flex items-center justify-center text-white font-bold mr-4 text-lg`}>
                        {cls.nom}
                      </div>
                      <div>
                        <p className={`font-medium text-lg ${getClassTextColor(cls.nom)}`}>{cls.nom}</p>
                        <p className="text-base text-gray-500">{cls.schedule}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <FaChalkboardTeacher className="text-gray-600 text-lg" />
                      </div>
                      <span className="font-medium text-gray-900 text-lg">{cls.professeurPrincipal}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-purple-100 text-purple-800">
                      {cls.subject}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-400 mr-2 text-lg" />
                      <span className="font-medium text-gray-900 text-lg">{cls.room}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaUsers className="text-gray-400 mr-2 text-lg" />
                      <span className={`font-medium text-lg ${getOccupancyColor(cls.currentStudents, cls.capacity)}`}>
                        {cls.currentStudents}/{cls.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${getStatusColor(cls.status)}`}>
                      {cls.status === 'active' ? 'Actif' : 
                       cls.status === 'inactive' ? 'Inactif' : 'Maintenance'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-2 text-lg" />
                      <span className={`font-medium text-lg ${getGradeColor(cls.averageGrade)}`}>
                        {cls.averageGrade}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingClass(cls);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xl"
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
                        className="text-red-600 hover:text-red-800 text-xl"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Créer une classe</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">Niveau</label>
                    <select
                      value={newClass.niveau}
                      onChange={(e) => setNewClass({...newClass, niveau: e.target.value})}
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    >
                      <option value="">Sélectionner</option>
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">Section</label>
                    <select
                      value={newClass.section}
                      onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    >
                      <option value="">Sélectionner</option>
                      {sections.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Professeur principal</label>
                  <select
                    value={newClass.professeurPrincipal}
                    onChange={(e) => setNewClass({...newClass, professeurPrincipal: e.target.value})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    <option value="">Sélectionner un professeur</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher.name}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Capacité</label>
                  <input
                    type="number"
                    value={newClass.effectif}
                    onChange={(e) => setNewClass({...newClass, effectif: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
              <div className="flex space-x-6 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddClass}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-medium text-lg"
                >
                  Créer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-medium text-lg"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Modifier la classe</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">Niveau</label>
                    <select
                      value={editingClass.niveau}
                      onChange={(e) => setEditingClass({...editingClass, niveau: e.target.value})}
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">Section</label>
                    <select
                      value={editingClass.section}
                      onChange={(e) => setEditingClass({...editingClass, section: e.target.value})}
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    >
                      {sections.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Professeur principal</label>
                  <select
                    value={editingClass.professeurPrincipal}
                    onChange={(e) => setEditingClass({...editingClass, professeurPrincipal: e.target.value})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher.name}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Capacité</label>
                  <input
                    type="number"
                    value={editingClass.capacity}
                    onChange={(e) => setEditingClass({...editingClass, capacity: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Statut</label>
                  <select
                    value={editingClass.status}
                    onChange={(e) => setEditingClass({...editingClass, status: e.target.value})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-6 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditClass}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-medium text-lg"
                >
                  Modifier
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-medium text-lg"
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
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaExclamationTriangle className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Confirmer la suppression</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Êtes-vous sûr de vouloir supprimer la classe <strong>{editingClass.nom}</strong> ? 
                  Cette action est irréversible.
                </p>
                <div className="flex space-x-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteClass(editingClass._id)}
                    className="flex-1 bg-red-500 text-white py-4 rounded-xl font-medium text-lg"
                  >
                    Supprimer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-medium text-lg"
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