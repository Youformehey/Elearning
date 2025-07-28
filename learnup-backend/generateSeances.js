const mongoose = require('mongoose');
const Course = require('./models/Course');
const Seance = require('./models/Seance');
const Teacher = require('./models/Teacher');

// Configuration de la base de données
const MONGODB_URI = 'mongodb://localhost:27017/learnup';

// Horaires de cours typiques
const HORAIRES_COURS = [
  '08h00', '09h00', '10h00', '11h00', '14h00', '15h00', '16h00', '17h00'
];

// Salles disponibles
const SALLES = [
  'Salle 101', 'Salle 102', 'Salle 103', 'Salle 201', 'Salle 202', 'Salle 203',
  'Labo Info', 'Labo Sciences', 'CDI', 'Salle Polyvalente'
];

// Fonction pour calculer l'heure de fin
function calculerHeureFin(heureDebut, dureeMinutes = 60) {
  if (!heureDebut) return null;
  
  let hd = heureDebut.replace("h", "");
  const [h, m = 0] = hd.includes(":") 
    ? hd.split(":").map(Number) 
    : [parseInt(hd), 0];

  if (isNaN(h) || isNaN(m)) return null;

  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + dureeMinutes);

  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${heures}h${minutes}`;
}

// Fonction pour générer des dates de cours
function genererDatesCours(debutSemaine, nombreSemaines = 12) {
  const dates = [];
  const dateDebut = new Date(debutSemaine);
  
  for (let semaine = 0; semaine < nombreSemaines; semaine++) {
    for (let jour = 1; jour <= 5; jour++) { // Lundi à Vendredi
      const date = new Date(dateDebut);
      date.setDate(dateDebut.getDate() + (semaine * 7) + jour);
      
      // Éviter les weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(new Date(date));
      }
    }
  }
  
  return dates;
}

// Fonction pour générer les séances
async function genererSeances() {
  try {
    console.log('🚀 Début de la génération des séances...');
    
    // Récupérer tous les cours
    const cours = await Course.find().populate('teacher matiere');
    console.log(`📚 ${cours.length} cours trouvés`);
    
    if (cours.length === 0) {
      console.log("❌ Aucun cours trouvé. Créez d'abord des cours.");
      return;
    }
    
    // Date de début (lundi de la semaine prochaine)
    const aujourdhui = new Date();
    const lundiProchain = new Date(aujourdhui);
    lundiProchain.setDate(aujourdhui.getDate() + (8 - aujourdhui.getDay()));
    lundiProchain.setHours(0, 0, 0, 0);
    
    const datesCours = genererDatesCours(lundiProchain, 12); // 12 semaines
    console.log(`📅 ${datesCours.length} dates de cours générées`);
    
    // Supprimer les séances existantes
    await Seance.deleteMany({});
    console.log('🗑️ Anciennes séances supprimées');
    
    let seancesCreees = 0;
    
    // Générer les séances pour chaque cours
    for (const cours of cours) {
      if (!cours.teacher || !cours.matiere) {
        console.log(`⚠️ Cours ${cours._id} ignoré (professeur ou matière manquant)`);
        continue;
      }
      
      // Nombre de séances par semaine pour ce cours
      const seancesParSemaine = Math.floor(Math.random() * 3) + 1; // 1 à 3 séances
      
      for (let semaine = 0; semaine < 12; semaine++) {
        for (let seance = 0; seance < seancesParSemaine; seance++) {
          // Choisir une date aléatoire de la semaine
          const dateIndex = semaine * 5 + Math.floor(Math.random() * 5);
          if (dateIndex >= datesCours.length) continue;
          
          const dateSeance = datesCours[dateIndex];
          
          // Choisir un horaire aléatoire
          const horaire = HORAIRES_COURS[Math.floor(Math.random() * HORAIRES_COURS.length)];
          
          // Choisir une salle aléatoire
          const salle = SALLES[Math.floor(Math.random() * SALLES.length)];
          
          // Créer la séance
          const nouvelleSeance = new Seance({
            date: dateSeance,
            heureDebut: horaire,
            heureFin: calculerHeureFin(horaire, cours.duree || 60),
            classe: cours.classe,
            groupe: cours.groupe || 'Groupe A',
            salle: salle,
            course: cours._id,
            professeur: cours.teacher._id,
            fait: false
          });
          
          await nouvelleSeance.save();
          seancesCreees++;
        }
      }
    }
    
    console.log(`✅ ${seancesCreees} séances générées avec succès !`);
    
    // Afficher un résumé
    const seancesParClasse = await Seance.aggregate([
      { $group: { _id: '$classe', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Résumé par classe :');
    seancesParClasse.forEach(item => {
      console.log(`   ${item._id}: ${item.count} séances`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération des séances:', error);
  }
}

// Fonction pour afficher les séances existantes
async function afficherSeances() {
  try {
    console.log('📋 Affichage des séances existantes...\n');
    
    const seances = await Seance.find()
      .populate('course', 'nom matiere classe')
      .populate('professeur', 'name email')
      .sort({ date: 1, heureDebut: 1 });
    
    if (seances.length === 0) {
      console.log('❌ Aucune séance trouvée.');
      return;
    }
    
    console.log(`📚 ${seances.length} séances trouvées :\n`);
    
    // Grouper par classe
    const seancesParClasse = {};
    seances.forEach(seance => {
      const classe = seance.classe || 'Classe inconnue';
      if (!seancesParClasse[classe]) {
        seancesParClasse[classe] = [];
      }
      seancesParClasse[classe].push(seance);
    });
    
    Object.keys(seancesParClasse).sort().forEach(classe => {
      console.log(`🎓 ${classe} (${seancesParClasse[classe].length} séances):`);
      
      seancesParClasse[classe].forEach(seance => {
        const date = new Date(seance.date).toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit'
        });
        
        const matiere = seance.course?.matiere?.nom || seance.course?.nom || 'Matière inconnue';
        const prof = seance.professeur?.name || 'Prof inconnu';
        
        console.log(`   📅 ${date} | ${seance.heureDebut}-${seance.heureFin} | ${matiere} | ${prof} | ${seance.salle}`);
      });
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage des séances:', error);
  }
}

// Fonction pour nettoyer les séances
async function nettoyerSeances() {
  try {
    console.log('🧹 Nettoyage des séances...');
    
    const resultat = await Seance.deleteMany({});
    console.log(`✅ ${resultat.deletedCount} séances supprimées`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Fonction principale
async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connexion à MongoDB établie');
    
    const action = process.argv[2];
    
    switch (action) {
      case 'generate':
        await genererSeances();
        break;
      case 'show':
        await afficherSeances();
        break;
      case 'clean':
        await nettoyerSeances();
        break;
      default:
        console.log('📖 Utilisation:');
        console.log('   node generateSeances.js generate  - Générer les séances');
        console.log('   node generateSeances.js show      - Afficher les séances');
        console.log('   node generateSeances.js clean     - Nettoyer les séances');
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion à MongoDB fermée');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = {
  genererSeances,
  afficherSeances,
  nettoyerSeances
}; 