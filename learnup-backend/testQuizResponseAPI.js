const fetch = require('node-fetch');

const API_URL = "http://localhost:5001";

async function testQuizResponseAPI() {
  console.log('🧪 === TEST QUIZ RESPONSE API ===');
  
  try {
    // Test 1: Route de test
    console.log('\n1️⃣ Test de la route de test...');
    const testResponse = await fetch(`${API_URL}/api/quiz-responses/test`);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Route de test OK:', testData);
    } else {
      console.log('❌ Route de test échouée:', testResponse.status);
    }
    
    // Test 2: Vérifier si le serveur répond
    console.log('\n2️⃣ Test de la connexion au serveur...');
    try {
      const serverResponse = await fetch(`${API_URL}/api/test`);
      if (serverResponse.ok) {
        const data = await serverResponse.json();
        console.log('✅ Serveur accessible:', data);
      } else {
        console.log('⚠️ Serveur accessible mais pas de route /test');
      }
    } catch (error) {
      console.log('❌ Serveur non accessible:', error.message);
    }
    
    // Test 3: Test de l'API getAnswers (sans authentification pour voir l'erreur)
    console.log('\n3️⃣ Test de l\'API getAnswers...');
    try {
      const answersResponse = await fetch(`${API_URL}/api/quiz-responses/test/test/answers`);
      console.log('📊 Status getAnswers:', answersResponse.status);
      if (answersResponse.ok) {
        const data = await answersResponse.json();
        console.log('✅ getAnswers OK:', data);
      } else {
        const errorText = await answersResponse.text();
        console.log('⚠️ getAnswers erreur attendue:', errorText);
      }
    } catch (error) {
      console.log('❌ Erreur getAnswers:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
  
  console.log('\n🏁 === FIN DU TEST ===');
}

testQuizResponseAPI(); 