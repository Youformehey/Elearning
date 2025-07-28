import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

// Fonction utilitaire pour les requêtes API
const apiRequest = async (endpoint, options = {}) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const token = userInfo.token;
  
  console.log(`🔗 Appel API: ${API_BASE_URL}${endpoint}`);
  console.log(`🔑 Token présent: ${!!token}`);
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log(`📡 Réponse: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Erreur API:', errorData);
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Données reçues:`, data);
    return data;
  } catch (error) {
    console.error('❌ Erreur API:', error);
    throw error;
  }
};

// ===== DASHBOARD ÉTUDIANT =====
export const getStudentDashboard = async () => {
  try {
    const dashboard = await apiRequest('/student/dashboard');
    console.log('✅ Dashboard étudiant récupéré:', dashboard);
    return dashboard;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return {
      totalCourses: 6,
      averageGrade: 14.5,
      attendanceRate: 95,
      upcomingAssignments: 3,
      recentGrades: 8,
      nextClass: 'Mathématiques - 8h00',
      totalAbsences: 2,
      completedAssignments: 15
    };
  }
};

// ===== GESTION DES COURS =====
export const getStudentCourses = async () => {
  try {
    const courses = await apiRequest('/student/courses');
    console.log('✅ Cours de l\'étudiant récupérés:', courses);
    return courses;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        _id: '1',
        title: 'Mathématiques',
        teacher: 'M. Dupont',
        schedule: 'Lundi 8h-10h, Mercredi 14h-16h',
        room: 'Salle 101',
        progress: 75,
        averageGrade: 15.5,
        assignments: 5,
        completedAssignments: 4
      },
      {
        _id: '2',
        title: 'Français',
        teacher: 'Mme Martin',
        schedule: 'Mardi 10h-12h, Jeudi 16h-18h',
        room: 'Salle 102',
        progress: 60,
        averageGrade: 14.2,
        assignments: 3,
        completedAssignments: 2
      },
      {
        _id: '3',
        title: 'Sciences',
        teacher: 'M. Bernard',
        schedule: 'Vendredi 8h-10h',
        room: 'Labo Sciences',
        progress: 45,
        averageGrade: 13.8,
        assignments: 4,
        completedAssignments: 2
      }
    ];
  }
};

// ===== GESTION DU PLANNING =====
export const getStudentSchedule = async () => {
  try {
    const schedule = await apiRequest('/student/schedule');
    console.log('✅ Planning de l\'étudiant récupéré:', schedule);
    return schedule;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return {
      currentWeek: [
        {
          day: 'Lundi',
          date: '2025-01-27',
          classes: [
            { time: '8h-10h', subject: 'Mathématiques', teacher: 'M. Dupont', room: 'Salle 101' },
            { time: '14h-16h', subject: 'Mathématiques', teacher: 'M. Dupont', room: 'Salle 101' }
          ]
        },
        {
          day: 'Mardi',
          date: '2025-01-28',
          classes: [
            { time: '10h-12h', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 102' },
            { time: '14h-16h', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 102' }
          ]
        },
        {
          day: 'Mercredi',
          date: '2025-01-29',
          classes: [
            { time: '8h-10h', subject: 'Mathématiques', teacher: 'M. Dupont', room: 'Salle 101' },
            { time: '14h-16h', subject: 'Mathématiques', teacher: 'M. Dupont', room: 'Salle 101' }
          ]
        },
        {
          day: 'Jeudi',
          date: '2025-01-30',
          classes: [
            { time: '10h-12h', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 102' },
            { time: '14h-16h', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 102' }
          ]
        },
        {
          day: 'Vendredi',
          date: '2025-01-31',
          classes: [
            { time: '8h-10h', subject: 'Sciences', teacher: 'M. Bernard', room: 'Labo Sciences' },
            { time: '10h-12h', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 102' }
          ]
        }
      ],
      nextWeek: []
    };
  }
};

// ===== GESTION DES NOTES =====
export const getStudentGrades = async () => {
  try {
    const grades = await apiRequest('/student/grades');
    console.log('✅ Notes de l\'étudiant récupérées:', grades);
    return grades;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        course: 'Mathématiques',
        teacher: 'M. Dupont',
        grades: [
          { type: 'Contrôle', grade: 16, date: '2025-01-15', weight: 0.3 },
          { type: 'Devoir', grade: 14, date: '2025-01-20', weight: 0.2 },
          { type: 'Examen', grade: 17, date: '2025-01-25', weight: 0.5 }
        ],
        average: 15.5
      },
      {
        course: 'Français',
        teacher: 'Mme Martin',
        grades: [
          { type: 'Contrôle', grade: 13, date: '2025-01-16', weight: 0.3 },
          { type: 'Devoir', grade: 15, date: '2025-01-21', weight: 0.2 },
          { type: 'Examen', grade: 14, date: '2025-01-26', weight: 0.5 }
        ],
        average: 14.2
      },
      {
        course: 'Sciences',
        teacher: 'M. Bernard',
        grades: [
          { type: 'Contrôle', grade: 12, date: '2025-01-17', weight: 0.3 },
          { type: 'Devoir', grade: 14, date: '2025-01-22', weight: 0.2 },
          { type: 'Examen', grade: 15, date: '2025-01-27', weight: 0.5 }
        ],
        average: 13.8
      }
    ];
  }
};

// Hook pour le refresh automatique
export const useStudentAutoRefresh = (fetchFunction, interval = 30000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du fetch:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
    
    const intervalId = setInterval(fetchData, interval);
    
    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    lastUpdate,
    refresh 
  };
}; 