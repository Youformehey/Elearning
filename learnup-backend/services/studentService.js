const getStudentDashboard = async (studentId) => {
  try {
    // Vérification de l'ID
    if (!studentId) {
      throw new Error("ID étudiant requis");
    }

    // Récupération des données de l'étudiant
    const student = await Student.findById(studentId)
      .populate('classe')
      .populate('courses');

    if (!student) {
      throw new Error("Étudiant non trouvé");
    }

    // Formater les données
    const dashboardData = {
      student: {
        _id: student._id,
        name: student.name,
        classe: student.classe?.nom || 'Non assignée',
      },
      courses: student.courses || [],
      // Ajoutez d'autres données si nécessaire
    };

    return dashboardData;

  } catch (error) {
    console.error("Erreur getStudentDashboard:", error);
    throw error;
  }
};