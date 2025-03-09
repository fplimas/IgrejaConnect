import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { Searchbar, Chip, Button, FAB } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, query, orderBy, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const EventosScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('todos'); // 'todos', 'proximos', 'passados'
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const categorias = [
    { id: 'culto', nome: 'Cultos', icone: 'church' },
    { id: 'estudo', nome: 'Estudos', icone: 'book-open' },
    { id: 'jovens', nome: 'Jovens', icone: 'account-group' },
    { id: 'criancas', nome: 'Crianças', icone: 'baby' },
    { id: 'mulheres', nome: 'Mulheres', icone: 'human-female' },
    { id: 'homens', nome: 'Homens', icone: 'human-male' },
    { id: 'casais', nome: 'Casais', icone: 'heart' },
    { id: 'acao_social', nome: 'Ação Social', icone: 'hand-heart' },
  ];

  useEffect(() => {
    fetchEventos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [eventos, search, filtroAtivo, categoriaSelecionada]);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const eventosRef = collection(db, 'eventos');
      const q = query(eventosRef, orderBy('data', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const eventosData = [];
      querySnapshot.forEach((doc) => {
        eventosData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      // Se não houver eventos no Firestore, usar dados de exemplo para demonstração
      if (eventosData.length === 0) {
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);
        const proximaSemana = new Date(hoje);
        proximaSemana.setDate(hoje.getDate() + 7);
        const mesPassado = new Date(hoje);
        mesPassado.setMonth(hoje.getMonth() - 1);
        
        const eventosFicticios = [
          {
            id: '1',
            titulo: 'Culto de Celebração',
            descricao: 'Culto dominical de celebração com toda a igreja reunida para louvar a Deus.',
            data: proximaSemana,
            horarioInicio: '19:00',
            horarioFim: '21:00',
            local: 'Templo Principal',
            endereco: 'Rua das Flores, 123',
            categoria: 'culto',
            imagemURL: 'https://example.com/culto.jpg',
            participantes: 0,
          },
          {
            id: '2',
            titulo: 'Estudo Bíblico',
            descricao: 'Estudo bíblico semanal para aprofundamento na Palavra de Deus.',
            data: amanha,
            horarioInicio: '19:30',
            horarioFim: '21:00',
            local: 'Sala de Estudos',
            endereco: 'Rua das Flores, 123',
            categoria: 'estudo',
            imagemURL: 'https://example.com/estudo.jpg',
            participantes: 0,
          },
          {
            id: '3',
            titulo: 'Encontro de Jovens',
            descricao: 'Momento especial para os jovens da igreja com louvor, diversão e comunhão.',
            data: new Date(hoje.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 dias depois
            horarioInicio: '20:00',
            horarioFim: '22:00',
            local: 'Salão de Eventos',
            endereco: 'Rua das Flores, 123',
            categoria: 'jovens',
            imagemURL: 'https://example.com/jovens.jpg',
            participantes: 0,
          },
          {
            id: '4',
            titulo: 'Ação Social',
            descricao: 'Distribuição de alimentos e roupas para famílias carentes da comunidade.',
            data: new Date(hoje.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 dias depois
            horarioInicio: '09:00',
            horarioFim: '12:00',
            local: 'Centro Comunitário',
            endereco: 'Rua das Margaridas, 456',
            categoria: 'acao_social',
            imagemURL: 'https://example.com/acao.jpg',
            participantes: 0,
          },
          {
            id: '5',
            titulo: 'Culto Especial',
            descricao: 'Culto especial de ação de graças pelos 10 anos da igreja.',
            data: mesPassado,
            horarioInicio: '19:00',
            horarioFim: '21:30',
            local: 'Templo Principal',
            endereco: 'Rua das Flores, 123',
            categoria: 'culto',
            imagemURL: 'https://example.com/especial.jpg',
            participantes: 120,
          }
        ];
        
        setEventos(eventosFicticios);
      } else {
        setEventos(eventosData);
      }

    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...eventos];
    
    // Aplicar filtro de busca
    if (search) {
      const searchLower = search.toLowerCase();
      resultado = resultado.filter(
        evento => 
          evento.titulo.toLowerCase().includes(searchLower) ||
          evento.descricao.toLowerCase().includes(searchLower) ||
          evento.local.toLowerCase().includes(searchLower)
      );
    }
    
    // Aplicar filtro de categoria
    if (categoriaSelecionada) {
      resultado = resultado.filter(
        evento => evento.categoria === categoriaSelecionada
      );
    }
    
    // Aplicar filtro de tempo
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (filtroAtivo === 'proximos') {
      resultado = resultado.filter(evento => {
        const dataEvento = evento.data instanceof Date ? evento.data : evento.data.toDate();
        return dataEvento >= hoje;
      });
    } else if (filtroAtivo === 'passados') {
      resultado = resultado.filter(evento => {
        const dataEvento = evento.data instanceof Date ? evento.data : evento.data.toDate();
        return dataEvento < hoje;
      });
    }
    
    // Ordenar por data
    resultado.sort((a, b) => {
      const dataA = a.data instanceof Date ? a.data : a.data.toDate();
      const dataB = b.data instanceof Date ? b.data : b.data.toDate();
      
      if (filtroAtivo === 'passados') {
        return dataB - dataA; // Do mais recente para o mais antigo
      } else {
        return dataA - dataB; // Do mais próximo para o mais distante
      }
    });
    
    setFilteredEventos(resultado);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEventos();
  };

  const formatarData = (data) => {
    if (!data) return '';
    
    const dataObj = data instanceof Date ? data : data.toDate();
    
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return dataObj.toLocaleDateString('pt-BR', options);
  };

  const formatarDiaSemana = (data) => {
    if (!data) return '';
    
    const dataObj = data instanceof Date ? data : data.toDate();
    
    const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    return diasSemana[dataObj.getDay()];
  };

  const renderCategoriaIcon = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    if (!categoria) return 'calendar';
    return categoria.icone;
  };

  const renderItem = ({ item }) => {
    const dataEvento = item.data instanceof Date ? item.data : item.data.toDate();
    const isPassado = dataEvento < new Date();
    
    return (
      <TouchableOpacity
        style={[styles.eventoCard, isPassado && styles.eventoPassado]}
        onPress={() => navigation.navigate('DetalheEvento', { evento: item })}
        activeOpacity={0.7}
      >
        <View style={styles.dataContainer}>
          <Text style={styles.dataDia}>{dataEvento.getDate()}</Text>
          <Text style={styles.dataMes}>{dataEvento.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</Text>
          <Text style={styles.dataSemana}>{formatarDiaSemana(dataEvento)}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.eventoTitulo} numberOfLines={1}>{item.titulo}</Text>
          
          <View style={styles.eventoDetalhes}>
            <View style={styles.detalheItem}>
              <Ionicons name="time-outline" size={14} color="#666" style={styles.detalheIcone} />
              <Text style={styles.detalheTexto}>{item.horarioInicio}</Text>
            </View>
            
            <View style={styles.detalheItem}>
              <Ionicons name="location-outline" size={14} color="#666" style={styles.detalheIcone} />
              <Text style={styles.detalheTexto} numberOfLines={1}>{item.local}</Text>
            </View>
          </View>
          
          <View style={styles.eventoRodape}>
            <View style={styles.categoriaContainer}>
              <MaterialCommunityIcons 
                name={renderCategoriaIcon(item.categoria)} 
                size={14} 
                color="#3f51b5" 
              />
              <Text style={styles.categoriaTexto}>
                {categorias.find(cat => cat.id === item.categoria)?.nome || 'Evento'}
              </Text>
            </View>
            
            {isPassado ? (
              <Text style={styles.eventoEncerrado}>Encerrado</Text>
            ) : (
              <Button 
                mode="text" 
                compact 
                style={styles.botaoParticipacao}
                labelStyle={styles.botaoParticipacaoLabel}
                onPress={() => navigation.navigate('DetalheEvento', { evento: item })}
              >
                Ver mais
              </Button>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const sectionHeader = () => (
    <View style={styles.headerContainer}>
      <Searchbar
        placeholder="Buscar eventos..."
        onChangeText={setSearch}
        value={search}
        style={styles.searchBar}
        iconColor="#666"
      />
      
      <View style={styles.filtrosContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={filtroAtivo === 'todos'}
            onPress={() => setFiltroAtivo('todos')}
            style={styles.filtroChip}
            selectedColor="#3f51b5"
          >
            Todos
          </Chip>
          <Chip
            selected={filtroAtivo === 'proximos'}
            onPress={() => setFiltroAtivo('proximos')}
            style={styles.filtroChip}
            selectedColor="#3f51b5"
          >
            Próximos
          </Chip>
          <Chip
            selected={filtroAtivo === 'passados'}
            onPress={() => setFiltroAtivo('passados')}
            style={styles.filtroChip}
            selectedColor="#3f51b5"
          >
            Passados
          </Chip>
        </ScrollView>
      </View>
      
      <FlatList
        data={categorias}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriasContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoriaItem,
              categoriaSelecionada === item.id && styles.categoriaItemSelecionada
            ]}
            onPress={() => setCategoriaSelecionada(categoriaSelecionada === item.id ? null : item.id)}
          >
            <MaterialCommunityIcons
              name={item.icone}
              size={24}
              color={categoriaSelecionada === item.id ? '#fff' : '#3f51b5'}
            />
            <Text
              style={[
                styles.categoriaNome,
                categoriaSelecionada === item.id && styles.categoriaNomeSelecionada
              ]}
            >
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const emptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="calendar-blank" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhum evento encontrado</Text>
      <Text style={styles.emptySubtitle}>
        {search || categoriaSelecionada || filtroAtivo !== 'todos' ? 
          'Tente ajustar seus filtros de busca' : 
          'Não há eventos disponíveis no momento'}
      </Text>
      {(search || categoriaSelecionada || filtroAtivo !== 'todos') && (
        <Button
          mode="outlined"
          onPress={() => {
            setSearch('');
            setCategoriaSelecionada(null);
            setFiltroAtivo('todos');
          }}
          style={styles.limparFiltrosButton}
        >
          Limpar filtros
        </Button>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
        <Text style={styles.loadingText}>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3f51b5" barStyle="light-content" />
      
      <FlatList
        data={filteredEventos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listaContainer}
        ListHeaderComponent={sectionHeader}
        ListEmptyComponent={emptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3f51b5']} />
        }
      />
      
      {userData?.role === 'admin' && (
        <FAB
          style={styles.fab}
          icon="plus"
          color="#fff"
          onPress={() => navigation.navigate('CriarEvento')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  filtrosContainer: {
    marginBottom: 15,
  },
  filtroChip: {
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  categoriasContainer: {
    marginTop: 5,
  },
  categoriaItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    minWidth: 80,
  },
  categoriaItemSelecionada: {
    backgroundColor: '#3f51b5',
  },
  categoriaNome: {
    fontSize: 12,
    marginTop: 5,
    color: '#3f51b5',
    textAlign: 'center',
  },
  categoriaNomeSelecionada: {
    color: '#fff',
  },
  listaContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  eventoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventoPassado: {
    opacity: 0.7,
  },
  dataContainer: {
    alignItems: 'center',
    marginRight: 15,
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    minWidth: 50,
    justifyContent: 'center',
  },
  dataDia: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  dataMes: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  dataSemana: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventoDetalhes: {
    marginBottom: 8,
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detalheIcone: {
    marginRight: 5,
  },
  detalheTexto: {
    fontSize: 14,
    color: '#666',
  },
  eventoRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoriaTexto: {
    fontSize: 12,
    color: '#3f51b5',
    marginLeft: 5,
  },
  eventoEncerrado: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  botaoParticipacao: {
    margin: 0,
    padding: 0,
  },
  botaoParticipacaoLabel: {
    fontSize: 12,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  limparFiltrosButton: {
    marginTop: 15,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3f51b5',
  },
});

export default EventosScreen; 