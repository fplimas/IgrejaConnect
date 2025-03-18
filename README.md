# Igreja Connect - Aplicativo para Gerenciamento de Igrejas

## 📱 Sobre

O **Igreja Connect** é um aplicativo móvel desenvolvido em React Native para ajudar igrejas a conectar-se com seus membros e gerenciar suas atividades. O aplicativo oferece funcionalidades como cadastro de membros, notificações de eventos e cultos, pedidos de oração, doações e acesso à Bíblia.

## 🚀 Principais Funcionalidades

- **Autenticação de Usuários**: Cadastro, login e recuperação de senha.
- **Feed Principal**: Exibe próximos eventos, anúncios e versículo do dia.
- **Eventos**: Calendário detalhado de eventos da igreja, com confirmação de presença.
- **Bíblia Online**: Acesso à Bíblia completa para leitura e compartilhamento.
- **Pedidos de Oração**: Membros podem solicitar e acompanhar pedidos de oração.
- **Doações**: Facilita contribuições financeiras à igreja.
- **Perfil de Usuário**: Gerenciamento de informações pessoais e histórico de participação.
- **Notificações Push**: Alertas sobre novos eventos, pedidos de oração e comunicados importantes.
- **Integração com Redes Sociais**: Conexão com plataformas sociais da igreja.
- **Botão Flutuante para WhatsApp**: Comunicação rápida com a equipe pastoral.

## 🔄 Opções de Distribuição

O Igreja Connect oferece duas modalidades de entrega para atender às necessidades específicas de cada igreja:

### 1️⃣ Código-fonte Completo

Ideal para igrejas que possuem equipe técnica ou desejam personalizações profundas.

**O que está incluído:**
- Repositório completo do código-fonte
- Documentação detalhada de instalação e configuração
- Guia de personalização de design e funcionalidades
- Script de automação para personalização facilitada

**Vantagens:**
- Personalização completa e ilimitada
- Independência de serviços de terceiros
- Possibilidade de adicionar novas funcionalidades exclusivas
- Controle total sobre o banco de dados e hospedagem

### 2️⃣ Aplicativo Pronto para Uso

Solução imediata para igrejas que preferem praticidade sem complicações técnicas.

**O que está incluído:**
- APK para Android pronto para instalação
- Distribuição iOS via TestFlight (sujeito a aprovação na App Store)
- Versão PWA (Progressive Web App) acessível por URL
- Painel administrativo web para gerenciamento de conteúdo

**Vantagens:**
- Implementação imediata sem conhecimento técnico
- Atualizações e manutenções realizadas automaticamente
- Suporte técnico e orientação de uso
- Infraestrutura já configurada e pronta para uso

## 📋 Requisitos

### Para o Código-fonte:
- Node.js 14.x ou superior
- Expo CLI
- Conta Firebase
- iOS 12.0+ / Android 6.0+

### Para o App Pronto:
- Android 6.0+ ou iOS 12.0+
- Navegador moderno (para versão PWA)
- Conexão com Internet

## ⚙️ Guia de Personalização (Código-fonte)

### 1. Instalação Básica

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/igreja-connect.git
cd igreja-connect

# Instalar dependências
npm install

# Configurar Firebase
cp src/services/firebaseConfig.example.js src/services/firebaseConfig.js
# Edite o arquivo firebaseConfig.js com suas credenciais
```

### 2. Personalização do Tema e Assets

1. **Edite o arquivo de tema:**
   - Abra `src/utils/theme.js`
   - Modifique cores, nome da igreja, dados de contato e outras configurações

2. **Substituição de imagens e logos:**
   - Coloque suas imagens na pasta `custom-assets/images/`
   - Coloque suas fontes personalizadas na pasta `custom-assets/fonts/`
   - Execute o script de personalização:
   ```bash
   node personalize.js
   ```

3. **Configuração do Firebase:**
   - Crie um projeto no [Console do Firebase](https://console.firebase.google.com/)
   - Ative Authentication, Firestore e Storage
   - Copie as credenciais para `src/services/firebaseConfig.js`

### 3. Testando e Construindo

```bash
# Teste o aplicativo
expo start

# Construa para Android
expo build:android

# Construa para iOS
expo build:ios
```

## 🔧 Painel Administrativo (App Pronto)

Para a versão pronta para uso, você receberá acesso ao painel administrativo web:

1. Acesse: [admin.igrejaconnect.com.br](https://admin.igrejaconnect.com.br)
2. Faça login com as credenciais fornecidas
3. Configure as informações da sua igreja:
   - Nome, logo e cores
   - Informações de contato
   - Redes sociais
   - Horários de culto
4. Gerencie conteúdo:
   - Eventos
   - Anúncios
   - Pedidos de oração
   - Campanhas de doação
5. Acompanhe estatísticas de uso e engajamento

## 📸 Material de Marketing e Divulgação

Para ajudar na divulgação e promoção do seu aplicativo personalizado, o Igreja Connect inclui recursos de marketing:

### Criação de Mockups e Visualizações

Execute o script de geração de mockups para criar imagens profissionais do aplicativo:

```bash
# Instalar dependências para geração de mockups
npm install -g app-mockup-generator

# Gerar mockups a partir do aplicativo em execução
expo start --no-dev --minify
app-mockup --screens-dir ./marketing/screens --output-dir ./marketing/mockups
```

### Telas para Screenshots

Capture as seguintes telas para uso em lojas de aplicativos e material promocional:

1. **Tela de Login/Boas-vindas**
2. **Feed principal (Home)**
3. **Tela da Bíblia**
4. **Lista de Eventos**
5. **Detalhe de Evento**
6. **Tela de Doação**

### Formatos Recomendados

- **Google Play Store**: 1080 x 1920px (16:9)
- **Apple App Store**: 1242 x 2688px, 1125 x 2436px e 1242 x 2208px
- **Banners para site**: 1200 x 630px
- **Post Instagram**: 1080 x 1080px
- **Stories**: 1080 x 1920px

### Templates de Divulgação

Na pasta `/marketing/templates` você encontrará:

- **Modelo de e-mail** para divulgação
- **Posts para redes sociais**
- **Texto para WhatsApp**
- **QR Code personalizado** para download

### Vídeo Demonstrativo

Roteiro para criação de vídeo promocional:

1. **Introdução** (5-10s): Logo da igreja e nome do aplicativo
2. **Problema** (5-10s): Dificuldade em se manter conectado com a igreja
3. **Solução** (20-30s): Demonstração das principais funcionalidades
4. **Call to Action** (5s): Como baixar/instalar

## 🏗️ Estrutura do Projeto

```
igreja-connect/
├── src/
│   ├── assets/            # Imagens, fontes e outros recursos estáticos
│   ├── components/        # Componentes reutilizáveis
│   ├── contexts/          # Contextos para gerenciamento de estado
│   ├── hooks/             # Hooks personalizados
│   ├── navigation/        # Configuração de navegação
│   ├── screens/           # Telas do aplicativo
│   │   ├── auth/          # Telas de autenticação
│   │   └── main/          # Telas principais do app
│   ├── services/          # Serviços externos (Firebase, APIs)
│   └── utils/             # Utilitários e funções auxiliares
├── custom-assets/         # Pasta para assets personalizados
├── marketing/             # Recursos para marketing e divulgação
├── App.js                 # Ponto de entrada do aplicativo
├── personalize.js         # Script de personalização
└── package.json           # Dependências do projeto
```

## 📝 Atributos da API do Firebase

### Coleções no Firestore:

1. **users**
   - `uid`: string - ID do usuário no Firebase Auth
   - `displayName`: string - Nome completo
   - `email`: string - Email
   - `telefone`: string - Número de telefone
   - `endereco`: string - Endereço
   - `role`: string - Papel do usuário (membro, admin, pastor)
   - `photoURL`: string (opcional) - URL da foto de perfil
   - `pushToken`: string (opcional) - Token para notificações
   - `eventosInscritos`: array - IDs dos eventos que o usuário confirmou presença
   - `createdAt`: timestamp - Data de criação
   - `updatedAt`: timestamp - Data de atualização

2. **eventos**
   - `titulo`: string - Título do evento
   - `descricao`: string - Descrição detalhada
   - `data`: timestamp - Data do evento
   - `horarioInicio`: string - Horário de início (formato HH:MM)
   - `horarioFim`: string - Horário de término (formato HH:MM)
   - `local`: string - Nome do local
   - `endereco`: string - Endereço completo
   - `categoria`: string - Categoria do evento (culto, estudo, jovens, etc.)
   - `imagemURL`: string (opcional) - URL da imagem ilustrativa
   - `participantes`: number - Contador de participantes
   - `listaParticipantes`: array - UIDs dos participantes confirmados
   - `createdBy`: string - UID do criador do evento
   - `createdAt`: timestamp - Data de criação

3. **anuncios**
   - `titulo`: string - Título do anúncio
   - `conteudo`: string - Conteúdo do anúncio
   - `imagemURL`: string (opcional) - URL da imagem
   - `dataPublicacao`: timestamp - Data de publicação
   - `autor`: string - UID do autor
   - `destaque`: boolean - Se deve ser destacado

4. **oracoes**
   - `titulo`: string - Título do pedido
   - `descricao`: string - Descrição detalhada
   - `autor`: string - UID do autor
   - `publico`: boolean - Se é visível para todos
   - `intercessores`: array - UIDs dos que estão orando
   - `respondido`: boolean - Se foi respondido
   - `createdAt`: timestamp - Data de criação

5. **doacoes**
   - `titulo`: string - Título/propósito da campanha
   - `descricao`: string - Descrição detalhada
   - `meta`: number - Valor alvo (opcional)
   - `arrecadado`: number - Valor já arrecadado
   - `dataInicio`: timestamp - Data de início
   - `dataFim`: timestamp - Data de término
   - `ativo`: boolean - Se está ativa

## 📞 Suporte

- **Suporte para Código-fonte:** [suporte@igrejaconnect.com.br](mailto:suporte@igrejaconnect.com.br)
- **Suporte para App Pronto:** [app@igrejaconnect.com.br](mailto:app@igrejaconnect.com.br) ou via chat no painel administrativo
- **Dúvidas Gerais:** [contato@igrejaconnect.com.br](mailto:contato@igrejaconnect.com.br)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedores

- Filipe Fernando - [GitHub](https://github.com/fplimas)

---

⭐ Se gostou do projeto, não se esqueça de dar uma estrela no repositório! 
