const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Redémarrage du serveur...');

// Tuer le processus existant s'il y en a un
const killProcess = spawn('taskkill', ['/F', '/IM', 'node.exe'], { 
  stdio: 'ignore',
  shell: true 
});

killProcess.on('close', () => {
  console.log('✅ Ancien processus terminé');
  
  // Redémarrer le serveur
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  server.on('error', (error) => {
    console.error('❌ Erreur démarrage serveur:', error);
  });
  
  server.on('close', (code) => {
    console.log(`🔄 Serveur terminé avec le code: ${code}`);
  });
  
  console.log('🚀 Serveur redémarré !');
});

killProcess.on('error', () => {
  console.log('ℹ️ Aucun processus à tuer, démarrage direct...');
  
  // Redémarrer le serveur
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  server.on('error', (error) => {
    console.error('❌ Erreur démarrage serveur:', error);
  });
  
  console.log('🚀 Serveur démarré !');
}); 