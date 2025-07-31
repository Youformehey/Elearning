const axios = require('axios');

async function testParentsCRUD() {
  try {
    console.log('🔄 Test des opérations CRUD pour les parents...');
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // 1. Récupérer tous les parents
    console.log('\n📋 1. Récupération de tous les parents...');
    const getAllResponse = await axios.get('http://localhost:5001/api/admin/parents', config);
    console.log('✅ Parents trouvés:', getAllResponse.data.length);
    
    if (getAllResponse.data.length === 0) {
      console.log('❌ Aucun parent trouvé pour les tests');
      return;
    }

    const firstParent = getAllResponse.data[0];
    console.log('📝 Premier parent:', firstParent);

    // 2. Tester la modification
    console.log('\n📝 2. Test de modification du parent...');
    const updateData = {
      name: 'Test Modifié',
      email: 'test.modifie@email.com',
      tel: '06 99 88 77 66',
      adresse: 'Adresse de test modifiée',
      children: ['Enfant Test 1', 'Enfant Test 2'],
      status: 'active'
    };

    console.log('📤 Données envoyées:', updateData);
    const updateResponse = await axios.put(`http://localhost:5001/api/admin/parents/${firstParent._id}`, updateData, config);
    console.log('✅ Réponse de modification:', updateResponse.data);

    // 3. Vérifier que la modification a bien été appliquée
    console.log('\n🔍 3. Vérification de la modification...');
    const verifyResponse = await axios.get(`http://localhost:5001/api/admin/parents/${firstParent._id}`, config);
    console.log('✅ Parent après modification:', verifyResponse.data);

    // 4. Tester la suppression (optionnel - commenté pour éviter de supprimer des données)
    /*
    console.log('\n🗑️ 4. Test de suppression du parent...');
    const deleteResponse = await axios.delete(`http://localhost:5001/api/admin/parents/${firstParent._id}`, config);
    console.log('✅ Réponse de suppression:', deleteResponse.data);
    */

    console.log('\n✅ Tests CRUD terminés avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors des tests CRUD:', error.response?.data || error.message);
  }
}

testParentsCRUD(); 