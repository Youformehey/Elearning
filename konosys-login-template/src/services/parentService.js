import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration axios avec token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Service pour les données parent
export const parentService = {
  // Récupérer le profil du parent avec ses enfants
  getParentProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parents/me`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Erreur récupération profil parent:', error);
      throw error;
    }
  },

  // Récupérer les notes des enfants
  getChildrenNotes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parents/children/notes`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Erreur récupération notes enfants:', error);
      throw error;
    }
  },

  // Récupérer les absences des enfants
  getChildrenAbsences: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parents/children/absences`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Erreur récupération absences enfants:', error);
      throw error;
    }
  },

  // Récupérer les formations des enfants
  getChildrenFormations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parents/children/formations`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Erreur récupération formations enfants:', error);
      throw error;
    }
  },

  // Récupérer les demandes des enfants
  getChildrenDemandes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parents/children/demandes`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Erreur récupération demandes enfants:', error);
      throw error;
    }
  },

  // Récupérer les formations disponibles
  getAvailableFormations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parents/formations`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Erreur récupération formations disponibles:', error);
      throw error;
    }
  },

  // Récupérer les statistiques globales
  getParentStats: async () => {
    try {
      const [profile, notes, absences, formations, demandes] = await Promise.all([
        parentService.getParentProfile(),
        parentService.getChildrenNotes(),
        parentService.getChildrenAbsences(),
        parentService.getChildrenFormations(),
        parentService.getChildrenDemandes()
      ]);

      // Calculer les statistiques
      const stats = {
        totalChildren: profile.children?.length || 0,
        totalNotes: 0,
        totalAbsences: 0,
        totalFormations: 0,
        totalDemandes: 0,
        averageGrade: 0,
        attendanceRate: 0,
        recentNotifications: 0
      };

      // Calculer les notes
      Object.values(notes).forEach(childData => {
        stats.totalNotes += childData.notes?.length || 0;
        if (childData.notes?.length > 0) {
          const grades = childData.notes.map(note => note.note).filter(grade => grade);
          if (grades.length > 0) {
            const avg = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
            stats.averageGrade = Math.round(avg * 10) / 10;
          }
        }
      });

      // Calculer les absences
      Object.values(absences).forEach(childData => {
        stats.totalAbsences += childData.stats?.totalAbsences || 0;
      });

      // Calculer les formations
      Object.values(formations).forEach(childData => {
        stats.totalFormations += childData.formations?.length || 0;
      });

      // Calculer les demandes
      Object.values(demandes).forEach(childData => {
        stats.totalDemandes += childData.demandes?.length || 0;
      });

      // Calculer le taux de présence (approximatif)
      const totalSessions = stats.totalAbsences * 10; // Estimation
      stats.attendanceRate = totalSessions > 0 ? Math.round(((totalSessions - stats.totalAbsences) / totalSessions) * 100) : 100;

      // Notifications récentes (demandes non traitées)
      Object.values(demandes).forEach(childData => {
        const recentDemandes = childData.demandes?.filter(d => 
          d.statut === 'en_attente' && 
          new Date(d.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ) || [];
        stats.recentNotifications += recentDemandes.length;
      });

      return {
        profile,
        stats,
        notes,
        absences,
        formations,
        demandes
      };
    } catch (error) {
      console.error('Erreur récupération statistiques parent:', error);
      throw error;
    }
  }
};

export default parentService; 