/**
 * Script para personalização do aplicativo Igreja Connect
 * 
 * Este script substitui os assets e configurações padrão pelos personalizados.
 * Deve ser executado após a customização do tema e antes do build do aplicativo.
 * 
 * Uso: node personalize.js [options]
 * Opções:
 *   --marketing    Também gera materiais de marketing personalizados
 *   --help         Exibe ajuda
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Diretórios
const CUSTOM_ASSETS_DIR = path.join(__dirname, 'custom-assets');
const APP_ASSETS_DIR = path.join(__dirname, 'src', 'assets');
const THEME_FILE = path.join(__dirname, 'src', 'utils', 'theme.js');
const MARKETING_DIR = path.join(__dirname, 'marketing');

// Função principal
async function personalize() {
  console.log('🔄 Iniciando personalização do aplicativo...');
  
  // Verificar argumentos
  const args = process.argv.slice(2);
  const generateMarketing = args.includes('--marketing');
  const showHelp = args.includes('--help');
  
  if (showHelp) {
    displayHelp();
    return;
  }
  
  try {
    // Verificar se o diretório custom-assets existe
    if (!fs.existsSync(CUSTOM_ASSETS_DIR)) {
      console.log('❌ Diretório custom-assets não encontrado. Criando diretório vazio...');
      fs.mkdirSync(CUSTOM_ASSETS_DIR);
      fs.mkdirSync(path.join(CUSTOM_ASSETS_DIR, 'images'));
      fs.mkdirSync(path.join(CUSTOM_ASSETS_DIR, 'fonts'));
      
      console.log(`✅ Diretório custom-assets criado em ${CUSTOM_ASSETS_DIR}`);
      console.log('⚠️ Adicione seus arquivos personalizados e execute o script novamente.');
      return;
    }
    
    // Substituir imagens
    const customImagesDir = path.join(CUSTOM_ASSETS_DIR, 'images');
    const appImagesDir = path.join(APP_ASSETS_DIR);
    
    if (fs.existsSync(customImagesDir)) {
      console.log('🖼️ Substituindo imagens...');
      const images = fs.readdirSync(customImagesDir);
      
      for (const image of images) {
        const sourcePath = path.join(customImagesDir, image);
        const targetPath = path.join(appImagesDir, image);
        
        // Verificar se é um arquivo (não um diretório)
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`  ✅ Substituído: ${image}`);
        }
      }
    }
    
    // Substituir fontes
    const customFontsDir = path.join(CUSTOM_ASSETS_DIR, 'fonts');
    const appFontsDir = path.join(APP_ASSETS_DIR, 'fonts');
    
    if (fs.existsSync(customFontsDir)) {
      console.log('🔤 Substituindo fontes...');
      
      // Garantir que o diretório de destino existe
      if (!fs.existsSync(appFontsDir)) {
        fs.mkdirSync(appFontsDir, { recursive: true });
      }
      
      const fonts = fs.readdirSync(customFontsDir);
      
      for (const font of fonts) {
        const sourcePath = path.join(customFontsDir, font);
        const targetPath = path.join(appFontsDir, font);
        
        // Verificar se é um arquivo (não um diretório)
        if (fs.statSync(sourcePath).isFile()) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`  ✅ Substituído: ${font}`);
        }
      }
    }
    
    // Verificar tema personalizado
    if (fs.existsSync(THEME_FILE)) {
      console.log('🎨 Tema personalizado encontrado.');
      
      // Verificar se existe um arquivo package.json para atualizar nome do app
      const packageJsonPath = path.join(__dirname, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const themeContent = fs.readFileSync(THEME_FILE, 'utf8');
        
        // Tentar obter o nome da igreja do tema
        let churchName = 'Igreja Connect';
        const match = themeContent.match(/name:\s*['"]([^'"]+)['"]/);
        if (match && match[1]) {
          churchName = match[1];
        }
        
        console.log(`📝 Atualizando nome do aplicativo para: ${churchName}`);
        
        // Ler e atualizar package.json
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.name = churchName.toLowerCase().replace(/\s+/g, '-');
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
        console.log('✅ package.json atualizado com sucesso.');
        
        // Personalizar materiais de marketing se solicitado
        if (generateMarketing) {
          await personalizeMarketingMaterials(churchName, themeContent);
        }
      }
    }
    
    console.log('✅ Personalização concluída com sucesso!');
    console.log('');
    console.log('📱 Agora você pode construir seu aplicativo:');
    console.log('   > expo build:android');
    console.log('   > expo build:ios');
    console.log('');
    
    if (!generateMarketing) {
      console.log('💡 Dica: Execute com --marketing para gerar materiais de marketing personalizados:');
      console.log('   > node personalize.js --marketing');
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a personalização:', error);
    process.exit(1);
  }
}

// Função para personalizar materiais de marketing
async function personalizeMarketingMaterials(churchName, themeContent) {
  console.log('🎯 Personalizando materiais de marketing...');
  
  try {
    // Verificar se os diretórios de marketing existem
    if (!fs.existsSync(MARKETING_DIR)) {
      console.log('❌ Diretório de marketing não encontrado.');
      return;
    }
    
    const templatesDir = path.join(MARKETING_DIR, 'templates');
    
    if (!fs.existsSync(templatesDir)) {
      console.log('❌ Diretórios de templates de marketing não encontrados.');
      return;
    }
    
    // Criar diretório para materiais de marketing personalizados
    const outputDir = path.join(MARKETING_DIR, 'personalizado');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Extrair informações do tema
    let whatsappNumber = '5500000000000';
    let churchAddress = 'Rua das Flores, 123';
    let churchCity = 'Sua Cidade - UF';
    let churchPhone = '(00) 00000-0000';
    let churchEmail = 'contato@exemplo.com';
    let churchWebsite = 'www.exemplo.com';
    let facebookUrl = 'https://facebook.com/';
    let instagramUrl = 'https://instagram.com/';
    
    // Extrair WhatsApp
    const whatsappMatch = themeContent.match(/whatsappNumber:\s*['"]([\d]+)['"]/);
    if (whatsappMatch && whatsappMatch[1]) {
      whatsappNumber = whatsappMatch[1];
    }
    
    // Extrair endereço
    const addressMatch = themeContent.match(/address:\s*['"]([^'"]+)['"]/);
    if (addressMatch && addressMatch[1]) {
      churchAddress = addressMatch[1];
    }
    
    // Extrair cidade
    const cityMatch = themeContent.match(/city:\s*['"]([^'"]+)['"]/);
    if (cityMatch && cityMatch[1]) {
      churchCity = cityMatch[1];
    }
    
    // Extrair telefone
    const phoneMatch = themeContent.match(/phone:\s*['"]([^'"]+)['"]/);
    if (phoneMatch && phoneMatch[1]) {
      churchPhone = phoneMatch[1];
    }
    
    // Extrair email
    const emailMatch = themeContent.match(/email:\s*['"]([^'"]+)['"]/);
    if (emailMatch && emailMatch[1]) {
      churchEmail = emailMatch[1];
    }
    
    // Extrair website
    const websiteMatch = themeContent.match(/website:\s*['"]([^'"]+)['"]/);
    if (websiteMatch && websiteMatch[1]) {
      churchWebsite = websiteMatch[1];
    }
    
    // Personalizar template de e-mail
    const emailTemplatePath = path.join(templatesDir, 'email-template.html');
    if (fs.existsSync(emailTemplatePath)) {
      let emailContent = fs.readFileSync(emailTemplatePath, 'utf8');
      
      // Substituir placeholders
      emailContent = emailContent.replace(/\[NOME_IGREJA\]/g, churchName);
      emailContent = emailContent.replace(/\[NOME_APP\]/g, `${churchName} App`);
      emailContent = emailContent.replace(/\[ENDERECO_IGREJA\]/g, `${churchAddress}, ${churchCity}`);
      emailContent = emailContent.replace(/\[TELEFONE_IGREJA\]/g, churchPhone);
      emailContent = emailContent.replace(/\[WHATSAPP_NUMERO\]/g, churchPhone);
      
      // Salvar versão personalizada
      const outputEmailPath = path.join(outputDir, 'email-marketing.html');
      fs.writeFileSync(outputEmailPath, emailContent);
      console.log(`✅ Template de e-mail personalizado salvo em ${outputEmailPath}`);
    }
    
    // Personalizar template de WhatsApp
    const whatsappTemplatePath = path.join(templatesDir, 'whatsapp-texto.txt');
    if (fs.existsSync(whatsappTemplatePath)) {
      let whatsappContent = fs.readFileSync(whatsappTemplatePath, 'utf8');
      
      // Substituir placeholders
      whatsappContent = whatsappContent.replace(/\[NOME_IGREJA\]/g, churchName);
      whatsappContent = whatsappContent.replace(/\[NOME_APP\]/g, `${churchName} App`);
      whatsappContent = whatsappContent.replace(/\[TELEFONE_CONTATO\]/g, churchPhone);
      
      // Salvar versão personalizada
      const outputWhatsappPath = path.join(outputDir, 'whatsapp-texto.txt');
      fs.writeFileSync(outputWhatsappPath, whatsappContent);
      console.log(`✅ Texto para WhatsApp personalizado salvo em ${outputWhatsappPath}`);
    }
    
    console.log('✅ Materiais de marketing personalizados com sucesso!');
    console.log('');
    console.log('🖼️ Para gerar mockups do aplicativo:');
    console.log('   > node marketing/generate-mockups.js');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro ao personalizar materiais de marketing:', error);
  }
}

// Função para exibir ajuda
function displayHelp() {
  console.log('📋 Uso: node personalize.js [options]');
  console.log('');
  console.log('Opções:');
  console.log('  --marketing    Também gera materiais de marketing personalizados');
  console.log('  --help         Exibe esta ajuda');
  console.log('');
  console.log('Exemplos:');
  console.log('  node personalize.js                # Personalização básica');
  console.log('  node personalize.js --marketing    # Personalização com materiais de marketing');
}

// Executar função principal
personalize(); 