require('dotenv').config();
const mongoose = require('mongoose');
const Parent = require('./models/Parent');
const bcrypt = require('bcryptjs');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/learnup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedParentsData() {
  try {
    console.log('🔄 Ajout de données de test pour les parents...');

    // Supprimer les données existantes
    await Parent.deleteMany({});
    console.log('✅ Anciennes données supprimées');

    // Données de test pour les parents
    const parentsData = [
      {
        nom: "Dubois",
        prenom: "Marie",
        email: "marie.dubois@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 12 34 56 78",
        adresse: "123 Rue de la Paix, Paris",
        enfants: ["Jean Dubois", "Sophie Dubois"],
        status: "active",
        dateInscription: new Date("2023-09-01"),
        derniereConnexion: new Date("2024-01-15"),
        role: "parent"
      },
      {
        nom: "Martin",
        prenom: "Pierre",
        email: "pierre.martin@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 98 76 54 32",
        adresse: "456 Avenue des Champs, Lyon",
        enfants: ["Lucas Martin"],
        status: "active",
        dateInscription: new Date("2023-08-15"),
        derniereConnexion: new Date("2024-01-10"),
        role: "parent"
      },
      {
        nom: "Bernard",
        prenom: "Sophie",
        email: "sophie.bernard@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 45 67 89 01",
        adresse: "789 Boulevard de la République, Marseille",
        enfants: ["Emma Bernard", "Thomas Bernard"],
        status: "active",
        dateInscription: new Date("2023-09-15"),
        derniereConnexion: new Date("2024-01-12"),
        role: "parent"
      },
      {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 23 45 67 89",
        adresse: "321 Rue du Commerce, Toulouse",
        enfants: ["Marie Dupont"],
        status: "inactive",
        dateInscription: new Date("2023-08-20"),
        derniereConnexion: new Date("2023-12-20"),
        role: "parent"
      },
      {
        nom: "Moreau",
        prenom: "Isabelle",
        email: "isabelle.moreau@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 78 90 12 34",
        adresse: "654 Rue des Fleurs, Nice",
        enfants: ["Alexandre Moreau", "Camille Moreau", "Léa Moreau"],
        status: "active",
        dateInscription: new Date("2023-10-05"),
        derniereConnexion: new Date("2024-01-14"),
        role: "parent"
      },
      {
        nom: "Leroy",
        prenom: "François",
        email: "francois.leroy@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 56 78 90 12",
        adresse: "987 Avenue Victor Hugo, Bordeaux",
        enfants: ["Hugo Leroy"],
        status: "active",
        dateInscription: new Date("2023-09-20"),
        derniereConnexion: new Date("2024-01-13"),
        role: "parent"
      },
      {
        nom: "Roux",
        prenom: "Catherine",
        email: "catherine.roux@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 34 56 78 90",
        adresse: "147 Rue de la Liberté, Nantes",
        enfants: ["Sarah Roux", "Paul Roux"],
        status: "suspended",
        dateInscription: new Date("2023-08-10"),
        derniereConnexion: new Date("2023-11-15"),
        role: "parent"
      },
      {
        nom: "Blanc",
        prenom: "Michel",
        email: "michel.blanc@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 90 12 34 56",
        adresse: "258 Place de la République, Strasbourg",
        enfants: ["Antoine Blanc"],
        status: "active",
        dateInscription: new Date("2023-09-25"),
        derniereConnexion: new Date("2024-01-16"),
        role: "parent"
      },
      {
        nom: "Seyf",
        prenom: "Ma",
        email: "seyfma@email.com",
        password: await bcrypt.hash("password123", 12),
        telephone: "06 11 22 33 44",
        adresse: "12 rue des Parents, Paris",
        enfants: ["Ahmed Ma", "Fatima Ma"],
        status: "active",
        dateInscription: new Date("2023-09-30"),
        derniereConnexion: new Date("2024-01-17"),
        role: "parent"
      }
    ];

    // Insérer les données
    const parents = await Parent.insertMany(parentsData);
    console.log(`✅ ${parents.length} parents ajoutés avec succès`);

    // Afficher un exemple de parent formaté
    const testParent = parents[0];
    console.log('\n📋 Exemple de parent formaté:');
    const formattedParent = {
      _id: testParent._id,
      name: `${testParent.nom} ${testParent.prenom}`,
      email: testParent.email,
      tel: testParent.telephone,
      adresse: testParent.adresse,
      children: testParent.enfants,
      status: testParent.status,
      derniereConnexion: testParent.derniereConnexion
    };
    console.log(JSON.stringify(formattedParent, null, 2));

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedParentsData(); 