const mongoose = require('mongoose');
const Parent = require('./models/Parent');
const Student = require('./models/Student');

// Configuration MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/learnup';

// Données de liaison parent-enfant (à adapter selon vos données)
const parentChildLinks = [
  // Exemple de liaisons - remplacez par vos vraies données
  { parentEmail: 'parent1@email.com', childEmail: 'enfant1@email.com' },
  { parentEmail: 'parent2@email.com', childEmail: 'enfant2@email.com' },
  { parentEmail: 'parent3@email.com', childEmail: 'enfant3@email.com' },
  // Ajoutez autant de liaisons que nécessaire
];

// Fonction pour lier un parent à son enfant
async function linkParentToChild(parentEmail, childEmail) {
  try {
    // Trouver le parent
    const parent = await Parent.findOne({ email: parentEmail });
    if (!parent) {
      console.log(`❌ Parent avec email ${parentEmail} non trouvé`);
      return { success: false, error: 'Parent non trouvé' };
    }

    // Trouver l'enfant
    const child = await Student.findOne({ email: childEmail });
    if (!child) {
      console.log(`❌ Enfant avec email ${childEmail} non trouvé`);
      return { success: false, error: 'Enfant non trouvé' };
    }

    // Vérifier si l'enfant est déjà lié
    if (parent.children.includes(child._id)) {
      console.log(`⚠️ L'enfant ${child.name} est déjà lié au parent ${parent.name}`);
      return { success: true, message: 'Déjà lié' };
    }

    // Lier l'enfant au parent
    parent.children.push(child._id);
    await parent.save();

    // Lier le parent à l'enfant
    if (!child.parents.includes(parent._id)) {
      child.parents.push(parent._id);
      await child.save();
    }

    console.log(`✅ SUCCÈS: ${child.name} (${childEmail}) lié à ${parent.name} (${parentEmail})`);
    return { success: true, message: 'Lié avec succès' };

  } catch (error) {
    console.error('❌ Erreur lors de la liaison:', error.message);
    return { success: false, error: error.message };
  }
}

// Fonction pour lier tous les parents à leurs enfants
async function linkAllParentsToChildren() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    console.log('');

    console.log('🔗 Début de la liaison parent-enfant...');
    console.log(`📋 Nombre de liaisons à traiter: ${parentChildLinks.length}`);
    console.log('');

    const results = {
      success: 0,
      alreadyLinked: 0,
      errors: 0,
      details: []
    };

    // Traiter chaque liaison
    for (let i = 0; i < parentChildLinks.length; i++) {
      const link = parentChildLinks[i];
      console.log(`📝 Traitement ${i + 1}/${parentChildLinks.length}:`);
      console.log(`   Parent: ${link.parentEmail}`);
      console.log(`   Enfant: ${link.childEmail}`);

      const result = await linkParentToChild(link.parentEmail, link.childEmail);
      
      if (result.success) {
        if (result.message === 'Déjà lié') {
          results.alreadyLinked++;
        } else {
          results.success++;
        }
      } else {
        results.errors++;
      }

      results.details.push({
        parentEmail: link.parentEmail,
        childEmail: link.childEmail,
        ...result
      });

      console.log('');
    }

    // Afficher le résumé
    console.log('📊 RÉSUMÉ DES LIAISONS:');
    console.log(`✅ Liaisons réussies: ${results.success}`);
    console.log(`⚠️ Déjà liés: ${results.alreadyLinked}`);
    console.log(`❌ Erreurs: ${results.errors}`);
    console.log('');

    // Afficher les détails des erreurs
    if (results.errors > 0) {
      console.log('❌ DÉTAILS DES ERREURS:');
      results.details
        .filter(detail => !detail.success)
        .forEach(detail => {
          console.log(`   - ${detail.parentEmail} → ${detail.childEmail}: ${detail.error}`);
        });
      console.log('');
    }

    // Vérifier les liaisons finales
    console.log('🔍 VÉRIFICATION DES LIAISONS FINALES:');
    const allParents = await Parent.find({}).populate('children', 'name email classe');
    
    allParents.forEach(parent => {
      console.log(`\n👨‍👩‍👧‍👦 ${parent.name} (${parent.email}):`);
      if (parent.children.length === 0) {
        console.log('   ❌ Aucun enfant lié');
      } else {
        parent.children.forEach((child, index) => {
          console.log(`   ${index + 1}. ${child.name} (${child.email}) - Classe: ${child.classe}`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Fonction pour afficher les statistiques actuelles
async function showCurrentStats() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📊 STATISTIQUES ACTUELLES:');
    
    const totalParents = await Parent.countDocuments();
    const totalStudents = await Student.countDocuments();
    
    const parentsWithChildren = await Parent.countDocuments({ children: { $exists: true, $ne: [] } });
    const studentsWithParents = await Student.countDocuments({ parents: { $exists: true, $ne: [] } });
    
    console.log(`👨‍👩‍👧‍👦 Parents totaux: ${totalParents}`);
    console.log(`👨‍👩‍👧‍👦 Parents avec enfants: ${parentsWithChildren}`);
    console.log(`👨‍👩‍👧‍👦 Parents sans enfants: ${totalParents - parentsWithChildren}`);
    console.log('');
    console.log(`🎓 Étudiants totaux: ${totalStudents}`);
    console.log(`🎓 Étudiants avec parents: ${studentsWithParents}`);
    console.log(`🎓 Étudiants sans parents: ${totalStudents - studentsWithParents}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage des stats:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Fonction pour lier automatiquement par nom de famille (optionnel)
async function linkByLastName() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔗 Liaison automatique par nom de famille...');
    
    const parents = await Parent.find({});
    const students = await Student.find({});
    
    const links = [];
    
    parents.forEach(parent => {
      const parentLastName = parent.name.split(' ').pop().toLowerCase();
      
      students.forEach(student => {
        const studentLastName = student.name.split(' ').pop().toLowerCase();
        
        if (parentLastName === studentLastName && parentLastName.length > 2) {
          links.push({
            parentEmail: parent.email,
            childEmail: student.email,
            reason: 'Nom de famille identique'
          });
        }
      });
    });
    
    console.log(`📋 ${links.length} liaisons potentielles trouvées par nom de famille`);
    
    // Afficher les liaisons trouvées
    links.forEach((link, index) => {
      console.log(`${index + 1}. ${link.parentEmail} → ${link.childEmail} (${link.reason})`);
    });
    
    return links;
    
  } catch (error) {
    console.error('❌ Erreur lors de la liaison par nom:', error.message);
    return [];
  } finally {
    await mongoose.disconnect();
  }
}

// Menu principal
async function main() {
  console.log('🚀 SCRIPT DE LIAISON PARENT-ENFANT');
  console.log('=====================================');
  console.log('');
  
  // Afficher les statistiques actuelles
  await showCurrentStats();
  console.log('');
  
  // Option 1: Liaison manuelle avec les données définies
  console.log('1️⃣ Liaison manuelle avec les données prédéfinies');
  await linkAllParentsToChildren();
  
  // Option 2: Liaison automatique par nom de famille
  console.log('\n2️⃣ Liaison automatique par nom de famille');
  const autoLinks = await linkByLastName();
  
  if (autoLinks.length > 0) {
    console.log('\nVoulez-vous appliquer ces liaisons automatiques? (décommentez la ligne suivante)');
    // await linkAllParentsToChildren(autoLinks);
  }
  
  console.log('\n✅ Script terminé!');
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  linkParentToChild,
  linkAllParentsToChildren,
  showCurrentStats,
  linkByLastName
}; 