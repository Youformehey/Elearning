import React, { useState, useEffect } from 'react';
import { 
  FaCog, FaServer, FaDatabase, FaShieldAlt, FaNetworkWired, 
  FaBell, FaUserShield, FaLock, FaUnlock, FaEye, FaEyeSlash,
  FaDownload, FaUpload, FaSync, FaCheck, FaTimes, FaExclamationTriangle,
  FaInfoCircle, FaQuestionCircle, FaLifeRing, FaHeadset, FaPhone,
  FaEnvelope, FaGlobe, FaMapMarkerAlt, FaClock, FaCalendar,
  FaKey, FaWifi, FaSatellite, FaSatelliteDish, FaBroadcastTower, 
  FaCogs, FaTools, FaWrench, FaHammer, FaBolt, FaMagic, FaPalette, 
  FaCode, FaChartLine, FaFileAlt, FaClipboardList, FaComments, 
  FaTrophy, FaStar, FaGraduationCap, FaSchool, FaUniversity,
  FaBuilding, FaIndustry, FaHospital, FaStore, FaBriefcase,
  FaUserTie, FaUserFriends, FaUserGraduate, FaChalkboardTeacher,
  FaUsers, FaTachometerAlt, FaPlus, FaSearch, FaFilter, FaEdit, 
  FaTrash, FaEye as FaEyeOpen, FaChevronDown, FaChevronRight, 
  FaBars, FaTimes as FaClose, FaHome, FaArrowLeft, FaArrowRight, 
  FaExpand, FaCompress, FaExternalLinkAlt, FaArrowsAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      schoolName: 'École LearnUp',
      schoolAddress: '123 Rue de l\'Éducation, Paris',
      schoolPhone: '+33 1 23 45 67 89',
      schoolEmail: 'contact@learnup.com',
      schoolWebsite: 'www.learnup.com',
      timezone: 'Europe/Paris',
      language: 'Français',
      currency: 'EUR'
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      sslEnabled: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
      studentAlerts: true,
      teacherAlerts: true,
      parentAlerts: true
    },
    system: {
      maintenanceMode: false,
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      logLevel: 'info',
      cacheEnabled: true,
      compressionEnabled: true
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      accentColor: '#10B981',
      logoUrl: '/image pfe.png',
      faviconUrl: '/favicon.ico'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const tabs = [
    { id: 'general', name: 'Général', icon: <FaCog /> },
    { id: 'security', name: 'Sécurité', icon: <FaShieldAlt /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell /> },
    { id: 'system', name: 'Système', icon: <FaServer /> },
    { id: 'appearance', name: 'Apparence', icon: <FaPalette /> }
  ];

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simuler une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <FaCog className="mr-3 text-blue-500" />
              Configuration système
            </h1>
            <p className="text-gray-600">
              Gérez tous les paramètres de votre plateforme LearnUp. Configurez la sécurité, les notifications et l'apparence.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <FaSync className="mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Sauvegarder
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Message de succès */}
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center"
          >
            <FaCheck className="mr-2" />
            Configuration sauvegardée avec succès !
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onglets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Onglet Général */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres généraux</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
                      <input
                        type="text"
                        value={settings.general.schoolName}
                        onChange={(e) => updateSetting('general', 'schoolName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                      <input
                        type="text"
                        value={settings.general.schoolAddress}
                        onChange={(e) => updateSetting('general', 'schoolAddress', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={settings.general.schoolPhone}
                        onChange={(e) => updateSetting('general', 'schoolPhone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.general.schoolEmail}
                        onChange={(e) => updateSetting('general', 'schoolEmail', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                      <input
                        type="url"
                        value={settings.general.schoolWebsite}
                        onChange={(e) => updateSetting('general', 'schoolWebsite', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Sécurité */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres de sécurité</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Longueur minimale du mot de passe</label>
                      <input
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="6"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timeout de session (minutes)</label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="5"
                        max="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tentatives de connexion max</label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="3"
                        max="10"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireSpecialChars}
                          onChange={(e) => updateSetting('security', 'requireSpecialChars', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Exiger des caractères spéciaux</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireNumbers}
                          onChange={(e) => updateSetting('security', 'requireNumbers', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Exiger des chiffres</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireUppercase}
                          onChange={(e) => updateSetting('security', 'requireUppercase', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Exiger des majuscules</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Authentification à deux facteurs</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.sslEnabled}
                          onChange={(e) => updateSetting('security', 'sslEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">SSL activé</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres de notifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Types de notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Notifications par email</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.smsNotifications}
                            onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Notifications par SMS</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.pushNotifications}
                            onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Notifications push</label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Alertes par utilisateur</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.adminAlerts}
                            onChange={(e) => updateSetting('notifications', 'adminAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Alertes administrateur</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.studentAlerts}
                            onChange={(e) => updateSetting('notifications', 'studentAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Alertes étudiant</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.teacherAlerts}
                            onChange={(e) => updateSetting('notifications', 'teacherAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Alertes professeur</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.parentAlerts}
                            onChange={(e) => updateSetting('notifications', 'parentAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Alertes parent</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Système */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres système</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence de sauvegarde</label>
                      <select
                        value={settings.system.backupFrequency}
                        onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="hourly">Toutes les heures</option>
                        <option value="daily">Quotidienne</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuelle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rétention des sauvegardes (jours)</label>
                      <input
                        type="number"
                        value={settings.system.backupRetention}
                        onChange={(e) => updateSetting('system', 'backupRetention', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        max="365"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de log</label>
                      <select
                        value={settings.system.logLevel}
                        onChange={(e) => updateSetting('system', 'logLevel', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="debug">Debug</option>
                        <option value="info">Info</option>
                        <option value="warn">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.system.maintenanceMode}
                          onChange={(e) => updateSetting('system', 'maintenanceMode', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Mode maintenance</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.system.autoBackup}
                          onChange={(e) => updateSetting('system', 'autoBackup', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Sauvegarde automatique</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.system.cacheEnabled}
                          onChange={(e) => updateSetting('system', 'cacheEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Cache activé</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.system.compressionEnabled}
                          onChange={(e) => updateSetting('system', 'compressionEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">Compression activée</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Apparence */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres d'apparence</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                        <option value="auto">Automatique</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Couleur primaire</label>
                      <input
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Couleur secondaire</label>
                      <input
                        type="color"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Couleur d'accent</label>
                      <input
                        type="color"
                        value={settings.appearance.accentColor}
                        onChange={(e) => updateSetting('appearance', 'accentColor', e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL du logo</label>
                      <input
                        type="url"
                        value={settings.appearance.logoUrl}
                        onChange={(e) => updateSetting('appearance', 'logoUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL du favicon</label>
                      <input
                        type="url"
                        value={settings.appearance.faviconUrl}
                        onChange={(e) => updateSetting('appearance', 'faviconUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings; 