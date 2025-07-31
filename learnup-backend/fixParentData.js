const mongoose = require('mongoose');
const Parent = require('./models/Parent');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/learnup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixParentData() {
  try {
    console.log('🔄 Vérification et correction des données des parents...');

    // Récupérer tous les parents
    const parents = await Parent.find({});
    console.log(`✅ ${parents.length} parents trouvés`);

    for (const parent of parents) {
      console.log(`\n🔍 Vérification du parent: ${parent._id}`);
      console.log('Données actuelles:', {
        nom: parent.nom,
        prenom: parent.prenom,
        email: parent.email,
        telephone: parent.telephone,
        adresse: parent.adresse,
        enfants: parent.enfants,
        status: parent.status,
        derniereConnexion: parent.derniereConnexion
      });

      let updated = false;

      // Corriger le nom si nécessaire
      if (!parent.nom && !parent.prenom) {
        parent.nom = 'Nom';
        parent.prenom = 'Non défini';
        updated = true;
        console.log('✅ Nom corrigé');
      }

      // Corriger les enfants si nécessaire
      if (!parent.enfants || parent.enfants.length === 0) {
        parent.enfants = ['Enfant non défini'];
        updated = true;
        console.log('✅ Enfants corrigés');
      }

      // Corriger la dernière connexion si nécessaire
      if (!parent.derniereConnexion) {
        parent.derniereConnexion = new Date();
        updated = true;
        console.log('✅ Dernière connexion corrigée');
      }

      // Corriger le statut si nécessaire
      if (!parent.status) {
        parent.status = 'active';
        updated = true;
        console.log('✅ Statut corrigé');
      }

      // Sauvegarder si des modifications ont été apportées
      if (updated) {
        await parent.save();
        console.log('✅ Parent mis à jour');
      } else {
        console.log('✅ Aucune correction nécessaire');
      }
    }

    console.log('\n✅ Vérification terminée !');
    
    // Afficher un exemple de parent formaté
    const testParent = parents[0];
    if (testParent) {
      console.log('\n📋 Exemple de parent formaté:');
      const formattedParent = {
        _id: testParent._id,
        name: testParent.nom && testParent.prenom ? `${testParent.nom} ${testParent.prenom}` : 
              testParent.nom || testParent.prenom || 'Nom non défini',
        email: testParent.email || 'email@non.defini',
        tel: testParent.telephone || 'Non renseigné',
        adresse: testParent.adresse || 'Adresse non renseignée',
        children: Array.isArray(testParent.enfants) ? testParent.enfants : 
                 typeof testParent.enfants === 'string' ? testParent.enfants.split(',').map(c => c.trim()) : 
                 ['Enfant non défini'],
        status: testParent.status || 'active',
        derniereConnexion: testParent.derniereConnexion
      };
      console.log(JSON.stringify(formattedParent, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixParentData(); 