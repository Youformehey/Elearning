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
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export default function AssistantIA() {
  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      text: "Salut ! Je suis ton assistant IA personnel 🤖✨ Pose-moi une question sur l'école, tes devoirs, ou demande-moi de l'aide pour tes études ! Je suis là pour t'aider à réussir ! 🎓",
      timestamp: new Date(),
      type: "welcome"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simuler la frappe de l'IA
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
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
    setIsTyping(false);
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
      const errorMessage = "Désolé, je rencontre des difficultés techniques. Vérifiez votre connexion ou réessayez plus tard ! 😅";
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
    "Quelle est la meilleure façon de prendre des notes ? ✍️"
  ];

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRandomEmoji = () => {
    const emojis = ["🤖", "✨", "🎓", "💡", "🚀", "🌟", "🎯", "💪", "🧠", "📚"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex h-screen">
        {/* Sidebar - Desktop */}
        <div className={`hidden lg:flex w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-col`}>
          {/* Header Sidebar */}
          <div className={`p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className={`font-bold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assistant IA</h2>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>En ligne</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 sm:p-4">
            <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Questions rapides
            </h3>
            <div className="space-y-2">
              {quickQuestions.map((question, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setInput(question)}
                  className={`w-full text-left p-2 sm:p-3 rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="p-3 sm:p-4 mt-auto">
            <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className={`font-semibold mb-2 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Fonctionnalités
              </h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IA Intelligente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Réponse rapide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Conseils d'étude</span>
                </div>
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
                className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col lg:hidden`}
              >
                {/* Mobile Sidebar Header */}
                <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Bot className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h2 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assistant IA</h2>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>En ligne</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>

                {/* Mobile Quick Actions */}
                <div className="p-3 flex-1 overflow-y-auto">
                  <h3 className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all duration-200 ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mobile Features */}
                <div className="p-3">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h4 className={`font-semibold mb-2 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Fonctionnalités
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Brain className="w-3 h-3 text-purple-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IA Intelligente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Réponse rapide</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-3 h-3 text-blue-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Conseils d'étude</span>
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
          <div className={`p-3 sm:p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-lg lg:hidden ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Menu className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Bot className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className={`font-bold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Assistant IA {getRandomEmoji()}
                </h1>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {loading ? "En train de réfléchir..." : "Prêt à t'aider !"}
                </p>
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
          <div className={`flex-1 overflow-y-auto p-3 sm:p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
                    <div className="p-1 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                      <Bot className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  )}
                  
                  <div className={`max-w-[280px] sm:max-w-md lg:max-w-lg ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                      msg.role === 'bot'
                        ? darkMode 
                          ? 'bg-gray-800 text-white border border-gray-700' 
                          : 'bg-white text-gray-900 border border-gray-200 shadow-lg'
                        : darkMode 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                    }`}>
                      <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                      {msg.type === 'welcome' && (
                        <div className="mt-2 sm:mt-3 flex items-center gap-2">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                          <span className="text-xs text-pink-500">Je suis là pour t'aider !</span>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>

                  {msg.role === 'user' && (
                    <div className="p-1 sm:p-2 bg-blue-500 rounded-full">
                      <User className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 sm:gap-3 justify-start"
                >
                  <div className="p-1 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Bot className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-lg'
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
          <div className={`p-3 sm:p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2 text-xs sm:text-sm"
                >
                  <AlertCircle size={12} className="sm:w-4 sm:h-4" />
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
                  className={`w-full p-3 sm:p-4 pr-16 sm:pr-20 rounded-xl sm:rounded-2xl border-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-xs sm:text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-400'
                  }`}
                  rows={1}
                  style={{ minHeight: '50px', maxHeight: '120px' }}
                />
                <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex items-center gap-1 sm:gap-2">
                  <motion.button
                    className={`p-1 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Paperclip className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </motion.button>
                  <motion.button
                    className={`p-1 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
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
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
                whileHover={!loading && input.trim() ? { scale: 1.05 } : {}}
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
