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

// ===== DASHBOARD PROFESSEUR =====
export const getTeacherDashboard = async () => {
  try {
    const dashboard = await apiRequest('/teacher/dashboard');
    console.log('✅ Dashboard professeur récupéré:', dashboard);
    return dashboard;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return {
      totalCourses: 4,
      totalStudents: 45,
      totalClasses: 3,
      upcomingClasses: 2,
      recentGrades: 12,
      pendingAssignments: 5,
      attendanceRate: 92,
      averageGrade: 15.5
    };
  }
};

// ===== GESTION DES COURS =====
export const getTeacherCourses = async () => {
  try {
    const courses = await apiRequest('/teacher/courses');
    console.log('✅ Cours du professeur récupérés:', courses);
    return courses;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        _id: '1',
        title: 'Mathématiques - 6A',
        subject: 'Mathématiques',
        class: '6A',
        students: 25,
        schedule: 'Lundi 8h-10h, Mercredi 14h-16h',
        status: 'active',
        progress: 75
      },
      {
        _id: '2',
        title: 'Français - 5A',
        subject: 'Français',
        class: '5A',
        students: 22,
        schedule: 'Mardi 10h-12h, Jeudi 16h-18h',
        status: 'active',
        progress: 60
      }
    ];
  }
};

// ===== GESTION DES CLASSES =====
export const getTeacherClasses = async () => {
  try {
    const classes = await apiRequest('/teacher/classes');
    console.log('✅ Classes du professeur récupérées:', classes);
    return classes;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        _id: '1',
        name: '6A',
        level: '6ème',
        students: 25,
        subjects: ['Mathématiques', 'Sciences'],
        schedule: {
          monday: ['8h-10h', '14h-16h'],
          tuesday: ['10h-12h'],
          wednesday: ['8h-10h', '14h-16h'],
          thursday: ['10h-12h'],
          friday: ['8h-10h']
        }
      },
      {
        _id: '2',
        name: '5A',
        level: '5ème',
        students: 22,
        subjects: ['Français', 'Histoire'],
        schedule: {
          monday: ['10h-12h'],
          tuesday: ['8h-10h', '14h-16h'],
          wednesday: ['10h-12h'],
          thursday: ['8h-10h', '14h-16h'],
          friday: ['10h-12h']
        }
      }
    ];
  }
};

// ===== GESTION DU PLANNING =====
export const getTeacherSchedule = async () => {
  try {
    const schedule = await apiRequest('/teacher/schedule');
    console.log('✅ Planning du professeur récupéré:', schedule);
    return schedule;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return {
      currentWeek: [
        {
          day: 'Lundi',
          date: '2025-01-27',
          classes: [
            { time: '8h-10h', subject: 'Mathématiques', class: '6A', room: 'Salle 101' },
            { time: '14h-16h', subject: 'Mathématiques', class: '6A', room: 'Salle 101' }
          ]
        },
        {
          day: 'Mardi',
          date: '2025-01-28',
          classes: [
            { time: '10h-12h', subject: 'Français', class: '5A', room: 'Salle 102' },
            { time: '14h-16h', subject: 'Français', class: '5A', room: 'Salle 102' }
          ]
        },
        {
          day: 'Mercredi',
          date: '2025-01-29',
          classes: [
            { time: '8h-10h', subject: 'Mathématiques', class: '6A', room: 'Salle 101' },
            { time: '14h-16h', subject: 'Mathématiques', class: '6A', room: 'Salle 101' }
          ]
        },
        {
          day: 'Jeudi',
          date: '2025-01-30',
          classes: [
            { time: '10h-12h', subject: 'Français', class: '5A', room: 'Salle 102' },
            { time: '14h-16h', subject: 'Français', class: '5A', room: 'Salle 102' }
          ]
        },
        {
          day: 'Vendredi',
          date: '2025-01-31',
          classes: [
            { time: '8h-10h', subject: 'Mathématiques', class: '6A', room: 'Salle 101' },
            { time: '10h-12h', subject: 'Français', class: '5A', room: 'Salle 102' }
          ]
        }
      ],
      nextWeek: []
    };
  }
};

// ===== GESTION DES NOTES =====
export const getCourseGrades = async (courseId) => {
  try {
    const grades = await apiRequest(`/teacher/courses/${courseId}/grades`);
    console.log('✅ Notes du cours récupérées:', grades);
    return grades;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        _id: '1',
        student: { name: 'Jean Dupont', email: 'jean@example.com' },
        note: 16,
        type: 'Contrôle',
        date: '2025-01-15',
        comment: 'Très bon travail'
      },
      {
        _id: '2',
        student: { name: 'Marie Martin', email: 'marie@example.com' },
        note: 14,
        type: 'Devoir',
        date: '2025-01-20',
        comment: 'Bien, peut mieux faire'
      }
    ];
  }
};

// Hook pour le refresh automatique
export const useTeacherAutoRefresh = (fetchFunction, interval = 30000) => {
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