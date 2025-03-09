import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Modal,
  StatusBar,
  Share
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Chip, Divider, Button, Menu } from 'react-native-paper';

const livros = [
  // Antigo Testamento
  { id: 'gn', nome: 'Gênesis', abreviacao: 'Gn', testamento: 'AT', capitulos: 50 },
  { id: 'ex', nome: 'Êxodo', abreviacao: 'Ex', testamento: 'AT', capitulos: 40 },
  { id: 'lv', nome: 'Levítico', abreviacao: 'Lv', testamento: 'AT', capitulos: 27 },
  { id: 'nm', nome: 'Números', abreviacao: 'Nm', testamento: 'AT', capitulos: 36 },
  { id: 'dt', nome: 'Deuteronômio', abreviacao: 'Dt', testamento: 'AT', capitulos: 34 },
  { id: 'js', nome: 'Josué', abreviacao: 'Js', testamento: 'AT', capitulos: 24 },
  { id: 'jz', nome: 'Juízes', abreviacao: 'Jz', testamento: 'AT', capitulos: 21 },
  { id: 'rt', nome: 'Rute', abreviacao: 'Rt', testamento: 'AT', capitulos: 4 },
  { id: '1sm', nome: '1 Samuel', abreviacao: '1Sm', testamento: 'AT', capitulos: 31 },
  { id: '2sm', nome: '2 Samuel', abreviacao: '2Sm', testamento: 'AT', capitulos: 24 },
  { id: '1rs', nome: '1 Reis', abreviacao: '1Rs', testamento: 'AT', capitulos: 22 },
  { id: '2rs', nome: '2 Reis', abreviacao: '2Rs', testamento: 'AT', capitulos: 25 },
  { id: '1cr', nome: '1 Crônicas', abreviacao: '1Cr', testamento: 'AT', capitulos: 29 },
  { id: '2cr', nome: '2 Crônicas', abreviacao: '2Cr', testamento: 'AT', capitulos: 36 },
  { id: 'ed', nome: 'Esdras', abreviacao: 'Ed', testamento: 'AT', capitulos: 10 },
  { id: 'ne', nome: 'Neemias', abreviacao: 'Ne', testamento: 'AT', capitulos: 13 },
  { id: 'et', nome: 'Ester', abreviacao: 'Et', testamento: 'AT', capitulos: 10 },
  { id: 'jó', nome: 'Jó', abreviacao: 'Jó', testamento: 'AT', capitulos: 42 },
  { id: 'sl', nome: 'Salmos', abreviacao: 'Sl', testamento: 'AT', capitulos: 150 },
  { id: 'pv', nome: 'Provérbios', abreviacao: 'Pv', testamento: 'AT', capitulos: 31 },
  { id: 'ec', nome: 'Eclesiastes', abreviacao: 'Ec', testamento: 'AT', capitulos: 12 },
  { id: 'ct', nome: 'Cânticos', abreviacao: 'Ct', testamento: 'AT', capitulos: 8 },
  { id: 'is', nome: 'Isaías', abreviacao: 'Is', testamento: 'AT', capitulos: 66 },
  { id: 'jr', nome: 'Jeremias', abreviacao: 'Jr', testamento: 'AT', capitulos: 52 },
  { id: 'lm', nome: 'Lamentações', abreviacao: 'Lm', testamento: 'AT', capitulos: 5 },
  { id: 'ez', nome: 'Ezequiel', abreviacao: 'Ez', testamento: 'AT', capitulos: 48 },
  { id: 'dn', nome: 'Daniel', abreviacao: 'Dn', testamento: 'AT', capitulos: 12 },
  { id: 'os', nome: 'Oséias', abreviacao: 'Os', testamento: 'AT', capitulos: 14 },
  { id: 'jl', nome: 'Joel', abreviacao: 'Jl', testamento: 'AT', capitulos: 3 },
  { id: 'am', nome: 'Amós', abreviacao: 'Am', testamento: 'AT', capitulos: 9 },
  { id: 'ob', nome: 'Obadias', abreviacao: 'Ob', testamento: 'AT', capitulos: 1 },
  { id: 'jn', nome: 'Jonas', abreviacao: 'Jn', testamento: 'AT', capitulos: 4 },
  { id: 'mq', nome: 'Miquéias', abreviacao: 'Mq', testamento: 'AT', capitulos: 7 },
  { id: 'na', nome: 'Naum', abreviacao: 'Na', testamento: 'AT', capitulos: 3 },
  { id: 'hc', nome: 'Habacuque', abreviacao: 'Hc', testamento: 'AT', capitulos: 3 },
  { id: 'sf', nome: 'Sofonias', abreviacao: 'Sf', testamento: 'AT', capitulos: 3 },
  { id: 'ag', nome: 'Ageu', abreviacao: 'Ag', testamento: 'AT', capitulos: 2 },
  { id: 'zc', nome: 'Zacarias', abreviacao: 'Zc', testamento: 'AT', capitulos: 14 },
  { id: 'ml', nome: 'Malaquias', abreviacao: 'Ml', testamento: 'AT', capitulos: 4 },
  
  // Novo Testamento
  { id: 'mt', nome: 'Mateus', abreviacao: 'Mt', testamento: 'NT', capitulos: 28 },
  { id: 'mc', nome: 'Marcos', abreviacao: 'Mc', testamento: 'NT', capitulos: 16 },
  { id: 'lc', nome: 'Lucas', abreviacao: 'Lc', testamento: 'NT', capitulos: 24 },
  { id: 'jo', nome: 'João', abreviacao: 'Jo', testamento: 'NT', capitulos: 21 },
  { id: 'at', nome: 'Atos', abreviacao: 'At', testamento: 'NT', capitulos: 28 },
  { id: 'rm', nome: 'Romanos', abreviacao: 'Rm', testamento: 'NT', capitulos: 16 },
  { id: '1co', nome: '1 Coríntios', abreviacao: '1Co', testamento: 'NT', capitulos: 16 },
  { id: '2co', nome: '2 Coríntios', abreviacao: '2Co', testamento: 'NT', capitulos: 13 },
  { id: 'gl', nome: 'Gálatas', abreviacao: 'Gl', testamento: 'NT', capitulos: 6 },
  { id: 'ef', nome: 'Efésios', abreviacao: 'Ef', testamento: 'NT', capitulos: 6 },
  { id: 'fp', nome: 'Filipenses', abreviacao: 'Fp', testamento: 'NT', capitulos: 4 },
  { id: 'cl', nome: 'Colossenses', abreviacao: 'Cl', testamento: 'NT', capitulos: 4 },
  { id: '1ts', nome: '1 Tessalonicenses', abreviacao: '1Ts', testamento: 'NT', capitulos: 5 },
  { id: '2ts', nome: '2 Tessalonicenses', abreviacao: '2Ts', testamento: 'NT', capitulos: 3 },
  { id: '1tm', nome: '1 Timóteo', abreviacao: '1Tm', testamento: 'NT', capitulos: 6 },
  { id: '2tm', nome: '2 Timóteo', abreviacao: '2Tm', testamento: 'NT', capitulos: 4 },
  { id: 'tt', nome: 'Tito', abreviacao: 'Tt', testamento: 'NT', capitulos: 3 },
  { id: 'fm', nome: 'Filemom', abreviacao: 'Fm', testamento: 'NT', capitulos: 1 },
  { id: 'hb', nome: 'Hebreus', abreviacao: 'Hb', testamento: 'NT', capitulos: 13 },
  { id: 'tg', nome: 'Tiago', abreviacao: 'Tg', testamento: 'NT', capitulos: 5 },
  { id: '1pe', nome: '1 Pedro', abreviacao: '1Pe', testamento: 'NT', capitulos: 5 },
  { id: '2pe', nome: '2 Pedro', abreviacao: '2Pe', testamento: 'NT', capitulos: 3 },
  { id: '1jo', nome: '1 João', abreviacao: '1Jo', testamento: 'NT', capitulos: 5 },
  { id: '2jo', nome: '2 João', abreviacao: '2Jo', testamento: 'NT', capitulos: 1 },
  { id: '3jo', nome: '3 João', abreviacao: '3Jo', testamento: 'NT', capitulos: 1 },
  { id: 'jd', nome: 'Judas', abreviacao: 'Jd', testamento: 'NT', capitulos: 1 },
  { id: 'ap', nome: 'Apocalipse', abreviacao: 'Ap', testamento: 'NT', capitulos: 22 },
];

const BibliaScreen = () => {
  const [selectedTestamento, setSelectedTestamento] = useState('AT');
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [capituloSelecionado, setCapituloSelecionado] = useState(1);
  const [versiculoSelecionado, setVersiculoSelecionado] = useState(null);
  const [conteudoCapitulo, setConteudoCapitulo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [opcaoVisualizacao, setOpcaoVisualizacao] = useState('ARC'); // Almeida Revista e Corrigida, NVI, etc.
  const [tamanhoFonte, setTamanhoFonte] = useState('normal');

  useEffect(() => {
    if (livroSelecionado && capituloSelecionado) {
      carregarCapitulo();
    }
  }, [livroSelecionado, capituloSelecionado, opcaoVisualizacao]);

  const carregarCapitulo = async () => {
    setLoading(true);
    
    try {
      // Em um app real, você usaria uma API de Bíblia como Bible.org, ou carregaria de um banco de dados local
      // Aqui vamos simular com dados de exemplo para fins de demonstração
      const versosFicticios = [];
      const quantidadeVersos = Math.floor(Math.random() * 30) + 10; // Entre 10 e 40 versos
      
      for (let i = 1; i <= quantidadeVersos; i++) {
        versosFicticios.push({
          numero: i,
          texto: `Este é um exemplo de texto para o ${livroSelecionado.nome} ${capituloSelecionado}:${i}.`
        });
      }
      
      setTimeout(() => {
        setConteudoCapitulo(versosFicticios);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Erro ao carregar capítulo:', error);
      setLoading(false);
    }
  };

  const selecionarLivro = (livro) => {
    setLivroSelecionado(livro);
    setCapituloSelecionado(1);
    setVersiculoSelecionado(null);
    setModalVisible(false);
  };

  const selecionarCapitulo = (capitulo) => {
    setCapituloSelecionado(capitulo);
    setVersiculoSelecionado(null);
  };

  const proximoCapitulo = () => {
    if (capituloSelecionado < livroSelecionado.capitulos) {
      setCapituloSelecionado(capituloSelecionado + 1);
    } else {
      // Se estiver no último capítulo do livro, passe para o próximo livro
      const indexAtual = livros.findIndex(l => l.id === livroSelecionado.id);
      if (indexAtual < livros.length - 1) {
        setLivroSelecionado(livros[indexAtual + 1]);
        setCapituloSelecionado(1);
      }
    }
  };

  const capituloAnterior = () => {
    if (capituloSelecionado > 1) {
      setCapituloSelecionado(capituloSelecionado - 1);
    } else {
      // Se estiver no primeiro capítulo do livro, passe para o livro anterior
      const indexAtual = livros.findIndex(l => l.id === livroSelecionado.id);
      if (indexAtual > 0) {
        setLivroSelecionado(livros[indexAtual - 1]);
        setCapituloSelecionado(livros[indexAtual - 1].capitulos);
      }
    }
  };

  const compartilhar = async () => {
    if (!livroSelecionado) return;
    
    try {
      let textoCompartilhamento = '';
      
      if (versiculoSelecionado) {
        const versiculo = conteudoCapitulo.find(v => v.numero === versiculoSelecionado);
        if (versiculo) {
          textoCompartilhamento = `${versiculo.texto} (${livroSelecionado.nome} ${capituloSelecionado}:${versiculoSelecionado})`;
        }
      } else {
        textoCompartilhamento = `${livroSelecionado.nome} ${capituloSelecionado}`;
        const versiculos = conteudoCapitulo.map(v => `${v.numero}. ${v.texto}`).join('\n');
        textoCompartilhamento += `\n\n${versiculos}`;
      }
      
      await Share.share({
        message: textoCompartilhamento,
        title: `${livroSelecionado.nome} ${capituloSelecionado}${versiculoSelecionado ? `:${versiculoSelecionado}` : ''}`
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleVersiculoPress = (numero) => {
    setVersiculoSelecionado(versiculoSelecionado === numero ? null : numero);
  };

  const filtrarLivros = () => {
    if (!pesquisa) {
      return livros.filter(livro => livro.testamento === selectedTestamento);
    }
    
    const termoPesquisa = pesquisa.toLowerCase();
    return livros.filter(livro => 
      livro.testamento === selectedTestamento && 
      (livro.nome.toLowerCase().includes(termoPesquisa) || 
       livro.abreviacao.toLowerCase().includes(termoPesquisa))
    );
  };

  const renderItem = ({ item: versiculo }) => (
    <TouchableOpacity 
      style={[
        styles.versiculoContainer,
        versiculoSelecionado === versiculo.numero && styles.versiculoSelecionado
      ]} 
      onPress={() => handleVersiculoPress(versiculo.numero)}
    >
      <Text style={styles.versiculoNumero}>{versiculo.numero}</Text>
      <Text style={[
        styles.versiculoTexto, 
        tamanhoFonte === 'pequeno' && { fontSize: 14 },
        tamanhoFonte === 'grande' && { fontSize: 18 },
        versiculoSelecionado === versiculo.numero && styles.versiculoTextoSelecionado
      ]}>
        {versiculo.texto}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3f51b5" barStyle="light-content" />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.livroSelecionadoContainer}>
          <TouchableOpacity 
            style={styles.seletorLivro} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.livroSelecionadoTexto}>
              {livroSelecionado ? livroSelecionado.nome : 'Selecione um livro'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="white" />
          </TouchableOpacity>
          
          {livroSelecionado && (
            <View style={styles.seletorCapitulo}>
              <TouchableOpacity
                onPress={capituloAnterior}
                disabled={capituloSelecionado === 1 && livros.findIndex(l => l.id === livroSelecionado.id) === 0}
              >
                <MaterialIcons name="chevron-left" size={24} color="white" />
              </TouchableOpacity>
              
              <Text style={styles.capituloSelecionadoTexto}>
                {capituloSelecionado}
              </Text>
              
              <TouchableOpacity
                onPress={proximoCapitulo}
                disabled={
                  capituloSelecionado === livroSelecionado.capitulos && 
                  livros.findIndex(l => l.id === livroSelecionado.id) === livros.length - 1
                }
              >
                <MaterialIcons name="chevron-right" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Menu de opções */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{x: 0, y: 0}}
        style={styles.menu}
      >
        <Menu.Item 
          onPress={() => {
            setOpcaoVisualizacao('ARC');
            setMenuVisible(false);
          }} 
          title="Almeida Revista e Corrigida" 
          leadingIcon="book"
        />
        <Menu.Item 
          onPress={() => {
            setOpcaoVisualizacao('NVI');
            setMenuVisible(false);
          }} 
          title="Nova Versão Internacional" 
          leadingIcon="book"
        />
        <Divider />
        <Menu.Item 
          onPress={() => {
            setTamanhoFonte('pequeno');
            setMenuVisible(false);
          }} 
          title="Texto Pequeno" 
          leadingIcon="format-size"
        />
        <Menu.Item 
          onPress={() => {
            setTamanhoFonte('normal');
            setMenuVisible(false);
          }} 
          title="Texto Médio" 
          leadingIcon="format-size"
        />
        <Menu.Item 
          onPress={() => {
            setTamanhoFonte('grande');
            setMenuVisible(false);
          }} 
          title="Texto Grande" 
          leadingIcon="format-size"
        />
        <Divider />
        <Menu.Item 
          onPress={compartilhar} 
          title="Compartilhar" 
          leadingIcon="share"
          disabled={!livroSelecionado}
        />
      </Menu>
      
      {/* Conteúdo */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f51b5" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : livroSelecionado ? (
        <FlatList
          data={conteudoCapitulo}
          renderItem={renderItem}
          keyExtractor={(item) => item.numero.toString()}
          contentContainerStyle={styles.conteudoContainer}
        />
      ) : (
        <View style={styles.instrucaoContainer}>
          <Ionicons name="book-outline" size={80} color="#3f51b5" />
          <Text style={styles.instrucaoTexto}>
            Selecione um livro para começar a leitura
          </Text>
        </View>
      )}
      
      {/* Botões de navegação rápida entre capítulos */}
      {livroSelecionado && (
        <View style={styles.botoesNavegacao}>
          <TouchableOpacity
            style={styles.botaoNavegacao}
            onPress={capituloAnterior}
            disabled={capituloSelecionado === 1 && livros.findIndex(l => l.id === livroSelecionado.id) === 0}
          >
            <Ionicons 
              name="chevron-back-circle" 
              size={36} 
              color={
                capituloSelecionado === 1 && livros.findIndex(l => l.id === livroSelecionado.id) === 0 
                  ? '#ccc' 
                  : '#3f51b5'
              } 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoCompartilhar}
            onPress={compartilhar}
          >
            <Ionicons name="share-social" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoNavegacao}
            onPress={proximoCapitulo}
            disabled={
              capituloSelecionado === livroSelecionado.capitulos && 
              livros.findIndex(l => l.id === livroSelecionado.id) === livros.length - 1
            }
          >
            <Ionicons 
              name="chevron-forward-circle" 
              size={36} 
              color={
                capituloSelecionado === livroSelecionado.capitulos && 
                livros.findIndex(l => l.id === livroSelecionado.id) === livros.length - 1
                  ? '#ccc' 
                  : '#3f51b5'
              } 
            />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Modal para seleção de livro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione um Livro</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.pesquisaContainer}>
              <TextInput
                style={styles.pesquisaInput}
                placeholder="Buscar livro..."
                value={pesquisa}
                onChangeText={setPesquisa}
              />
            </View>
            
            <View style={styles.testamentoSeletor}>
              <TouchableOpacity
                style={[
                  styles.testamentoOpcao,
                  selectedTestamento === 'AT' && styles.testamentoOpcaoSelecionada
                ]}
                onPress={() => setSelectedTestamento('AT')}
              >
                <Text 
                  style={[
                    styles.testamentoOpcaoTexto,
                    selectedTestamento === 'AT' && styles.testamentoOpcaoTextoSelecionado
                  ]}
                >
                  Antigo Testamento
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.testamentoOpcao,
                  selectedTestamento === 'NT' && styles.testamentoOpcaoSelecionada
                ]}
                onPress={() => setSelectedTestamento('NT')}
              >
                <Text 
                  style={[
                    styles.testamentoOpcaoTexto,
                    selectedTestamento === 'NT' && styles.testamentoOpcaoTextoSelecionado
                  ]}
                >
                  Novo Testamento
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={filtrarLivros()}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listaLivros}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.livroItem}
                  onPress={() => selecionarLivro(item)}
                >
                  <Text style={styles.livroNome}>{item.nome}</Text>
                  <Text style={styles.livroAbreviacao}>({item.abreviacao})</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {/* Modal para seleção de capítulo */}
      {livroSelecionado && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={false} // Esta modal será mostrada quando necessário
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecione um Capítulo</Text>
                <TouchableOpacity>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.capitulosContainer}>
                {Array.from({ length: livroSelecionado.capitulos }, (_, i) => i + 1).map((cap) => (
                  <TouchableOpacity
                    key={cap}
                    style={[
                      styles.capituloItem,
                      capituloSelecionado === cap && styles.capituloItemSelecionado
                    ]}
                    onPress={() => selecionarCapitulo(cap)}
                  >
                    <Text 
                      style={[
                        styles.capituloNumero,
                        capituloSelecionado === cap && styles.capituloNumeroSelecionado
                      ]}
                    >
                      {cap}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3f51b5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  livroSelecionadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seletorLivro: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  livroSelecionadoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  seletorCapitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  capituloSelecionadoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 5,
  },
  menu: {
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  conteudoContainer: {
    padding: 15,
    paddingBottom: 70,
  },
  versiculoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  versiculoSelecionado: {
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
  },
  versiculoNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginRight: 8,
    width: 25,
  },
  versiculoTexto: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  versiculoTextoSelecionado: {
    fontWeight: 'bold',
  },
  instrucaoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instrucaoTexto: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  botoesNavegacao: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  botaoNavegacao: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoCompartilhar: {
    backgroundColor: '#3f51b5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pesquisaContainer: {
    padding: 15,
    paddingTop: 0,
  },
  pesquisaInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
  },
  testamentoSeletor: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  testamentoOpcao: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  testamentoOpcaoSelecionada: {
    borderBottomWidth: 2,
    borderBottomColor: '#3f51b5',
  },
  testamentoOpcaoTexto: {
    fontSize: 16,
    color: '#666',
  },
  testamentoOpcaoTextoSelecionado: {
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  listaLivros: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  livroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  livroNome: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  livroAbreviacao: {
    fontSize: 14,
    color: '#999',
    marginLeft: 10,
  },
  capitulosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  capituloItem: {
    width: '14.28%', // 7 colunas
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  capituloItemSelecionado: {
    backgroundColor: '#3f51b5',
    borderRadius: 25,
  },
  capituloNumero: {
    fontSize: 16,
    color: '#333',
  },
  capituloNumeroSelecionado: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BibliaScreen; 