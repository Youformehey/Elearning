const mongoose = require('mongoose');
const Class = require('./models/Class');
require('dotenv').config();

const seedClasses = async () => {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les classes existantes
    await Class.deleteMany({});
    console.log('🗑️ Classes existantes supprimées');

    // Créer des classes de test
    const classes = [
      {
        nom: '6ème A',
        niveau: '6ème',
        section: 'A',
        effectif: 28,
        professeurPrincipal: null, // Sera assigné plus tard
        status: 'active',
        salle: 'Salle 101',
        horaire: 'Lundi, Mercredi, Vendredi',
        capacite: 30,
        noteMoyenne: 14.5,
        tauxPresence: 95
      },
      {
        nom: '5ème B',
        niveau: '5ème',
        section: 'B',
        effectif: 25,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 102',
        horaire: 'Mardi, Jeudi, Samedi',
        capacite: 30,
        noteMoyenne: 15.2,
        tauxPresence: 92
      },
      {
        nom: '4ème C',
        niveau: '4ème',
        section: 'C',
        effectif: 22,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 103',
        horaire: 'Lundi, Mercredi, Vendredi',
        capacite: 30,
        noteMoyenne: 13.8,
        tauxPresence: 88
      },
      {
        nom: '3ème D',
        niveau: '3ème',
        section: 'D',
        effectif: 24,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 104',
        horaire: 'Mardi, Jeudi, Samedi',
        capacite: 30,
        noteMoyenne: 16.1,
        tauxPresence: 94
      },
      {
        nom: '2nde A',
        niveau: '2nde',
        section: 'A',
        effectif: 26,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 201',
        horaire: 'Lundi, Mercredi, Vendredi',
        capacite: 30,
        noteMoyenne: 14.7,
        tauxPresence: 91
      },
      {
        nom: '1ère S',
        niveau: '1ère',
        section: 'S',
        effectif: 20,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 202',
        horaire: 'Mardi, Jeudi, Samedi',
        capacite: 25,
        noteMoyenne: 17.3,
        tauxPresence: 96
      },
      {
        nom: '1ère ES',
        niveau: '1ère',
        section: 'ES',
        effectif: 18,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 203',
        horaire: 'Lundi, Mercredi, Vendredi',
        capacite: 25,
        noteMoyenne: 15.9,
        tauxPresence: 93
      },
      {
        nom: 'Terminale S',
        niveau: 'Terminale',
        section: 'S',
        effectif: 22,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 301',
        horaire: 'Mardi, Jeudi, Samedi',
        capacite: 25,
        noteMoyenne: 16.8,
        tauxPresence: 97
      },
      {
        nom: 'Terminale ES',
        niveau: 'Terminale',
        section: 'ES',
        effectif: 19,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 302',
        horaire: 'Lundi, Mercredi, Vendredi',
        capacite: 25,
        noteMoyenne: 15.4,
        tauxPresence: 94
      },
      {
        nom: 'Terminale L',
        niveau: 'Terminale',
        section: 'L',
        effectif: 15,
        professeurPrincipal: null,
        status: 'active',
        salle: 'Salle 303',
        horaire: 'Mardi, Jeudi, Samedi',
        capacite: 25,
        noteMoyenne: 14.6,
        tauxPresence: 90
      }
    ];

    console.log('🔄 Création des classes...');
    const createdClasses = await Class.insertMany(classes);
    console.log(`✅ ${createdClasses.length} classes créées avec succès`);

    // Afficher les classes créées
    createdClasses.forEach(cls => {
      console.log(`📚 ${cls.nom} - ${cls.effectif} élèves - ${cls.salle}`);
    });

    console.log('🎉 Seeding des classes terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
};

// Exécuter le script
seedClasses(); 