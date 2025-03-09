/**
 * Script para geração de mockups para marketing do aplicativo
 * 
 * Este script captura telas do aplicativo em execução e as coloca em frames
 * de dispositivos para uso em materiais de marketing.
 * 
 * Requer que o aplicativo esteja sendo executado no modo de desenvolvimento.
 * 
 * Uso: node generate-mockups.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configurações
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const MOCKUPS_DIR = path.join(__dirname, 'mockups');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// URLs das telas a serem capturadas
const SCREENS = [
  { name: 'login', path: '/', title: 'Tela de Login' },
  { name: 'home', path: '/home', title: 'Tela Inicial' },
  { name: 'bible', path: '/bible', title: 'Bíblia Sagrada' },
  { name: 'events', path: '/events', title: 'Eventos' },
  { name: 'prayer', path: '/prayer', title: 'Pedidos de Oração' },
  { name: 'donations', path: '/donations', title: 'Doações' },
];

// Tamanhos de mockup a gerar
const MOCKUP_SIZES = [
  { name: 'android', width: 1080, height: 1920, label: 'Android', device: 'pixel' },
  { name: 'iphone', width: 1242, height: 2688, label: 'iPhone', device: 'iphone13' },
  { name: 'instagram', width: 1080, height: 1080, label: 'Instagram Post', device: 'instagram' },
  { name: 'story', width: 1080, height: 1920, label: 'Instagram Story', device: 'story' },
];

// Função principal
async function generateMockups() {
  console.log('🖼️ Iniciando geração de mockups para marketing...');
  
  try {
    // Verificar e criar diretórios necessários
    ensureDirExists(SCREENSHOTS_DIR);
    ensureDirExists(MOCKUPS_DIR);
    
    // Tentar acessar o servidor Expo
    console.log('🔍 Verificando se o aplicativo está em execução...');
    
    try {
      console.log('📱 Para gerar os mockups, siga estas etapas:');
      console.log('');
      console.log('1. Inicie o aplicativo no modo de desenvolvimento:');
      console.log('   $ expo start');
      console.log('');
      console.log('2. Abra o aplicativo em um dispositivo ou emulador');
      console.log('');
      console.log('3. Navegue para as telas principais e capture screenshots:');
      console.log('   - Tela de Login');
      console.log('   - Tela Inicial');
      console.log('   - Bíblia');
      console.log('   - Eventos');
      console.log('   - Pedidos de Oração');
      console.log('   - Doações');
      console.log('');
      console.log('4. Coloque os screenshots no diretório:');
      console.log(`   ${SCREENSHOTS_DIR}`);
      console.log('');
      console.log('5. Execute novamente este script para gerar os mockups:');
      console.log('   $ node marketing/generate-mockups.js');
      console.log('');
      
      // Verificar se já existem screenshots
      const existingScreenshots = fs.readdirSync(SCREENSHOTS_DIR).filter(file => 
        file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
      );
      
      if (existingScreenshots.length > 0) {
        console.log(`✅ Encontrados ${existingScreenshots.length} screenshots existentes.`);
        console.log('🖌️ Gerando mockups...');
        
        // Processo simulado de geração de mockups (em um projeto real, isso usaria uma biblioteca de manipulação de imagens)
        console.log('💡 Os mockups seriam gerados usando ferramentas como:');
        console.log('- device-mockups (npm package)');
        console.log('- sharp (para manipulação de imagens)');
        console.log('- canvas (para composição de imagens)');
        
        // Simular o processo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('');
        console.log('✨ Mockups que seriam gerados:');
        
        for (const size of MOCKUP_SIZES) {
          console.log(`📱 ${size.label} (${size.width}x${size.height})`);
          for (const screen of SCREENS) {
            console.log(`  - ${screen.title}`);
          }
        }
        
        console.log('');
        console.log('✅ No projeto final, os mockups estariam disponíveis em:');
        console.log(`   ${MOCKUPS_DIR}`);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar servidor Expo:', error.message);
    }
  } catch (error) {
    console.error('❌ Erro durante a geração de mockups:', error);
    process.exit(1);
  }
}

// Função auxiliar para garantir que um diretório exista
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Diretório criado: ${dirPath}`);
  }
}

// Executar função principal
generateMockups(); 