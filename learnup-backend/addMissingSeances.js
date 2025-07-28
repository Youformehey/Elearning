const mongoose = require('mongoose');
const Seance = require('./models/Seance');
const Course = require('./models/Course');
const Teacher = require('./models/Teacher');

// Configuration MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/learnup';

// Horaires possibles
const HORAIRES = ['08:00', '10:00', '14:00', '16:00'];
const SALLES = ['Salle A', 'Salle B', 'Salle C', 'Salle D'];

// Fonction pour calculer l'heure de fin
function calculerHeureFin(heureDebut, dureeMinutes = 120) {
  const [h, m] = heureDebut.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + dureeMinutes);
  return date.toTimeString().slice(0, 5);
}

// Fonction pour générer des dates de cours
function genererDatesCours(debutSemaine, nombreSemaines = 8) {
  const dates = [];
  const date = new Date(debutSemaine);
  
  for (let semaine = 0; semaine < nombreSemaines; semaine++) {
    for (let jour = 0; jour < 5; jour++) { // Lundi à Vendredi
      const dateCours = new Date(date);
      dateCours.setDate(date.getDate() + jour);
      dates.push(dateCours);
    }
    date.setDate(date.getDate() + 7); // Semaine suivante
  }
  
  return dates;
}

async function ajouterSeancesManquantes() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer tous les cours
    const cours = await Course.find()
      .populate('teacher')
      .populate('matiere');
    
    console.log(`📚 ${cours.length} cours trouvés`);

    if (cours.length === 0) {
      console.log('❌ Aucun cours trouvé');
      return;
    }

    // Supprimer les séances existantes
    await Seance.deleteMany({});
    console.log('🗑️ Anciennes séances supprimées');

    // Date de début (lundi prochain)
    const aujourdhui = new Date();
    const lundiProchain = new Date(aujourdhui);
    const joursJusquaLundi = (8 - aujourdhui.getDay()) % 7;
    lundiProchain.setDate(aujourdhui.getDate() + joursJusquaLundi);
    lundiProchain.setHours(0, 0, 0, 0);

    const datesCours = genererDatesCours(lundiProchain, 8); // 8 semaines
    console.log(`📅 ${datesCours.length} dates de cours générées`);

    let seancesCreees = 0;

    // Générer les séances pour chaque cours
    for (const cours of cours) {
      if (!cours.teacher || !cours.matiere) {
        console.log(`⚠️ Cours ${cours.nom} ignoré (professeur ou matière manquant)`);
        continue;
      }

      console.log(`📖 Génération des séances pour: ${cours.nom} - ${cours.classe}`);

      // Nombre de séances par semaine pour ce cours (1 à 3)
      const seancesParSemaine = Math.floor(Math.random() * 3) + 1;

      for (let semaine = 0; semaine < 8; semaine++) {
        for (let seance = 0; seance < seancesParSemaine; seance++) {
          // Choisir une date aléatoire de la semaine
          const dateIndex = semaine * 5 + Math.floor(Math.random() * 5);
          if (dateIndex >= datesCours.length) continue;

          const dateSeance = datesCours[dateIndex];
          const horaire = HORAIRES[Math.floor(Math.random() * HORAIRES.length)];
          const salle = SALLES[Math.floor(Math.random() * SALLES.length)];

          // Créer la séance
          const nouvelleSeance = new Seance({
            date: dateSeance,
            heureDebut: horaire,
            heureFin: calculerHeureFin(horaire, cours.duree || 120),
            classe: cours.classe,
            groupe: cours.groupe || 'Groupe A',
            salle: salle,
            course: cours._id,
            professeur: cours.teacher._id,
            fait: Math.random() > 0.7 // 30% des séances sont marquées comme faites
          });

          await nouvelleSeance.save();
          seancesCreees++;
        }
      }
    }

    console.log(`✅ ${seancesCreees} séances générées avec succès !`);

    // Afficher un résumé par classe
    const seancesParClasse = await Seance.aggregate([
      { $group: { _id: '$classe', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Résumé par classe :');
    seancesParClasse.forEach(item => {
      console.log(`   ${item._id}: ${item.count} séances`);
    });

    // Afficher un résumé par matière
    const seancesParMatiere = await Seance.aggregate([
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseInfo' } },
      { $unwind: '$courseInfo' },
      { $lookup: { from: 'matieres', localField: 'courseInfo.matiere', foreignField: '_id', as: 'matiereInfo' } },
      { $unwind: '$matiereInfo' },
      { $group: { _id: '$matiereInfo.nom', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📚 Résumé par matière :');
    seancesParMatiere.forEach(item => {
      console.log(`   ${item._id}: ${item.count} séances`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la génération des séances:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Exécuter le script
ajouterSeancesManquantes(); 