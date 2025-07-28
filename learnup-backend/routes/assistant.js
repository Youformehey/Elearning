const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Base de connaissances pour l'assistant IA
const knowledgeBase = {
  // Méthodes d'étude
  "pomodoro": {
    reply: "La méthode Pomodoro est une technique de gestion du temps très efficace ! 🍅\n\nVoici comment ça marche :\n• Étudie pendant 25 minutes sans interruption\n• Prends une pause de 5 minutes\n• Après 4 cycles, prends une pause plus longue (15-30 min)\n\nCette méthode t'aide à :\n✅ Maintenir ta concentration\n✅ Éviter la fatigue mentale\n✅ Améliorer ta productivité\n✅ Structurer ton temps d'étude\n\nConseil : Utilise un minuteur et élimine toutes les distractions pendant les sessions de travail ! ⏰"
  },
  
  "révisions": {
    reply: "Voici mes meilleurs conseils pour organiser tes révisions efficacement ! 📚✨\n\n🎯 **Planification intelligente :**\n• Crée un planning hebdomadaire\n• Alterne les matières difficiles et faciles\n• Privilégie les matières importantes en premier\n\n🧠 **Techniques d'apprentissage :**\n• La répétition espacée (réviser à intervalles réguliers)\n• Les cartes mémoire (flashcards)\n• L'enseignement à d'autres (expliquer à un ami)\n• Les mind maps pour visualiser\n\n⏰ **Gestion du temps :**\n• Étudie aux heures où tu es le plus productif\n• Fais des pauses régulières\n• Évite le bachotage de dernière minute\n\n💪 **Conseils bonus :**\n• Dors suffisamment (8h minimum)\n• Mange équilibré\n• Fais de l'exercice régulièrement\n• Reste hydraté !"
  },
  
  "concentration": {
    reply: "Améliorer sa concentration, c'est possible ! Voici mes secrets : 🎯\n\n🌍 **Environnement optimal :**\n• Un espace de travail calme et bien éclairé\n• Élimine toutes les distractions (téléphone en mode avion)\n• Une température confortable (18-22°C)\n• Une chaise ergonomique\n\n🧘 **Techniques mentales :**\n• La méditation de pleine conscience (5-10 min par jour)\n• Les exercices de respiration profonde\n• La technique du 'point de focus' (fixer un objet)\n\n📱 **Gestion du numérique :**\n• Utilise des apps de blocage (Forest, Focus@Will)\n• Programme des sessions de travail sans interruption\n• Désactive les notifications\n\n🍎 **Bien-être physique :**\n• Bois suffisamment d'eau\n• Mange des aliments riches en oméga-3\n• Fais des pauses actives (étirements, marche)\n• Respecte ton cycle de sommeil\n\n💡 **Astuce bonus :** Commence par des sessions courtes (15-20 min) et augmente progressivement !"
  },
  
  "stress": {
    reply: "Gérer le stress avant les examens, c'est crucial ! Voici mes techniques : 😌\n\n🧘 **Techniques de relaxation :**\n• Respiration 4-7-8 (inspire 4s, retiens 7s, expire 8s)\n• Relaxation musculaire progressive\n• Méditation guidée (apps comme Headspace)\n• Yoga ou stretching doux\n\n📅 **Préparation mentale :**\n• Visualise ta réussite\n• Prépare-toi mentalement (répète le scénario)\n• Accepte que le stress est normal\n• Concentre-toi sur le processus, pas le résultat\n\n🏃 **Activités anti-stress :**\n• Exercice physique modéré (marche, natation)\n• Activités créatives (dessin, musique)\n• Sorties avec des amis\n• Lecture plaisir\n\n🍎 **Hygiène de vie :**\n• Sommeil régulier et suffisant\n• Alimentation équilibrée\n• Hydratation (eau, tisanes)\n• Évite la caféine excessive\n\n💪 **Le jour J :**\n• Arrive en avance\n• Respire profondément\n• Bois de l'eau\n• Fais confiance à tes révisions !"
  },
  
  "notes": {
    reply: "Prendre de bonnes notes, c'est un art ! Voici mes méthodes : ✍️\n\n📝 **Méthode Cornell :**\n• Divise ta feuille en 3 parties\n• Notes principales au centre\n• Mots-clés à gauche\n• Résumé en bas\n\n🎨 **Mind Mapping :**\n• Idée centrale au milieu\n• Branches pour les sous-thèmes\n• Utilise des couleurs et symboles\n• Connecte les idées\n\n📋 **Méthode Outline :**\n• Hiérarchie claire (I, A, 1, a)\n• Indentation pour les sous-points\n• Mots-clés et phrases courtes\n• Abréviations personnelles\n\n💡 **Conseils pratiques :**\n• Écoute activement (ne note pas tout)\n• Utilise tes propres mots\n• Ajoute des exemples personnels\n• Relis et complète tes notes rapidement\n\n🔄 **Après le cours :**\n• Relis tes notes dans les 24h\n• Complète les informations manquantes\n• Crée des résumés\n• Teste-toi régulièrement\n\n✨ **Astuce :** Utilise des codes couleur pour organiser tes notes par thème !"
  },
  
  "outils": {
    reply: "Voici mes outils d'étude préférés ! 🛠️\n\n📱 **Applications numériques :**\n• Anki (cartes mémoire espacées)\n• Forest (concentration)\n• Notion (organisation)\n• Quizlet (révisions interactives)\n• Pomodoro Timer (gestion du temps)\n\n📚 **Outils traditionnels :**\n• Post-its colorés pour les points importants\n• Surligneurs pour les mots-clés\n• Carnets de notes de qualité\n• Planificateur papier\n• Tableau blanc pour les mind maps\n\n💻 **Ressources en ligne :**\n• Khan Academy (vidéos explicatives)\n• Coursera (cours en ligne)\n• YouTube Education\n• Wikipédia pour les recherches\n• Google Scholar pour les sources\n\n🎯 **Outils de productivité :**\n• Trello (gestion de projets)\n• Evernote (prise de notes)\n• Google Calendar (planification)\n• Grammarly (correction)\n• Wolfram Alpha (calculs)\n\n💡 **Conseil :** Choisis les outils qui correspondent à ton style d'apprentissage !"
  }
};

// Fonction pour analyser la question et trouver la meilleure réponse
const analyzeQuestion = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  // Recherche par mots-clés
  if (lowerQuestion.includes('pomodoro') || lowerQuestion.includes('gestion du temps')) {
    return knowledgeBase.pomodoro.reply;
  }
  
  if (lowerQuestion.includes('révision') || lowerQuestion.includes('organiser') || lowerQuestion.includes('planifier')) {
    return knowledgeBase.révisions.reply;
  }
  
  if (lowerQuestion.includes('concentration') || lowerQuestion.includes('focus') || lowerQuestion.includes('distraction')) {
    return knowledgeBase.concentration.reply;
  }
  
  if (lowerQuestion.includes('stress') || lowerQuestion.includes('anxiété') || lowerQuestion.includes('examens')) {
    return knowledgeBase.stress.reply;
  }
  
  if (lowerQuestion.includes('note') || lowerQuestion.includes('prendre') || lowerQuestion.includes('écrire')) {
    return knowledgeBase.notes.reply;
  }
  
  if (lowerQuestion.includes('outil') || lowerQuestion.includes('application') || lowerQuestion.includes('app')) {
    return knowledgeBase.outils.reply;
  }
  
  // Réponse par défaut
  return `Merci pour ta question ! 🤖✨\n\nJe suis ton assistant IA personnel et je suis là pour t'aider dans tes études. Voici quelques sujets sur lesquels je peux te conseiller :\n\n📚 **Méthodes d'étude** (révisions, organisation)\n⏰ **Gestion du temps** (méthode Pomodoro)\n🎯 **Concentration** (techniques de focus)\n😌 **Gestion du stress** (avant les examens)\n✍️ **Prise de notes** (méthodes efficaces)\n🛠️ **Outils d'étude** (applications et ressources)\n\nN'hésite pas à me poser une question plus spécifique sur l'un de ces sujets ! Je suis là pour t'accompagner vers la réussite ! 🚀💪`;
};

// Route pour poser une question à l'assistant
router.post('/ask', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Veuillez fournir une question valide." 
      });
    }
    
    // Analyser la question et générer une réponse
    const reply = analyzeQuestion(message);
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    res.status(200).json({
      success: true,
      reply: reply,
      timestamp: new Date(),
      message: "Réponse générée avec succès"
    });
    
  } catch (error) {
    console.error('Erreur Assistant IA:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du traitement de votre question. Veuillez réessayer.",
      error: error.message
    });
  }
});

// Route pour obtenir des suggestions de questions
router.get('/suggestions', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const suggestions = [
      "Comment organiser mes révisions efficacement ?",
      "Qu'est-ce que la méthode Pomodoro ?",
      "Comment améliorer ma concentration ?",
      "Comment gérer mon stress avant les examens ?",
      "Quelle est la meilleure façon de prendre des notes ?",
      "Quels sont les meilleurs outils d'étude ?"
    ];
    
    res.status(200).json({
      success: true,
      suggestions: suggestions
    });
    
  } catch (error) {
    console.error('Erreur suggestions:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des suggestions."
    });
  }
});

module.exports = router;
