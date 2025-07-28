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

// ===== DASHBOARD PARENT =====
export const getParentDashboard = async () => {
  try {
    const dashboard = await apiRequest('/parent/dashboard');
    console.log('✅ Dashboard parent récupéré:', dashboard);
    return dashboard;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return {
      totalChildren: 2,
      totalCourses: 8,
      averageGrade: 14.2,
      attendanceRate: 96,
      upcomingEvents: 3,
      recentGrades: 15,
      nextClass: 'Mathématiques - 8h00',
      totalAbsences: 1
    };
  }
};

// ===== GESTION DES ENFANTS =====
export const getParentChildren = async () => {
  try {
    const children = await apiRequest('/parent/children');
    console.log('✅ Enfants du parent récupérés:', children);
    return children;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        _id: '1',
        name: 'Jean Dupont',
        age: 15,
        class: '3ème A',
        averageGrade: 15.5,
        attendanceRate: 98,
        courses: 6,
        absences: 0
      },
      {
        _id: '2',
        name: 'Marie Dupont',
        age: 12,
        class: '6ème B',
        averageGrade: 13.8,
        attendanceRate: 94,
        courses: 5,
        absences: 2
      }
    ];
  }
};

// ===== COURS DES ENFANTS =====
export const getChildrenCourses = async (childId = null) => {
  try {
    const endpoint = childId ? `/parent/children/${childId}/courses` : '/parent/children/courses';
    const courses = await apiRequest(endpoint);
    console.log('✅ Cours des enfants récupérés:', courses);
    return courses;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        _id: '1',
        childName: 'Jean Dupont',
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
        childName: 'Jean Dupont',
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
        childName: 'Marie Dupont',
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

// ===== PLANNING DES ENFANTS =====
export const getChildrenSchedule = async (childId = null) => {
  try {
    const endpoint = childId ? `/parent/children/${childId}/schedule` : '/parent/children/schedule';
    const schedule = await apiRequest(endpoint);
    console.log('✅ Planning des enfants récupéré:', schedule);
    return schedule;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return {
      children: [
        {
          _id: '1',
          name: 'Jean Dupont',
          schedule: {
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
              }
            ]
          }
        },
        {
          _id: '2',
          name: 'Marie Dupont',
          schedule: {
            currentWeek: [
              {
                day: 'Lundi',
                date: '2025-01-27',
                classes: [
                  { time: '8h-10h', subject: 'Sciences', teacher: 'M. Bernard', room: 'Labo Sciences' },
                  { time: '10h-12h', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 102' }
                ]
              }
            ]
          }
        }
      ]
    };
  }
};

// ===== NOTES DES ENFANTS =====
export const getChildrenGrades = async (childId = null) => {
  try {
    const endpoint = childId ? `/parent/children/${childId}/grades` : '/parent/children/grades';
    const grades = await apiRequest(endpoint);
    console.log('✅ Notes des enfants récupérées:', grades);
    return grades;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        childName: 'Jean Dupont',
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
        childName: 'Marie Dupont',
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

// ===== ABSENCES DES ENFANTS =====
export const getChildrenAbsences = async (childId = null) => {
  try {
    const endpoint = childId ? `/parent/children/${childId}/absences` : '/parent/children/absences';
    const absences = await apiRequest(endpoint);
    console.log('✅ Absences des enfants récupérées:', absences);
    return absences;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        childName: 'Jean Dupont',
        absences: [
          { date: '2025-01-20', reason: 'Maladie', justified: true },
          { date: '2025-01-15', reason: 'Rendez-vous médical', justified: true }
        ],
        totalAbsences: 2,
        justifiedAbsences: 2
      },
      {
        childName: 'Marie Dupont',
        absences: [
          { date: '2025-01-18', reason: 'Maladie', justified: true }
        ],
        totalAbsences: 1,
        justifiedAbsences: 1
      }
    ];
  }
};

// ===== DEMANDES PARENT =====
export const getParentRequests = async () => {
  try {
    const requests = await apiRequest('/parent/requests');
    console.log('✅ Demandes parent récupérées:', requests);
    return requests;
  } catch (error) {
    console.log('⚠️ API non disponible, utilisation des données de test');
    return [
      {
        _id: '1',
        type: 'Rendez-vous',
        subject: 'Entretien avec le professeur principal',
        status: 'En attente',
        date: '2025-01-30',
        description: 'Souhaite discuter du progrès de mon enfant'
      },
      {
        _id: '2',
        type: 'Certificat',
        subject: 'Certificat de scolarité',
        status: 'Approuvé',
        date: '2025-01-25',
        description: 'Nécessaire pour les démarches administratives'
      }
    ];
  }
};

// ===== CRÉER UNE DEMANDE =====
export const createParentRequest = async (requestData) => {
  try {
    const request = await apiRequest('/parent/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    console.log('✅ Demande parent créée:', request);
    return request;
  } catch (error) {
    console.log('⚠️ API non disponible, simulation de création');
    return {
      _id: Date.now().toString(),
      ...requestData,
      status: 'En attente',
      date: new Date().toISOString().split('T')[0]
    };
  }
};

// Hook pour le refresh automatique
export const useParentAutoRefresh = (fetchFunction, interval = 30000) => {
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