const axios = require('axios');

async function testParentsAPI() {
  try {
    console.log('🔄 Test de l\'API parents...');

    const response = await axios.get('http://localhost:5001/api/admin/parents', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example'
      }
    });

    console.log('✅ Réponse API:');
    console.log('Nombre de parents:', response.data.length);

    if (response.data.length > 0) {
      console.log('\nPremier parent:');
      console.log(JSON.stringify(response.data[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testParentsAPI(); 