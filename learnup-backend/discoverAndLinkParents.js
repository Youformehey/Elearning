const mongoose = require('mongoose');
const Parent = require('./models/Parent');
const Student = require('./models/Student');

// Configuration MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/learnup';

// Fonction pour découvrir les parents et étudiants non liés
async function discoverUnlinkedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔍 DÉCOUVERTE DES UTILISATEURS NON LIÉS');
    console.log('==========================================');
    console.log('');

    // Récupérer tous les parents
    const allParents = await Parent.find({}).populate('children', 'name email classe');
    console.log(`👨‍👩‍👧‍👦 Parents trouvés: ${allParents.length}`);

    // Récupérer tous les étudiants
    const allStudents = await Student.find({}).populate('parents', 'name email');
    console.log(`🎓 Étudiants trouvés: ${allStudents.length}`);
    console.log('');

    // Analyser les parents sans enfants
    const parentsWithoutChildren = allParents.filter(parent => parent.children.length === 0);
    console.log(`❌ Parents sans enfants: ${parentsWithoutChildren.length}`);
    parentsWithoutChildren.forEach(parent => {
      console.log(`   - ${parent.name} (${parent.email})`);
    });
    console.log('');

    // Analyser les étudiants sans parents
    const studentsWithoutParents = allStudents.filter(student => student.parents.length === 0);
    console.log(`❌ Étudiants sans parents: ${studentsWithoutParents.length}`);
    studentsWithoutParents.forEach(student => {
      console.log(`   - ${student.name} (${student.email}) - Classe: ${student.classe}`);
    });
    console.log('');

    // Analyser les parents avec enfants
    const parentsWithChildren = allParents.filter(parent => parent.children.length > 0);
    console.log(`✅ Parents avec enfants: ${parentsWithChildren.length}`);
    parentsWithChildren.forEach(parent => {
      console.log(`   - ${parent.name} (${parent.email}):`);
      parent.children.forEach((child, index) => {
        console.log(`     ${index + 1}. ${child.name} (${child.email}) - Classe: ${child.classe}`);
      });
    });
    console.log('');

    return {
      allParents,
      allStudents,
      parentsWithoutChildren,
      studentsWithoutParents,
      parentsWithChildren
    };

  } catch (error) {
    console.error('❌ Erreur lors de la découverte:', error.message);
    return null;
  } finally {
    await mongoose.disconnect();
  }
}

// Fonction pour proposer des liaisons par nom de famille
async function suggestLinksByName() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('💡 SUGGESTIONS DE LIAISONS PAR NOM DE FAMILLE');
    console.log('==============================================');
    console.log('');

    const allParents = await Parent.find({});
    const allStudents = await Student.find({});

    const suggestions = [];

    allParents.forEach(parent => {
      const parentName = parent.name.toLowerCase();
      const parentWords = parentName.split(' ').filter(word => word.length > 2);
      
      allStudents.forEach(student => {
        const studentName = student.name.toLowerCase();
        const studentWords = studentName.split(' ').filter(word => word.length > 2);
        
        // Vérifier les correspondances de mots
        const commonWords = parentWords.filter(word => studentWords.includes(word));
        
        if (commonWords.length > 0) {
          suggestions.push({
            parent: parent,
            student: student,
            commonWords: commonWords,
            confidence: commonWords.length / Math.max(parentWords.length, studentWords.length)
          });
        }
      });
    });

    // Trier par confiance décroissante
    suggestions.sort((a, b) => b.confidence - a.confidence);

    console.log(`📋 ${suggestions.length} suggestions trouvées:`);
    console.log('');

    suggestions.forEach((suggestion, index) => {
      const confidence = Math.round(suggestion.confidence * 100);
      console.log(`${index + 1}. ${suggestion.parent.name} → ${suggestion.student.name}`);
      console.log(`   Mots communs: ${suggestion.commonWords.join(', ')}`);
      console.log(`   Confiance: ${confidence}%`);
      console.log(`   Emails: ${suggestion.parent.email} → ${suggestion.student.email}`);
      console.log('');
    });

    return suggestions;

  } catch (error) {
    console.error('❌ Erreur lors des suggestions:', error.message);
    return [];
  } finally {
    await mongoose.disconnect();
  }
}

// Fonction pour créer un fichier de configuration avec les liaisons suggérées
async function generateLinkConfigFile() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📝 GÉNÉRATION DU FICHIER DE CONFIGURATION');
    console.log('==========================================');
    console.log('');

    const suggestions = await suggestLinksByName();
    
    // Filtrer les suggestions avec une confiance élevée (>50%)
    const highConfidenceSuggestions = suggestions.filter(s => s.confidence > 0.5);
    
    console.log(`✅ ${highConfidenceSuggestions.length} suggestions avec confiance élevée:`);
    console.log('');

    // Générer le contenu du fichier de configuration
    let configContent = '// Configuration générée automatiquement pour les liaisons parent-enfant\n';
    configContent += '// Modifiez ce fichier selon vos besoins\n\n';
    configContent += 'const parentChildLinks = [\n';
    
    highConfidenceSuggestions.forEach((suggestion, index) => {
      const confidence = Math.round(suggestion.confidence * 100);
      configContent += `  {\n`;
      configContent += `    parentEmail: '${suggestion.parent.email}',\n`;
      configContent += `    childEmail: '${suggestion.student.email}',\n`;
      configContent += `    // ${suggestion.parent.name} → ${suggestion.student.name} (Confiance: ${confidence}%)\n`;
      configContent += `    // Mots communs: ${suggestion.commonWords.join(', ')}\n`;
      configContent += `  },\n`;
    });
    
    configContent += '];\n\n';
    configContent += 'module.exports = parentChildLinks;\n';

    // Écrire le fichier
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(__dirname, 'parentChildLinksConfig.js');
    
    fs.writeFileSync(configPath, configContent);
    
    console.log(`✅ Fichier de configuration généré: ${configPath}`);
    console.log(`📋 ${highConfidenceSuggestions.length} liaisons suggérées`);
    console.log('');
    console.log('📝 Pour utiliser ces liaisons:');
    console.log('1. Vérifiez et modifiez le fichier parentChildLinksConfig.js');
    console.log('2. Importez-le dans linkAllParentsToChildren.js');
    console.log('3. Exécutez le script de liaison');

    return configPath;

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    return null;
  } finally {
    await mongoose.disconnect();
  }
}

// Fonction pour lier automatiquement avec confirmation
async function autoLinkWithConfirmation() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🤖 LIAISON AUTOMATIQUE AVEC CONFIRMATION');
    console.log('=========================================');
    console.log('');

    const suggestions = await suggestLinksByName();
    
    // Filtrer les suggestions avec une confiance très élevée (>80%)
    const veryHighConfidenceSuggestions = suggestions.filter(s => s.confidence > 0.8);
    
    if (veryHighConfidenceSuggestions.length === 0) {
      console.log('❌ Aucune suggestion avec confiance suffisante trouvée');
      return;
    }

    console.log(`✅ ${veryHighConfidenceSuggestions.length} liaisons automatiques proposées:`);
    console.log('');

    veryHighConfidenceSuggestions.forEach((suggestion, index) => {
      const confidence = Math.round(suggestion.confidence * 100);
      console.log(`${index + 1}. ${suggestion.parent.name} → ${suggestion.student.name} (${confidence}%)`);
    });
    console.log('');

    // Ici vous pouvez ajouter une logique de confirmation interactive
    console.log('⚠️ Pour appliquer ces liaisons automatiquement, décommentez le code dans le script');
    console.log('');

    // Appliquer les liaisons (décommenter pour activer)
    /*
    let successCount = 0;
    for (const suggestion of veryHighConfidenceSuggestions) {
      try {
        const parent = await Parent.findById(suggestion.parent._id);
        const student = await Student.findById(suggestion.student._id);
        
        if (!parent.children.includes(student._id)) {
          parent.children.push(student._id);
          await parent.save();
        }
        
        if (!student.parents.includes(parent._id)) {
          student.parents.push(parent._id);
          await student.save();
        }
        
        successCount++;
        console.log(`✅ Lié: ${parent.name} → ${student.name}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la liaison: ${error.message}`);
      }
    }
    
    console.log(`\n✅ ${successCount} liaisons appliquées avec succès`);
    */

  } catch (error) {
    console.error('❌ Erreur lors de la liaison automatique:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Menu principal
async function main() {
  console.log('🚀 SCRIPT DE DÉCOUVERTE ET LIAISON PARENT-ENFANT');
  console.log('==================================================');
  console.log('');

  // 1. Découvrir les utilisateurs non liés
  console.log('1️⃣ Découverte des utilisateurs non liés');
  await discoverUnlinkedUsers();
  console.log('');

  // 2. Suggérer des liaisons par nom
  console.log('2️⃣ Suggestions de liaisons par nom de famille');
  await suggestLinksByName();
  console.log('');

  // 3. Générer le fichier de configuration
  console.log('3️⃣ Génération du fichier de configuration');
  await generateLinkConfigFile();
  console.log('');

  // 4. Liaison automatique avec confirmation
  console.log('4️⃣ Liaison automatique avec confirmation');
  await autoLinkWithConfirmation();
  console.log('');

  console.log('✅ Script terminé!');
  console.log('');
  console.log('📋 PROCHAINES ÉTAPES:');
  console.log('1. Vérifiez le fichier parentChildLinksConfig.js généré');
  console.log('2. Modifiez les liaisons selon vos besoins');
  console.log('3. Exécutez linkAllParentsToChildren.js pour appliquer les liaisons');
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  discoverUnlinkedUsers,
  suggestLinksByName,
  generateLinkConfigFile,
  autoLinkWithConfirmation
}; 