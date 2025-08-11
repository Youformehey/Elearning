const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import des modèles
const Document = require('./models/Document');
const Course = require('./models/Course');
const Teacher = require('./models/Teacher');

async function testDocuments() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // 1. Lister tous les documents
    console.log('\n📄 DOCUMENTS:');
    const documents = await Document.find({})
      .populate('course', 'nom classe')
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`Nombre de documents: ${documents.length}`);
    
    documents.forEach((doc, index) => {
      console.log(`\n${index + 1}. ID: ${doc._id}`);
      console.log(`   Nom: ${doc.fileName}`);
      console.log(`   URL: ${doc.fileUrl}`);
      console.log(`   Cours: ${doc.course?.nom || 'Non défini'} (${doc.course?._id})`);
      console.log(`   Professeur: ${doc.teacher?.name || 'Non défini'} (${doc.teacher?._id})`);
      console.log(`   Message: ${doc.message || '-'}`);
      console.log(`   Créé le: ${doc.createdAt}`);
      
      // Vérifier si le fichier existe
      if (doc.fileUrl && !doc.fileUrl.includes('youtube.com') && !doc.fileUrl.includes('youtu.be')) {
        const filePath = path.join(__dirname, doc.fileUrl);
        const fileExists = fs.existsSync(filePath);
        console.log(`   Fichier existe: ${fileExists ? '✅' : '❌'}`);
        console.log(`   Chemin complet: ${filePath}`);
        
        if (fileExists) {
          const stats = fs.statSync(filePath);
          console.log(`   Taille: ${(stats.size / 1024).toFixed(2)} KB`);
        }
      } else if (doc.fileUrl) {
        console.log(`   Type: URL externe (YouTube)`);
      }
    });

    // 2. Lister tous les cours
    console.log('\n📚 COURS:');
    const courses = await Course.find({}).populate('teacher');
    console.log(`Nombre de cours: ${courses.length}`);
    
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ID: ${course._id}`);
      console.log(`   Nom: ${course.nom}`);
      console.log(`   Classe: ${course.classe}`);
      console.log(`   Professeur: ${course.teacher?.name || 'Non assigné'}`);
      console.log('---');
    });

    // 3. Vérifier le dossier uploads
    console.log('\n📁 DOSSIER UPLOADS:');
    const uploadsPath = path.join(__dirname, 'uploads');
    const uploadsExists = fs.existsSync(uploadsPath);
    console.log(`Dossier uploads existe: ${uploadsExists ? '✅' : '❌'}`);
    
    if (uploadsExists) {
      const files = fs.readdirSync(uploadsPath);
      console.log(`Nombre de fichiers: ${files.length}`);
      
      if (files.length > 0) {
        console.log('Fichiers dans uploads:');
        files.slice(0, 10).forEach((file, index) => {
          const filePath = path.join(uploadsPath, file);
          const stats = fs.statSync(filePath);
          console.log(`  ${index + 1}. ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
        });
        
        if (files.length > 10) {
          console.log(`  ... et ${files.length - 10} autres fichiers`);
        }
      }
    }

    // 4. Test d'accès aux fichiers
    console.log('\n🧪 TEST D\'ACCÈS AUX FICHIERS:');
    const testDocuments = documents.filter(doc => 
      doc.fileUrl && 
      !doc.fileUrl.includes('youtube.com') && 
      !doc.fileUrl.includes('youtu.be')
    );
    
    console.log(`Documents à tester: ${testDocuments.length}`);
    
    testDocuments.forEach((doc, index) => {
      const filePath = path.join(__dirname, doc.fileUrl);
      const fileExists = fs.existsSync(filePath);
      
      console.log(`\n${index + 1}. ${doc.fileName}`);
      console.log(`   URL relative: ${doc.fileUrl}`);
      console.log(`   URL complète: http://localhost:5001${doc.fileUrl}`);
      console.log(`   Fichier existe: ${fileExists ? '✅' : '❌'}`);
      
      if (fileExists) {
        try {
          const stats = fs.statSync(filePath);
          console.log(`   Taille: ${(stats.size / 1024).toFixed(2)} KB`);
          console.log(`   Permissions: ${stats.mode.toString(8)}`);
        } catch (err) {
          console.log(`   ❌ Erreur accès: ${err.message}`);
        }
      }
    });

    // 5. Statistiques
    console.log('\n📊 STATISTIQUES:');
    const stats = {
      total: documents.length,
      fichiers: documents.filter(d => d.fileUrl && !d.fileUrl.includes('youtube')).length,
      youtube: documents.filter(d => d.fileUrl && (d.fileUrl.includes('youtube.com') || d.fileUrl.includes('youtu.be'))).length,
      existants: documents.filter(d => {
        if (!d.fileUrl || d.fileUrl.includes('youtube')) return false;
        return fs.existsSync(path.join(__dirname, d.fileUrl));
      }).length
    };
    
    console.log(`Total documents: ${stats.total}`);
    console.log(`Fichiers uploadés: ${stats.fichiers}`);
    console.log(`Vidéos YouTube: ${stats.youtube}`);
    console.log(`Fichiers existants: ${stats.existants}`);
    console.log(`Fichiers manquants: ${stats.fichiers - stats.existants}`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

testDocuments(); 