import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  StatusBar
} from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [proximoCulto, setProximoCulto] = useState(null);
  const [versiculoDoDia, setVersiculoDoDia] = useState({
    texto: 'Pois onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles.',
    referencia: 'Mateus 18:20'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchEventos(),
        fetchAnuncios(),
        fetchProximoCulto()
      ]);
      fetchVersiculoDoDia();
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchEventos = async () => {
    try {
      const eventosRef = collection(db, 'eventos');
      const q = query(eventosRef, orderBy('data', 'asc'), limit(3));
      const querySnapshot = await getDocs(q);
      
      const eventosData = [];
      querySnapshot.forEach((doc) => {
        eventosData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setEventos(eventosData);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const fetchAnuncios = async () => {
    try {
      const anunciosRef = collection(db, 'anuncios');
      const q = query(anunciosRef, orderBy('dataPublicacao', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      
      const anunciosData = [];
      querySnapshot.forEach((doc) => {
        anunciosData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setAnuncios(anunciosData);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    }
  };

  const fetchProximoCulto = async () => {
    try {
      const cultosRef = collection(db, 'cultos');
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const q = query(cultosRef, orderBy('data', 'asc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setProximoCulto({
          id: doc.id,
          ...doc.data(),
        });
      }
    } catch (error) {
      console.error('Erro ao buscar próximo culto:', error);
      // Dados fictícios para demonstração
      setProximoCulto({
        id: 'demo',
        titulo: 'Culto de Celebração',
        data: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Data atual + 2 dias
        horario: '19:00',
        local: 'Templo Principal',
        descricao: 'Venha celebrar com a gente neste domingo!'
      });
    }
  };

  const fetchVersiculoDoDia = () => {
    // Em uma implementação real, você poderia usar uma API de Bíblia
    // Aqui estamos usando dados estáticos para demonstração
    const versiculos = [
      {
        texto: 'Pois onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles.',
        referencia: 'Mateus 18:20'
      },
      {
        texto: 'O Senhor é o meu pastor, nada me faltará.',
        referencia: 'Salmos 23:1'
      },
      {
        texto: 'Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.',
        referencia: 'João 3:16'
      },
      {
        texto: 'Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai, a não ser por mim.',
        referencia: 'João 14:6'
      },
      {
        texto: 'Tudo posso naquele que me fortalece.',
        referencia: 'Filipenses 4:13'
      }
    ];
    
    // Seleciona um versículo aleatório
    const randomIndex = Math.floor(Math.random() * versiculos.length);
    setVersiculoDoDia(versiculos[randomIndex]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatarData = (data) => {
    if (!data) return '';
    
    const dataObj = data instanceof Date ? data : data.toDate();
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3f51b5']} />
      }
    >
      <StatusBar backgroundColor="#3f51b5" barStyle="light-content" />
      
      {/* Banner de boas-vindas */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Olá, {userData?.displayName?.split(' ')[0] || 'Irmão(ã)'}!
        </Text>
        <Text style={styles.welcomeSubtext}>
          Bem-vindo à Igreja Connect
        </Text>
      </View>
      
      {/* Versículo do dia */}
      <Card style={styles.versiculoCard}>
        <Card.Content>
          <Title style={styles.versiculoTitle}>Versículo do Dia</Title>
          <Paragraph style={styles.versiculoTexto}>
            "{versiculoDoDia.texto}"
          </Paragraph>
          <Text style={styles.versiculoReferencia}>
            {versiculoDoDia.referencia}
          </Text>
        </Card.Content>
      </Card>
      
      {/* Próximo culto */}
      {proximoCulto && (
        <Card style={styles.cultoCard}>
          <Card.Content>
            <View style={styles.cultoHeader}>
              <MaterialCommunityIcons name="church" size={24} color="#3f51b5" />
              <Title style={styles.cultoTitle}>Próximo Culto</Title>
            </View>
            <Text style={styles.cultoData}>
              {formatarData(proximoCulto.data)} às {proximoCulto.horario}
            </Text>
            <Text style={styles.cultoNome}>{proximoCulto.titulo}</Text>
            <Text style={styles.cultoLocal}>{proximoCulto.local}</Text>
            {proximoCulto.descricao && (
              <Paragraph style={styles.cultoDescricao}>
                {proximoCulto.descricao}
              </Paragraph>
            )}
          </Card.Content>
        </Card>
      )}
      
      {/* Eventos */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Eventos')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScrollView}
        >
          {eventos.length > 0 ? (
            eventos.map(evento => (
              <TouchableOpacity 
                key={evento.id}
                onPress={() => navigation.navigate('DetalheEvento', { evento })}
              >
                <Card style={styles.eventoCard}>
                  <Image 
                    source={evento.imagemURL ? { uri: evento.imagemURL } : require('../../assets/evento-placeholder.jpg')} 
                    style={styles.eventoImage}
                  />
                  <Card.Content style={styles.eventoContent}>
                    <Text style={styles.eventoData}>
                      {formatarData(evento.data)}
                    </Text>
                    <Text style={styles.eventoTitulo} numberOfLines={2}>
                      {evento.titulo}
                    </Text>
                    <Text style={styles.eventoLocal} numberOfLines={1}>
                      {evento.local}
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      </View>
      
      {/* Anúncios e Notícias */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Anúncios e Notícias</Text>
        </View>
        
        {anuncios.length > 0 ? (
          anuncios.map(anuncio => (
            <Card key={anuncio.id} style={styles.anuncioCard}>
              <Card.Content>
                <Title style={styles.anuncioTitulo}>{anuncio.titulo}</Title>
                <Paragraph style={styles.anuncioDescricao} numberOfLines={3}>
                  {anuncio.conteudo}
                </Paragraph>
                <Text style={styles.anuncioData}>
                  {formatarData(anuncio.dataPublicacao)}
                </Text>
              </Card.Content>
              {anuncio.imagemURL && (
                <Card.Cover source={{ uri: anuncio.imagemURL }} style={styles.anuncioImage} />
              )}
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>Nenhum anúncio encontrado</Text>
            </Card.Content>
          </Card>
        )}
      </View>
      
      {/* Menu rápido */}
      <View style={styles.quickMenuContainer}>
        <TouchableOpacity 
          style={styles.quickMenuItem}
          onPress={() => navigation.navigate('Bíblia')}
        >
          <View style={[styles.quickMenuIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="book-outline" size={24} color="white" />
          </View>
          <Text style={styles.quickMenuText}>Bíblia</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickMenuItem}
          onPress={() => navigation.navigate('Pedidos')}
        >
          <View style={[styles.quickMenuIcon, { backgroundColor: '#FFC107' }]}>
            <MaterialCommunityIcons name="pray" size={24} color="white" />
          </View>
          <Text style={styles.quickMenuText}>Pedidos de Oração</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickMenuItem}
          onPress={() => navigation.navigate('Doações')}
        >
          <View style={[styles.quickMenuIcon, { backgroundColor: '#E91E63' }]}>
            <Ionicons name="heart-outline" size={24} color="white" />
          </View>
          <Text style={styles.quickMenuText}>Doações</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickMenuItem}
          onPress={() => navigation.navigate('Perfil')}
        >
          <View style={[styles.quickMenuIcon, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="person-outline" size={24} color="white" />
          </View>
          <Text style={styles.quickMenuText}>Perfil</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 Igreja Connect</Text>
        <Text style={styles.footerText}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
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
  welcomeContainer: {
    backgroundColor: '#3f51b5',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  versiculoCard: {
    margin: 15,
    marginTop: -20,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  versiculoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginBottom: 10,
  },
  versiculoTexto: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    color: '#333',
  },
  versiculoReferencia: {
    fontSize: 14,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 10,
    fontWeight: 'bold',
  },
  cultoCard: {
    margin: 15,
    marginTop: 0,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  cultoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cultoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginLeft: 10,
  },
  cultoData: {
    fontSize: 14,
    color: '#FF5722',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cultoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  cultoLocal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cultoDescricao: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  sectionContainer: {
    marginTop: 15,
    paddingBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  horizontalScrollView: {
    paddingLeft: 15,
  },
  eventoCard: {
    width: 200,
    marginRight: 15,
    elevation: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  eventoImage: {
    width: '100%',
    height: 120,
  },
  eventoContent: {
    padding: 10,
  },
  eventoData: {
    fontSize: 12,
    color: '#FF5722',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    height: 40,
  },
  eventoLocal: {
    fontSize: 12,
    color: '#666',
  },
  anuncioCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    borderRadius: 10,
  },
  anuncioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  anuncioDescricao: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  anuncioData: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  anuncioImage: {
    height: 150,
    marginTop: 10,
  },
  emptyCard: {
    margin: 15,
    elevation: 1,
    borderRadius: 10,
    width: 200,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  quickMenuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  quickMenuItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  quickMenuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickMenuText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
});

export default HomeScreen; 