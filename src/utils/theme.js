/**
 * Arquivo de configuração de tema e personalização do aplicativo
 * PERSONALIZE ESTE ARQUIVO para adaptar o aplicativo à identidade da sua igreja
 */

const theme = {
  // Cores principais do aplicativo
  colors: {
    primary: '#3f51b5',       // Cor principal da igreja
    secondary: '#FF5722',     // Cor secundária/destaque
    background: '#f5f5f5',    // Cor de fundo da aplicação
    text: '#333333',          // Cor principal dos textos
    textLight: '#666666',     // Cor de textos secundários
    textInverted: '#ffffff',  // Cor de texto sobre fundos escuros
    error: '#f44336',         // Cor para mensagens de erro
    success: '#4CAF50',       // Cor para mensagens de sucesso
    warning: '#FFC107',       // Cor para alertas
    info: '#2196F3',          // Cor para informações
  },
  
  // Informações da Igreja
  church: {
    name: 'Igreja Connect',   // Nome da sua igreja
    slogan: 'Conectando vidas, fortalecendo a fé',
    address: 'Rua das Flores, 123 - Centro',
    city: 'Sua Cidade - UF',
    phone: '(00) 00000-0000',
    email: 'contato@igrejconnect.com.br',
    website: 'www.igrejaconnect.com.br',
    
    // Número do WhatsApp para o botão flutuante (inclua código do país)
    whatsappNumber: '5500000000000',
    
    // Links para redes sociais
    socialMedia: {
      facebook: 'https://www.facebook.com/suaigreja',
      instagram: 'https://www.instagram.com/suaigreja',
      youtube: 'https://www.youtube.com/channel/suaigreja',
      twitter: null, // Defina como null se não utilizar
    },
    
    // Horários dos cultos regulares (aparecerão na tela inicial)
    services: [
      { day: 'Domingo', time: '10:00', name: 'Culto da Manhã' },
      { day: 'Domingo', time: '19:00', name: 'Culto da Noite' },
      { day: 'Quarta-feira', time: '19:30', name: 'Culto de Oração' },
    ],
    
    // Ministérios da igreja (para categorização de eventos)
    ministries: [
      { id: 'culto', name: 'Cultos', icon: 'church' },
      { id: 'jovens', name: 'Jovens', icon: 'account-group' },
      { id: 'criancas', name: 'Crianças', icon: 'baby' },
      { id: 'mulheres', name: 'Mulheres', icon: 'human-female' },
      { id: 'homens', name: 'Homens', icon: 'human-male' },
      { id: 'louvor', name: 'Louvor', icon: 'music' },
      { id: 'ensino', name: 'Ensino', icon: 'book-open-variant' },
      { id: 'acao_social', name: 'Ação Social', icon: 'hand-heart' },
    ]
  },
  
  // Configurações do aplicativo
  app: {
    enableBible: true,          // Habilitar módulo da Bíblia
    enableDonations: true,      // Habilitar módulo de doações
    enablePrayerRequests: true, // Habilitar módulo de pedidos de oração
    showFloatingWhatsApp: true, // Mostrar botão flutuante de WhatsApp
    whatsAppButtonStyle: 'circular', // Opções: 'circular', 'pill', 'card'
    whatsAppButtonPosition: 'bottom-right', // Opções: 'bottom-right', 'bottom-left', 'bottom-center'
    defaultBibleVersion: 'ARC', // Versão padrão da Bíblia (ARC, NVI, etc)
    defaultBibleBook: 'sl',     // Livro padrão ao abrir a Bíblia
    defaultBibleChapter: 23,    // Capítulo padrão ao abrir a Bíblia
  },
  
  // Configurações de estilo
  typography: {
    fontFamily: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
    },
    fontSize: {
      small: 12,
      regular: 14,
      medium: 16,
      large: 18,
      xlarge: 24,
      xxlarge: 32,
    }
  },
  
  // Configurações de UI/UX
  ui: {
    roundness: 8,              // Arredondamento de elementos (botões, cards, etc)
    elevation: 4,              // Elevação padrão para elementos como cards
    buttonHeight: 48,          // Altura padrão dos botões
    iconSize: {
      small: 18,
      medium: 24,
      large: 32,
    },
  }
};

export default theme; 