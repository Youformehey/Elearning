const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';

const config = {
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const testTeachersCRUD = async () => {
  try {
    console.log('🧪 Test des opérations CRUD pour les professeurs...\n');

    // 1. Test GET - Récupérer tous les professeurs
    console.log('1️⃣ Test GET /admin/teachers');
    try {
      const getResponse = await axios.get(`${API_BASE_URL}/admin/teachers`, config);
      console.log('✅ GET réussi:', getResponse.data.length, 'professeurs trouvés');
      console.log('📋 Professeurs:', getResponse.data.map(t => t.name));
    } catch (error) {
      console.error('❌ GET échoué:', error.response?.data || error.message);
    }

    // 2. Test POST - Créer un nouveau professeur
    console.log('\n2️⃣ Test POST /admin/teachers');
    const newTeacher = {
      name: 'Test Professeur',
      email: 'test.professeur@test.com',
      telephone: '0123456789',
      matiere: 'Mathématiques',
      status: 'active'
    };

    try {
      const postResponse = await axios.post(`${API_BASE_URL}/admin/teachers`, newTeacher, config);
      console.log('✅ POST réussi:', postResponse.data.message);
      const createdTeacherId = postResponse.data.teacher._id;
      console.log('🆔 ID du professeur créé:', createdTeacherId);

      // 3. Test PUT - Modifier le professeur
      console.log('\n3️⃣ Test PUT /admin/teachers/:id');
      const updatedTeacher = {
        ...newTeacher,
        name: 'Test Professeur Modifié',
        telephone: '0987654321'
      };

      const putResponse = await axios.put(`${API_BASE_URL}/admin/teachers/${createdTeacherId}`, updatedTeacher, config);
      console.log('✅ PUT réussi:', putResponse.data.message);

      // 4. Test DELETE - Supprimer le professeur
      console.log('\n4️⃣ Test DELETE /admin/teachers/:id');
      const deleteResponse = await axios.delete(`${API_BASE_URL}/admin/teachers/${createdTeacherId}`, config);
      console.log('✅ DELETE réussi:', deleteResponse.data.message);

    } catch (error) {
      console.error('❌ POST/PUT/DELETE échoué:', error.response?.data || error.message);
    }

    // 5. Test GET après suppression
    console.log('\n5️⃣ Test GET après suppression');
    try {
      const finalGetResponse = await axios.get(`${API_BASE_URL}/admin/teachers`, config);
      console.log('✅ GET final réussi:', finalGetResponse.data.length, 'professeurs restants');
    } catch (error) {
      console.error('❌ GET final échoué:', error.response?.data || error.message);
    }

    console.log('\n🎉 Tests CRUD terminés!');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
};

// Exécuter les tests
testTeachersCRUD(); 