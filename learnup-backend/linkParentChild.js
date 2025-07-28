const mongoose = require('mongoose');
const Parent = require('./models/Parent');
const Student = require('./models/Student');

// Configuration MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/learnup';

// Fonction pour lier un parent à son enfant
async function linkParentToChild(parentEmail, childEmail) {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver le parent
    const parent = await Parent.findOne({ email: parentEmail });
    if (!parent) {
      console.log(`❌ Parent avec email ${parentEmail} non trouvé`);
      return;
    }
    console.log(`✅ Parent trouvé: ${parent.name} (${parent.email})`);

    // Trouver l'enfant
    const child = await Student.findOne({ email: childEmail });
    if (!child) {
      console.log(`❌ Enfant avec email ${childEmail} non trouvé`);
      return;
    }
    console.log(`✅ Enfant trouvé: ${child.name} (${child.email})`);

    // Vérifier si l'enfant est déjà lié
    if (parent.children.includes(child._id)) {
      console.log(`⚠️ L'enfant ${child.name} est déjà lié au parent ${parent.name}`);
      return;
    }

    // Lier l'enfant au parent
    parent.children.push(child._id);
    await parent.save();

    // Lier le parent à l'enfant (optionnel, selon ton modèle)
    if (child.parents) {
      if (!child.parents.includes(parent._id)) {
        child.parents.push(parent._id);
        await child.save();
      }
    }

    console.log(`✅ SUCCÈS: ${child.name} (${childEmail}) lié à ${parent.name} (${parentEmail})`);

    // Afficher la liste des enfants du parent
    const updatedParent = await Parent.findById(parent._id).populate('children', 'name email classe');
    console.log('\n📋 Enfants du parent:');
    updatedParent.children.forEach((child, index) => {
      console.log(`   ${index + 1}. ${child.name} (${child.email}) - Classe: ${child.classe}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
const parentEmail = 'seyfma@email.com';
const childEmail = 'seyf@gmail.com';

console.log(`🔗 Liaison parent-enfant:`);
console.log(`   Parent: ${parentEmail}`);
console.log(`   Enfant: ${childEmail}`);
console.log('');

linkParentToChild(parentEmail, childEmail); 