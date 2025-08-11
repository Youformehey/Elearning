const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import des modèles
const Document = require('./models/Document');

async function fixDocuments() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // 1. Lister tous les documents
    console.log('\n📄 ANALYSE DES DOCUMENTS:');
    const documents = await Document.find({}).sort({ createdAt: -1 });
    console.log(`Nombre total de documents: ${documents.length}`);

    let fixedCount = 0;
    let deletedCount = 0;
    let youtubeCount = 0;

    for (const doc of documents) {
      console.log(`\n--- Document: ${doc.fileName} ---`);
      console.log(`ID: ${doc._id}`);
      console.log(`URL: ${doc.fileUrl}`);
      console.log(`Cours: ${doc.course}`);

      // Vérifier si c'est une vidéo YouTube
      if (doc.fileUrl && (doc.fileUrl.includes('youtube.com') || doc.fileUrl.includes('youtu.be'))) {
        console.log('✅ Vidéo YouTube - OK');
        youtubeCount++;
        continue;
      }

      // Vérifier si le fichier existe
      if (doc.fileUrl) {
        const filePath = path.join(__dirname, doc.fileUrl);
        const fileExists = fs.existsSync(filePath);

        if (fileExists) {
          const stats = fs.statSync(filePath);
          console.log(`✅ Fichier existe (${(stats.size / 1024).toFixed(2)} KB)`);
        } else {
          console.log('❌ Fichier manquant');
          
          // Demander confirmation pour supprimer
          console.log('⚠️  Document orphelin détecté');
          console.log(`   Fichier manquant: ${filePath}`);
          
          // Supprimer le document orphelin
          try {
            await Document.findByIdAndDelete(doc._id);
            console.log('🗑️  Document supprimé de la base de données');
            deletedCount++;
          } catch (err) {
            console.log('❌ Erreur lors de la suppression:', err.message);
          }
        }
      } else {
        console.log('❌ Pas d\'URL de fichier');
      }
    }

    // 2. Statistiques finales
    console.log('\n📊 STATISTIQUES FINALES:');
    console.log(`Documents analysés: ${documents.length}`);
    console.log(`Vidéos YouTube: ${youtubeCount}`);
    console.log(`Documents corrigés: ${fixedCount}`);
    console.log(`Documents supprimés: ${deletedCount}`);

    // 3. Vérifier le dossier uploads
    console.log('\n📁 VÉRIFICATION DU DOSSIER UPLOADS:');
    const uploadsPath = path.join(__dirname, 'uploads');
    const uploadsExists = fs.existsSync(uploadsPath);
    
    if (uploadsExists) {
      const files = fs.readdirSync(uploadsPath);
      console.log(`Fichiers dans uploads: ${files.length}`);
      
      if (files.length > 0) {
        console.log('Premiers fichiers:');
        files.slice(0, 5).forEach((file, index) => {
          const filePath = path.join(uploadsPath, file);
          const stats = fs.statSync(filePath);
          console.log(`  ${index + 1}. ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
        });
      }
    } else {
      console.log('❌ Dossier uploads inexistant');
    }

    // 4. Recommandations
    console.log('\n💡 RECOMMANDATIONS:');
    console.log('1. Vérifiez que le serveur backend fonctionne sur le port 5001');
    console.log('2. Assurez-vous que les fichiers sont bien uploadés dans le dossier uploads/');
    console.log('3. Vérifiez les permissions du dossier uploads/');
    console.log('4. Testez l\'accès aux fichiers via: http://localhost:5001/uploads/filename');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

fixDocuments(); 