import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, 
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
  FaBell, FaTachometerAlt, FaUsers, FaUserGraduate,
  FaChalkboardTeacher, FaUserShield, FaBuilding, FaUniversity,
  FaPlay, FaPause, FaStop, FaForward, FaBackward, FaVolumeUp,
  FaVolumeMute, FaMicrophone, FaVideo, FaCamera, FaImage,
  FaChild, FaBaby, FaBabyCarriage, FaHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdminParents = () => {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedParents, setSelectedParents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [newParent, setNewParent] = useState({
    name: '',
    email: '',
    tel: '',
    adresse: '',
    children: [],
    status: 'active'
  });

  // Fetch real data from backend
  useEffect(() => {
    const token = localStorage.getItem('token') || 'TOKEN_PAR_DÉFAUT';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };


    const fetchParents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        
        console.log('🔄 Tentative de récupération des parents depuis l\'API...');
        console.log('🔗 URL:', 'http://localhost:5001/api/admin/parents');
        console.log('🔑 Token:', token);
        
        const response = await axios.get('http://localhost:5001/api/admin/parents', config);
        console.log('✅ Parents Data reçus:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          console.log('✅ Données valides reçues, nombre de parents:', response.data.length);
          
          const formattedParents = response.data.map(parent => {
            const childIds = Array.isArray(parent.children) ? parent.children : (parent.enfants || []);

            const childrenNames = students
              .filter(student => childIds.includes(student._id))
              .map(student => student.name);

            return {
              _id: parent._id,
              name: parent.name || 'Nom non défini',
              email: parent.email,
              tel: parent.tel || parent.telephone || 'Non renseigné',
              adresse: parent.adresse || '',
              children: childIds,
              childrenNames,
              status: parent.status || 'active',
              dateInscription: parent.dateInscription,
              derniereConnexion: parent.derniereConnexion
            };
          });

          
          console.log('✅ Parents formatés pour l\'affichage:', formattedParents);
          setParents(formattedParents);
          setFilteredParents(formattedParents);
        } else {
          console.warn('⚠️ Données reçues mais format invalide:', response.data);
          throw new Error('Format de données invalide');
        }
      } catch (err) {
        console.error('❌ Error fetching parents:', err);
        console.error('❌ Détails de l\'erreur:', err.response?.data || err.message);
        setError('Erreur lors du chargement des parents: ' + (err.response?.data?.message || err.message));
        
        console.log('🔄 Utilisation des données mockées pour les parents...');
        // Fallback to mock data if API fails
        const mockParents = [
          {
            _id: 1,
            name: "Marie Dubois",
            email: "marie.dubois@email.com",
            tel: "06 12 34 56 78",
            adresse: "123 Rue de la Paix, Paris",
            children: ["Jean Dubois", "Sophie Dubois"],
            status: "active",
            dateInscription: "2023-09-01",
            derniereConnexion: "2024-01-15"
          },
          {
            _id: 2,
            name: "Pierre Martin",
            email: "pierre.martin@email.com",
            tel: "06 98 76 54 32",
            adresse: "456 Avenue des Champs, Lyon",
            children: ["Lucas Martin"],
            status: "active",
            dateInscription: "2023-08-15",
            derniereConnexion: "2024-01-10"
          },
          {
            _id: 3,
            name: "Sophie Bernard",
            email: "sophie.bernard@email.com",
            tel: "06 45 67 89 01",
            adresse: "789 Boulevard de la République, Marseille",
            children: ["Emma Bernard", "Thomas Bernard"],
            status: "active",
            dateInscription: "2023-09-15",
            derniereConnexion: "2024-01-12"
          },
          {
            _id: 4,
            name: "Jean Dupont",
            email: "jean.dupont@email.com",
            tel: "06 23 45 67 89",
            adresse: "321 Rue du Commerce, Toulouse",
            children: ["Marie Dupont"],
            status: "inactive",
            dateInscription: "2023-08-20",
            derniereConnexion: "2023-12-20"
          },
          {
            _id: 5,
            name: "Isabelle Moreau",
            email: "isabelle.moreau@email.com",
            tel: "06 78 90 12 34",
            adresse: "654 Rue des Fleurs, Nice",
            children: ["Alexandre Moreau", "Camille Moreau", "Léa Moreau"],
            status: "active",
            dateInscription: "2023-10-05",
            derniereConnexion: "2024-01-14"
          },
          {
            _id: 6,
            name: "François Leroy",
            email: "francois.leroy@email.com",
            tel: "06 56 78 90 12",
            adresse: "987 Avenue Victor Hugo, Bordeaux",
            children: ["Hugo Leroy"],
            status: "active",
            dateInscription: "2023-09-20",
            derniereConnexion: "2024-01-13"
          },
          {
            _id: 7,
            name: "Catherine Roux",
            email: "catherine.roux@email.com",
            tel: "06 34 56 78 90",
            adresse: "147 Rue de la Liberté, Nantes",
            children: ["Sarah Roux", "Paul Roux"],
            status: "suspended",
            dateInscription: "2023-08-10",
            derniereConnexion: "2023-11-15"
          },
          {
            _id: 8,
            name: "Michel Blanc",
            email: "michel.blanc@email.com",
            tel: "06 90 12 34 56",
            adresse: "258 Place de la République, Strasbourg",
            children: ["Antoine Blanc"],
            status: "active",
            dateInscription: "2023-09-25",
            derniereConnexion: "2024-01-16"
          }
        ];
        console.log('✅ Données mockées des parents:', mockParents);
        setParents(mockParents);
        setFilteredParents(mockParents);
      } finally {
        setLoading(false);
      }
    };

    
    const fetchStudents = async () => {
    try {
        const response = await axios.get("http://localhost:5001/api/admin/students", config);
        setStudents(response.data); // Assure-toi que le backend retourne un tableau d'étudiants avec `_id` et `name`
      } catch (err) {
        console.error("❌ Erreur lors du chargement des étudiants :", err);
      }
    };
    
    fetchParents();
    fetchStudents();
  }, []);

  const statuses = ['active', 'inactive', 'suspended'];

  useEffect(() => {
    console.log('🔄 Filtrage des parents...', { searchTerm, selectedStatus, parents });
    filterParents();
  }, [searchTerm, selectedStatus, parents]);

  const filterParents = () => {
    let filtered = parents;
    console.log('📊 Parents avant filtrage:', filtered);

    if (searchTerm) {
      filtered = filtered.filter(parent =>
        parent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.tel?.includes(searchTerm)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(parent => parent.status === selectedStatus);
    }

    console.log('📊 Parents après filtrage:', filtered);
    setFilteredParents(filtered);
  };

  const handleAddParent = async () => {
    try {
      const token = localStorage.getItem('token') || 'TOKEN_PAR_DÉFAUT';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const { name, email, tel, adresse, children, status, password } = newParent;
      
      const payload = {
        name,
        email,
        password,
        tel,
        adresse,
        children,
        status
      };
        console.log("Payload envoyé :", payload);

      const response = await axios.post('http://localhost:5001/api/admin/parents', payload, config);

      // Recharger la liste après ajout
      setParents([...parents, response.data]);
      setNewParent({
        name: '',
        email: '',
        tel: '',
        adresse: '',
        children: [],
        status: 'active'
      });
      setShowAddModal(false);
      window.location.reload();
    } catch (err) {
      console.error('❌ Error adding parent:', err);
      alert('Erreur lors de l\'ajout du parent');
    }
  };


  const handleEditParent = async () => {
    try {
      console.log('🔄 Tentative de modification du parent:', editingParent);
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log('📤 Données envoyées:', editingParent);
      const response = await axios.put(`http://localhost:5001/api/admin/parents/${editingParent._id}`, editingParent, config);
      console.log('✅ Parent updated:', response.data);
      
      const updatedParents = parents.map(parent =>
        parent._id === editingParent._id ? response.data : parent
      );
      setParents(updatedParents);
      setEditingParent(null);
      setShowEditModal(false);
    } catch (err) {
      console.error('❌ Error updating parent:', err);
      console.error('❌ Détails de l\'erreur:', err.response?.data || err.message);
      alert(`Erreur lors de la modification du parent: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteParent = async (id) => {
    try {
      console.log('🔄 Tentative de suppression du parent:', id);
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.delete(`http://localhost:5001/api/admin/parents/${id}`, config);
      console.log('✅ Parent deleted:', id);
      console.log('✅ Réponse de suppression:', response.data);
      
      setParents(parents.filter(parent => parent._id !== id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('❌ Error deleting parent:', err);
      console.error('❌ Détails de l\'erreur:', err.response?.data || err.message);
      alert(`Erreur lors de la suppression du parent: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      console.log('🔄 Action en masse:', action, 'pour', selectedParents.length, 'parents');
      
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      switch (action) {
        case 'activate':
          console.log('📝 Activation de', selectedParents.length, 'parents');
          await Promise.all(selectedParents.map(id => 
            axios.put(`http://localhost:5001/api/admin/parents/${id}`, { status: 'active' }, config)
          ));
          setParents(parents.map(parent =>
            selectedParents.includes(parent._id)
              ? { ...parent, status: 'active' }
              : parent
          ));
          break;
        case 'deactivate':
          console.log('📝 Désactivation de', selectedParents.length, 'parents');
          await Promise.all(selectedParents.map(id => 
            axios.put(`http://localhost:5001/api/admin/parents/${id}`, { status: 'inactive' }, config)
          ));
          setParents(parents.map(parent =>
            selectedParents.includes(parent._id)
              ? { ...parent, status: 'inactive' }
              : parent
          ));
          break;
        case 'delete':
          console.log('🗑️ Suppression de', selectedParents.length, 'parents');
          await Promise.all(selectedParents.map(id => 
            axios.delete(`http://localhost:5001/api/admin/parents/${id}`, config)
          ));
          setParents(parents.filter(parent => !selectedParents.includes(parent._id)));
          break;
      }
      console.log('✅ Action en masse terminée avec succès');
      setSelectedParents([]);
    } catch (err) {
      console.error('❌ Error in bulk action:', err);
      console.error('❌ Détails de l\'erreur:', err.response?.data || err.message);
      alert(`Erreur lors de l'action en masse: ${err.response?.data?.message || err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChildrenCountColor = (count) => {
    if (count >= 3) return 'text-purple-600';
    if (count >= 2) return 'text-blue-600';
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
              <FaUser className="mr-3 text-teal-500" />
              Gestion des parents
            </h1>
            <p className="text-gray-600">
              Gérez tous les parents de votre établissement. Ajoutez, modifiez ou supprimez des profils.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <FaPlus className="mr-2" />
            Ajouter un parent
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{parents.length}</p>
              <p className="text-sm text-gray-600">Total Parents</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <FaCheck className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {parents.filter(p => p.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Actifs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
              <FaTimes className="text-gray-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {parents.filter(p => p.status === 'inactive').length}
              </p>
              <p className="text-sm text-gray-600">Inactifs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {parents.filter(p => p.status === 'suspended').length}
              </p>
              <p className="text-sm text-gray-600">Suspendus</p>
            </div>
          </div>
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
              placeholder="Rechercher un parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Filtre par statut */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>

          {/* Actions en masse */}
          {selectedParents.length > 0 && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('activate')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Activer ({selectedParents.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('deactivate')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Désactiver ({selectedParents.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('delete')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Supprimer ({selectedParents.length})
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tableau des parents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedParents(filteredParents.map(p => p._id));
                      } else {
                        setSelectedParents([]);
                      }
                    }}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Parent</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Enfants</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Adresse</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Dernière connexion</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredParents.length > 0 ? (
                filteredParents.map((parent, index) => (
                  <motion.tr
                    key={parent._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedParents.includes(parent._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedParents([...selectedParents, parent._id]);
                          } else {
                            setSelectedParents(selectedParents.filter(id => id !== parent._id));
                          }
                        }}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                          <FaUser className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-lg">{parent.name}</p>
                          <p className="text-base text-gray-500">{parent.email}</p>

                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-base">
                          <FaPhone className="w-5 h-5 text-gray-400" />
                          {parent.tel}
                        </div>
                        <div className="flex items-center gap-2 text-base">
                          <FaEnvelope className="w-5 h-5 text-gray-400" />
                          {parent.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <FaChild className="text-gray-400 mr-2 text-lg" />
                        <span className={`font-medium text-lg ${getChildrenCountColor((parent.children || []).length)}`}>
                          {(parent.children || []).length} enfant(s)
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {(parent.childrenNames || []).join(', ')}
                      </div>

                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-400 mr-2 text-lg" />
                        <span className="text-base text-gray-600 max-w-xs truncate">
                          {parent.adresse}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${getStatusColor(parent.status)}`}>
                        {parent.status === 'active' ? 'Actif' : 
                         parent.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <FaCalendar className="text-gray-400 mr-2 text-lg" />
                        <span className="text-base text-gray-600">
                          {parent.derniereConnexion ? new Date(parent.derniereConnexion).toLocaleDateString('fr-FR') : 'N/A'}
                        </span>

                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingParent(parent);
                            setShowEditModal(true);
                          }}
                          className="text-teal-600 hover:text-teal-800 text-xl"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingParent(parent);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 text-xl"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-8 py-12 text-center">
                    <div className="text-gray-500">
                      <FaUser className="mx-auto text-4xl mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Aucun parent trouvé</p>
                      <p className="text-sm">Les parents apparaîtront ici une fois ajoutés.</p>
                    </div>
                  </td>
                </tr>
              )}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Ajouter un parent</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Nom complet</label>
                  <input
                    type="text"
                    value={newParent.name}
                    onChange={(e) => setNewParent({...newParent, name: e.target.value})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                    placeholder="Nom et prénom"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Email</label>
                  <input
                    type="email"
                    value={newParent.email}
                    onChange={(e) => setNewParent({...newParent, email: e.target.value})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Mot de passe</label>
                  <input
                    type="password"
                    value={newParent.password}
                    onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                    placeholder="Mot de passe"
                  />
              </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Téléphone</label>
                  <input
                    type="tel"
                    value={newParent.tel}
                    onChange={(e) => setNewParent({...newParent, tel: e.target.value})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">Adresse</label>
                  <textarea
                    value={newParent.adresse}
                    onChange={(e) => setNewParent({...newParent, adresse: e.target.value})}
                    rows="3"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                    placeholder="Adresse complète..."
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Enfants (choisir dans la liste)
                  </label>
                  <select
                    multiple
                    value={newParent.children}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                      setNewParent({ ...newParent, children: selected });
                    }}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                  >
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-6 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddParent}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-xl font-medium text-lg"
                >
                  Ajouter
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
        {showEditModal && editingParent && (
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifier le parent</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={editingParent.name}
                    onChange={(e) => setEditingParent({...editingParent, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingParent.email}
                    onChange={(e) => setEditingParent({...editingParent, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={editingParent.tel}
                    onChange={(e) => setEditingParent({...editingParent, tel: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <textarea
                    value={editingParent.adresse}
                    onChange={(e) => setEditingParent({...editingParent, adresse: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enfants (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={editingParent.children.join(', ')}
                    onChange={(e) => setEditingParent({...editingParent, children: e.target.value.split(',').map(child => child.trim()).filter(child => child)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={editingParent.status}
                    onChange={(e) => setEditingParent({...editingParent, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  onClick={handleEditParent}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-medium"
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
        {showDeleteModal && editingParent && (
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
                  Êtes-vous sûr de vouloir supprimer le parent <strong>{editingParent.name}</strong> ? 
                  Cette action est irréversible.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteParent(editingParent._id)}
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

export default AdminParents; 