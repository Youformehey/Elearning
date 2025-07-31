const axios = require('axios');

async function testParentsEndpoints() {
  try {
    console.log('🔄 Test des endpoints parents...');
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // 1. Test GET /parents
    console.log('\n📋 1. Test GET /parents');
    try {
      const getAllResponse = await axios.get('http://localhost:5001/api/admin/parents', config);
      console.log('✅ GET /parents - Succès');
      console.log('   Nombre de parents:', getAllResponse.data.length);
      if (getAllResponse.data.length > 0) {
        console.log('   Premier parent:', getAllResponse.data[0].name);
      }
    } catch (error) {
      console.error('❌ GET /parents - Erreur:', error.response?.data || error.message);
    }

    // 2. Test GET /parents/:id (si des parents existent)
    try {
      const getAllResponse = await axios.get('http://localhost:5001/api/admin/parents', config);
      if (getAllResponse.data.length > 0) {
        const firstParentId = getAllResponse.data[0]._id;
        console.log('\n📋 2. Test GET /parents/:id');
        const getByIdResponse = await axios.get(`http://localhost:5001/api/admin/parents/${firstParentId}`, config);
        console.log('✅ GET /parents/:id - Succès');
        console.log('   Parent récupéré:', getByIdResponse.data.name);
      }
    } catch (error) {
      console.error('❌ GET /parents/:id - Erreur:', error.response?.data || error.message);
    }

    // 3. Test PUT /parents/:id (si des parents existent)
    try {
      const getAllResponse = await axios.get('http://localhost:5001/api/admin/parents', config);
      if (getAllResponse.data.length > 0) {
        const firstParent = getAllResponse.data[0];
        console.log('\n📝 3. Test PUT /parents/:id');
        const updateData = {
          name: 'Test Modification',
          email: 'test.modification@email.com',
          tel: '06 99 88 77 66',
          adresse: 'Adresse de test modifiée',
          children: ['Enfant Test 1', 'Enfant Test 2'],
          status: 'active'
        };
        const putResponse = await axios.put(`http://localhost:5001/api/admin/parents/${firstParent._id}`, updateData, config);
        console.log('✅ PUT /parents/:id - Succès');
        console.log('   Parent modifié:', putResponse.data.name);
      }
    } catch (error) {
      console.error('❌ PUT /parents/:id - Erreur:', error.response?.data || error.message);
    }

    // 4. Test DELETE /parents/:id (optionnel - commenté pour éviter de supprimer des données)
    /*
    try {
      const getAllResponse = await axios.get('http://localhost:5001/api/admin/parents', config);
      if (getAllResponse.data.length > 0) {
        const firstParentId = getAllResponse.data[0]._id;
        console.log('\n🗑️ 4. Test DELETE /parents/:id');
        const deleteResponse = await axios.delete(`http://localhost:5001/api/admin/parents/${firstParentId}`, config);
        console.log('✅ DELETE /parents/:id - Succès');
        console.log('   Réponse:', deleteResponse.data);
      }
    } catch (error) {
      console.error('❌ DELETE /parents/:id - Erreur:', error.response?.data || error.message);
    }
    */

    console.log('\n✅ Tests des endpoints terminés!');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testParentsEndpoints(); 