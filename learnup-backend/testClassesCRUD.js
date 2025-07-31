const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';

const config = {
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const testClassesCRUD = async () => {
  try {
    console.log('🧪 Test des opérations CRUD pour les classes...\n');

    // 1. Test GET - Récupérer toutes les classes
    console.log('1️⃣ Test GET /admin/classes');
    try {
      const getResponse = await axios.get(`${API_BASE_URL}/admin/classes`, config);
      console.log('✅ GET réussi:', getResponse.data.length, 'classes trouvées');
      console.log('📋 Classes:', getResponse.data.map(c => c.nom));
    } catch (error) {
      console.error('❌ GET échoué:', error.response?.data || error.message);
    }

    // 2. Test POST - Créer une nouvelle classe
    console.log('\n2️⃣ Test POST /admin/classes');
    const newClass = {
      nom: 'Test Classe',
      niveau: '6ème',
      section: 'T',
      effectif: 25,
      professeurPrincipal: null,
      status: 'active',
      salle: 'Salle Test',
      horaire: 'Lundi, Mardi',
      capacite: 30
    };

    try {
      const postResponse = await axios.post(`${API_BASE_URL}/admin/classes`, newClass, config);
      console.log('✅ POST réussi:', postResponse.data.message);
      const createdClassId = postResponse.data.class._id;
      console.log('🆔 ID de la classe créée:', createdClassId);

      // 3. Test PUT - Modifier la classe
      console.log('\n3️⃣ Test PUT /admin/classes/:id');
      const updatedClass = {
        ...newClass,
        nom: 'Test Classe Modifiée',
        salle: 'Salle Test Modifiée'
      };

      const putResponse = await axios.put(`${API_BASE_URL}/admin/classes/${createdClassId}`, updatedClass, config);
      console.log('✅ PUT réussi:', putResponse.data.message);

      // 4. Test DELETE - Supprimer la classe
      console.log('\n4️⃣ Test DELETE /admin/classes/:id');
      const deleteResponse = await axios.delete(`${API_BASE_URL}/admin/classes/${createdClassId}`, config);
      console.log('✅ DELETE réussi:', deleteResponse.data.message);

    } catch (error) {
      console.error('❌ POST/PUT/DELETE échoué:', error.response?.data || error.message);
    }

    // 5. Test GET après suppression
    console.log('\n5️⃣ Test GET après suppression');
    try {
      const finalGetResponse = await axios.get(`${API_BASE_URL}/admin/classes`, config);
      console.log('✅ GET final réussi:', finalGetResponse.data.length, 'classes restantes');
    } catch (error) {
      console.error('❌ GET final échoué:', error.response?.data || error.message);
    }

    console.log('\n🎉 Tests CRUD terminés!');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
};

// Exécuter les tests
testClassesCRUD(); 