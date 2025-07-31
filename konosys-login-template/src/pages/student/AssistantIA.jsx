import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Brain,
  Lightbulb,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Star,
  Target,
  Award,
  Smile,
  Heart,
  Rocket,
  BookOpen,
  GraduationCap,
  Play,
  Pause,
  Volume2,
  Mic,
  Paperclip,
  MoreVertical,
  Settings,
  HelpCircle,
  Menu,
  X,
  Music,
  Palette,
  Calculator,
  Globe,
  Code,
  Video,
  FileText,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Shield,
  Crown,
  Gem,
  Diamond
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export default function AssistantIA() {
  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      text: "Salut petit(e) génie ! 🤖✨ Je suis ton assistant IA personnel ! Pose-moi une question sur l'école, tes devoirs, ou demande-moi de l'aide pour tes études ! Je suis là pour t'aider à devenir un(e) super élève ! 🎓🚀",
      timestamp: new Date(),
      type: "welcome"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simuler la frappe de l'IA avec plus d'effets visuels
  const simulateTyping = async (text) => {
    setIsTyping(true);
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + ' ';
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].role === 'bot') {
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            text: currentText.trim()
          };
        }
        return newMessages;
      });
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 80));
    }
    setIsTyping(false);
    
    // Afficher des confettis pour les réponses positives
    if (text.includes('bravo') || text.includes('excellent') || text.includes('super') || text.includes('félicitations')) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { 
      role: "user", 
      text: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setLoading(true);
    setError(null);

    // Ajouter un message de l'IA en cours de frappe
    const botMessage = { 
      role: "bot", 
      text: "",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, botMessage]);

    try {
      // Appel à l'API backend
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const res = await axios.post("http://localhost:5001/api/assistant/ask", 
        { message: userInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Simuler la frappe de la réponse
      await simulateTyping(res.data.reply || "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?");
      
    } catch (err) {
      console.error("Erreur API Assistant:", err);
      const errorMessage = "Oups ! Je rencontre des difficultés techniques. Vérifiez votre connexion ou réessayez plus tard ! 😅";
      await simulateTyping(errorMessage);
      setError("Impossible de contacter l'assistant. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Comment organiser mes révisions ? 📚",
    "Qu'est-ce que la méthode Pomodoro ? ⏰",
    "Comment améliorer ma concentration ? 🎯",
    "Quels sont les meilleurs outils d'étude ? 🛠️",
    "Comment gérer mon stress avant les examens ? 😌",
    "Quelle est la meilleure façon de prendre des notes ? ✍️",
    "Comment mémoriser plus facilement ? 🧠",
    "Quels jeux pour apprendre en s'amusant ? 🎮",
    "Comment bien préparer mes contrôles ? 📝",
    "Quelles techniques pour rester motivé(e) ? 💪"
  ];

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRandomEmoji = () => {
    const emojis = ["🤖", "✨", "🎓", "💡", "🚀", "🌟", "🎯", "💪", "🧠", "📚", "🌈", "🦋", "🌸", "🌲", "☀️", "🌙", "☁️", "🎵", "🎨", "🧮", "🌍", "💻", "📷", "🎥", "📄", "⬇️", "📤", "👍", "👎", "🚩", "🛡️", "👑", "💎", "💠", "⭐"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Composant Confetti
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#ff9f43', '#00d2d3', '#5f27cd'][Math.floor(Math.random() * 10)]
          }}
          initial={{ y: -10, opacity: 1, scale: 0 }}
          animate={{ 
            y: window.innerHeight + 10, 
            opacity: [1, 1, 0], 
            scale: [0, 1, 0],
            x: Math.random() * 200 - 100
          }}
          transition={{ 
            duration: 2.5, 
            ease: "easeOut",
            delay: Math.random() * 0.3
          }}
        />
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50'}`}>
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* Sidebar - Desktop */}
        <div className={`hidden lg:flex w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-col shadow-2xl`}>
          {/* Header Sidebar */}
          <div className={`p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600' : 'border-gray-200 bg-gradient-to-r from-pink-500 to-purple-600'} relative overflow-hidden`}>
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="flex items-center gap-2 sm:gap-3 relative z-10">
              <motion.div 
                className="p-3 bg-white/20 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 10 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Bot className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </motion.div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-white">Assistant IA Magique</h2>
                <p className="text-xs sm:text-sm text-pink-100">En ligne et prêt à t'aider ! ✨</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
            <h3 className={`text-xs sm:text-sm font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
              <Sparkles className="w-4 h-4 text-purple-500" />
              Questions rapides
            </h3>
            <div className="space-y-2">
              {quickQuestions.map((question, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setInput(question)}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl text-xs sm:text-sm transition-all duration-200 border-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-pink-50 border-pink-200 shadow-md'
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="p-3 sm:p-4">
            <div className={`p-4 sm:p-5 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200'}`}>
              <h4 className={`font-semibold mb-3 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <Award className="w-4 h-4 text-yellow-500" />
                Fonctionnalités
              </h4>
              <div className="space-y-3 text-xs sm:text-sm">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IA Intelligente</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Réponse rapide</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Conseils d'étude</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Apprentissage ludique</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col lg:hidden shadow-2xl`}
              >
                {/* Mobile Sidebar Header */}
                <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600' : 'border-gray-200 bg-gradient-to-r from-pink-500 to-purple-600'} flex items-center justify-between relative overflow-hidden`}>
                  <motion.div
                    className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="flex items-center gap-3 relative z-10">
                    <motion.div 
                      className="p-2 bg-white/20 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <Bot className="text-white w-5 h-5" />
                    </motion.div>
                    <div>
                      <h2 className="font-bold text-sm text-white">Assistant IA Magique</h2>
                      <p className="text-xs text-pink-100">En ligne et prêt à t'aider ! ✨</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-white/20'} relative z-10`}
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Mobile Quick Actions */}
                <div className="p-3 flex-1 overflow-y-auto">
                  <h3 className={`text-xs font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Questions rapides
                  </h3>
                  <div className="space-y-2">
                    {quickQuestions.map((question, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => {
                          setInput(question);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl text-xs transition-all duration-200 border-2 ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-pink-50 border-pink-200 shadow-md'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mobile Features */}
                <div className="p-3">
                  <div className={`p-4 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200'}`}>
                    <h4 className={`font-semibold mb-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                      <Award className="w-4 h-4 text-yellow-500" />
                      Fonctionnalités
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IA Intelligente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Réponse rapide</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Conseils d'étude</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Apprentissage ludique</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className={`p-3 sm:p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex items-center justify-between shadow-lg`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-lg lg:hidden ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </motion.button>
              
              <motion.div 
                className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                whileHover={{ scale: 1.1, rotate: 10 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Bot className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <div>
                <motion.h1 
                  className={`font-bold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Assistant IA {getRandomEmoji()}
                </motion.h1>
                <motion.p 
                  className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {loading ? "En train de réfléchir..." : "Prêt à t'aider ! ✨"}
                </motion.p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.button
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </motion.button>
              <motion.button
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HelpCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </motion.button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-3 sm:p-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50'}`}>
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <motion.div 
                      className="p-1 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Bot className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  )}
                  
                  <div className={`max-w-[280px] sm:max-w-md lg:max-w-lg ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                    <motion.div 
                      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 ${
                        msg.role === 'bot'
                          ? darkMode 
                            ? 'bg-gray-800 text-white border-gray-700 shadow-lg' 
                            : 'bg-white text-gray-900 border-pink-200 shadow-lg'
                          : darkMode 
                            ? 'bg-blue-600 text-white border-blue-500' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                      {msg.type === 'welcome' && (
                        <motion.div 
                          className="mt-2 sm:mt-3 flex items-center gap-2"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                          <span className="text-xs text-pink-500">Je suis là pour t'aider !</span>
                        </motion.div>
                      )}
                    </motion.div>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>

                  {msg.role === 'user' && (
                    <motion.div 
                      className="p-1 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      whileHover={{ scale: 1.1, rotate: -10 }}
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <User className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 sm:gap-3 justify-start"
                >
                  <motion.div 
                    className="p-1 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Bot className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-pink-200 shadow-lg'
                  }`}>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      />
                      <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Je réfléchis...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-3 sm:p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-xl flex items-center gap-2 text-xs sm:text-sm"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <AlertCircle size={12} className="sm:w-4 sm:h-4" />
                  </motion.div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 sm:gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Pose ta question à l'assistant IA... 🤖✨"
                  className={`w-full p-3 sm:p-4 pr-20 sm:pr-24 rounded-xl sm:rounded-2xl border-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-xs sm:text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                      : 'bg-white border-pink-300 text-gray-900 placeholder-gray-500 focus:border-purple-400'
                  }`}
                  rows={1}
                  style={{ minHeight: '50px', maxHeight: '120px' }}
                />
                <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex items-center gap-1 sm:gap-2">
                  <motion.button
                    className={`p-1 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-pink-100'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Paperclip className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </motion.button>
                  <motion.button
                    className={`p-1 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-pink-100'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </motion.button>
                </div>
              </div>
              <motion.button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  loading || !input.trim()
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                }`}
                whileHover={!loading && input.trim() ? { scale: 1.05, y: -2 } : {}}
                whileTap={!loading && input.trim() ? { scale: 0.95 } : {}}
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                >
                  {loading ? <RefreshCw size={16} className="sm:w-5 sm:h-5" /> : <Send size={16} className="sm:w-5 sm:h-5" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
