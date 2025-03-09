import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
  Platform,
  StatusBar
} from 'react-native';
import { Button, Divider, IconButton, ActivityIndicator, List } from 'react-native-paper';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Calendar from 'expo-calendar';
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const DetalheEventoScreen = ({ route, navigation }) => {
  const { evento } = route.params;
  const { currentUser, userData } = useAuth();
  const [isParticipando, setIsParticipando] = useState(false);
  const [participantes, setParticipantes] = useState(evento.participantes || 0);
  const [loading, setLoading] = useState(false);
  const [dadosEvento, setDadosEvento] = useState(evento);
  const [expandDescricao, setExpandDescricao] = useState(false);
  
  const dataEvento = evento.data instanceof Date ? evento.data : evento.data.toDate();
  const hoje = new Date();
  const isEventoPassado = dataEvento < hoje;

  useEffect(() => {
    if (currentUser) {
      verificarParticipacao();
    }
  }, [currentUser]);

  const verificarParticipacao = async () => {
    if (!currentUser) return;
    
    try {
      const eventoRef = doc(db, 'eventos', evento.id);
      const eventoDoc = await getDoc(eventoRef);
      
      if (eventoDoc.exists()) {
        const eventoData = eventoDoc.data();
        if (eventoData.listaParticipantes) {
          setIsParticipando(eventoData.listaParticipantes.includes(currentUser.uid));
        }
        setDadosEvento({...evento, ...eventoData});
        setParticipantes(eventoData.participantes || 0);
      }
    } catch (error) {
      console.error('Erro ao verificar participação:', error);
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    
    const dataObj = data instanceof Date ? data : data.toDate();
    
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const diaSemana = diasSemana[dataObj.getDay()];
    
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', options);
    
    return `${diaSemana}, ${dataFormatada}`;
  };

  const compartilharEvento = async () => {
    try {
      const mensagem = `${dadosEvento.titulo}\n\nData: ${formatarData(dadosEvento.data)}\nHorário: ${dadosEvento.horarioInicio} - ${dadosEvento.horarioFim}\nLocal: ${dadosEvento.local}\n\n${dadosEvento.descricao}\n\nParticipe conosco!`;
      
      await Share.share({
        message: mensagem,
        title: dadosEvento.titulo,
      });
    } catch (error) {
      console.error('Erro ao compartilhar evento:', error);
    }
  };

  const adicionarAoCalendario = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É necessário conceder permissão para acessar o calendário.');
        return;
      }
      
      const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const calendario = calendarios.find(cal => cal.allowsModifications);
      
      if (!calendario) {
        Alert.alert('Erro', 'Não foi possível encontrar um calendário válido em seu dispositivo.');
        return;
      }
      
      const dataInicio = dataEvento;
      const dataFim = new Date(dataEvento);
      
      // Ajustar horário de início e fim
      const [horaInicio, minInicio] = dadosEvento.horarioInicio.split(':').map(Number);
      const [horaFim, minFim] = dadosEvento.horarioFim.split(':').map(Number);
      
      dataInicio.setHours(horaInicio, minInicio, 0);
      dataFim.setHours(horaFim, minFim, 0);
      
      const eventoId = await Calendar.createEventAsync(calendario.id, {
        title: dadosEvento.titulo,
        startDate: dataInicio,
        endDate: dataFim,
        location: dadosEvento.local + (dadosEvento.endereco ? ', ' + dadosEvento.endereco : ''),
        notes: dadosEvento.descricao,
        alarms: [{ relativeOffset: -60 }], // Alerta 1 hora antes
      });
      
      Alert.alert('Sucesso', 'Evento adicionado ao seu calendário!');
    } catch (error) {
      console.error('Erro ao adicionar ao calendário:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o evento ao calendário.');
    }
  };

  const abrirMapa = () => {
    // Em um aplicativo real, você usaria coordenadas reais armazenadas no documento do evento
    const latitude = -23.550520;
    const longitude = -46.633308;
    
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${encodeURIComponent(dadosEvento.local)}`,
      android: `geo:${latitude},${longitude}?q=${encodeURIComponent(dadosEvento.local)}`,
    });
    
    Linking.openURL(url).catch(err => {
      Alert.alert('Erro', 'Não foi possível abrir o mapa. Verifique se você tem um aplicativo de mapas instalado.');
    });
  };

  const alternarParticipacao = async () => {
    if (!currentUser) {
      Alert.alert(
        'Login necessário',
        'Você precisa estar logado para participar deste evento.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Fazer login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    
    if (isEventoPassado) {
      Alert.alert('Evento encerrado', 'Este evento já foi encerrado.');
      return;
    }
    
    setLoading(true);
    
    try {
      const eventoRef = doc(db, 'eventos', evento.id);
      const userRef = doc(db, 'users', currentUser.uid);
      
      if (isParticipando) {
        // Remover participação
        await updateDoc(eventoRef, {
          participantes: participantes > 0 ? participantes - 1 : 0,
          listaParticipantes: arrayRemove(currentUser.uid)
        });
        
        await updateDoc(userRef, {
          eventosInscritos: arrayRemove(evento.id)
        });
        
        setParticipantes(prev => prev > 0 ? prev - 1 : 0);
        setIsParticipando(false);
      } else {
        // Adicionar participação
        await updateDoc(eventoRef, {
          participantes: participantes + 1,
          listaParticipantes: arrayUnion(currentUser.uid)
        });
        
        await updateDoc(userRef, {
          eventosInscritos: arrayUnion(evento.id)
        });
        
        setParticipantes(prev => prev + 1);
        setIsParticipando(true);
      }
    } catch (error) {
      console.error('Erro ao alterar participação:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar sua participação. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const renderBotaoParticipacao = () => {
    if (isEventoPassado) {
      return (
        <Button
          mode="outlined"
          style={styles.botaoDesabilitado}
          labelStyle={styles.botaoDesabilitadoLabel}
          disabled
        >
          Evento encerrado
        </Button>
      );
    }
    
    if (loading) {
      return (
        <Button 
          mode="contained" 
          style={styles.botaoCarregando}
          loading
        >
          Carregando...
        </Button>
      );
    }
    
    if (isParticipando) {
      return (
        <Button 
          mode="outlined" 
          style={styles.botaoCancelar}
          onPress={alternarParticipacao}
          labelStyle={styles.botaoCancelarLabel}
          icon="close-circle-outline"
        >
          Cancelar participação
        </Button>
      );
    }
    
    return (
      <Button 
        mode="contained" 
        style={styles.botaoParticipar}
        onPress={alternarParticipacao}
        icon="check-circle-outline"
      >
        Confirmar participação
      </Button>
    );
  };

  const getCategoriaNome = (categoriaId) => {
    const categorias = {
      'culto': 'Culto',
      'estudo': 'Estudo Bíblico',
      'jovens': 'Jovens',
      'criancas': 'Crianças',
      'mulheres': 'Mulheres',
      'homens': 'Homens',
      'casais': 'Casais',
      'acao_social': 'Ação Social'
    };
    
    return categorias[categoriaId] || 'Evento';
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3f51b5" barStyle="light-content" />
      
      {/* Header com imagem */}
      <View style={styles.header}>
        <Image 
          source={dadosEvento.imagemURL ? { uri: dadosEvento.imagemURL } : require('../../assets/evento-placeholder.jpg')} 
          style={styles.headerImage}
        />
        <View style={styles.headerGradient} />
        
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={24}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        
        <View style={styles.headerActions}>
          <IconButton
            icon="share-variant"
            iconColor="white"
            size={24}
            onPress={compartilharEvento}
          />
          <IconButton
            icon="calendar-plus"
            iconColor="white"
            size={24}
            onPress={adicionarAoCalendario}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Categoria */}
        <View style={styles.categoriaContainer}>
          <Text style={styles.categoriaTexto}>
            {getCategoriaNome(dadosEvento.categoria)}
          </Text>
        </View>
        
        {/* Título */}
        <Text style={styles.titulo}>{dadosEvento.titulo}</Text>
        
        {/* Data e Hora */}
        <View style={styles.dataHoraContainer}>
          <View style={styles.dataContainer}>
            <Ionicons name="calendar-outline" size={18} color="#3f51b5" style={styles.icon} />
            <Text style={styles.dataTexto}>{formatarData(dadosEvento.data)}</Text>
          </View>
          
          <View style={styles.horaContainer}>
            <Ionicons name="time-outline" size={18} color="#3f51b5" style={styles.icon} />
            <Text style={styles.horaTexto}>{dadosEvento.horarioInicio} - {dadosEvento.horarioFim}</Text>
          </View>
        </View>
        
        {/* Estatísticas */}
        <View style={styles.estatisticasContainer}>
          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaNumero}>{participantes}</Text>
            <Text style={styles.estatisticaDescricao}>Participantes</Text>
          </View>
          
          {isParticipando && !isEventoPassado && (
            <View style={styles.estatisticaItem}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.estatisticaDescricao}>Você confirmou</Text>
            </View>
          )}
          
          {isEventoPassado && (
            <View style={styles.estatisticaItem}>
              <MaterialIcons name="event-busy" size={24} color="#999" />
              <Text style={styles.estatisticaDescricao}>Evento encerrado</Text>
            </View>
          )}
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Descrição */}
        <View style={styles.secaoContainer}>
          <Text style={styles.secaoTitulo}>Descrição</Text>
          <Text 
            style={styles.descricaoTexto}
            numberOfLines={expandDescricao ? undefined : 3}
          >
            {dadosEvento.descricao}
          </Text>
          
          {dadosEvento.descricao && dadosEvento.descricao.length > 100 && (
            <TouchableOpacity
              style={styles.verMaisContainer}
              onPress={() => setExpandDescricao(!expandDescricao)}
            >
              <Text style={styles.verMaisTexto}>
                {expandDescricao ? 'Ver menos' : 'Ver mais'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Local */}
        <View style={styles.secaoContainer}>
          <Text style={styles.secaoTitulo}>Local</Text>
          
          <Text style={styles.localNome}>{dadosEvento.local}</Text>
          {dadosEvento.endereco && <Text style={styles.localEndereco}>{dadosEvento.endereco}</Text>}
          
          <TouchableOpacity style={styles.mapaContainer} onPress={abrirMapa}>
            <View style={styles.mapaPlaceholder}>
              <MaterialIcons name="location-on" size={36} color="#3f51b5" />
              <Text style={styles.mapaPlaceholderText}>Ver no mapa</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Informações adicionais */}
        {dadosEvento.informacoesAdicionais && (
          <>
            <View style={styles.secaoContainer}>
              <Text style={styles.secaoTitulo}>Informações adicionais</Text>
              <Text style={styles.infoAdicionalTexto}>{dadosEvento.informacoesAdicionais}</Text>
            </View>
            <Divider style={styles.divider} />
          </>
        )}
        
        {/* Responsáveis */}
        {dadosEvento.responsaveis && dadosEvento.responsaveis.length > 0 && (
          <>
            <View style={styles.secaoContainer}>
              <Text style={styles.secaoTitulo}>Responsáveis</Text>
              {dadosEvento.responsaveis.map((responsavel, index) => (
                <View key={index} style={styles.responsavelItem}>
                  <View style={styles.responsavelAvatar}>
                    <Text style={styles.responsavelAvatarText}>
                      {responsavel.nome.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.responsavelInfo}>
                    <Text style={styles.responsavelNome}>{responsavel.nome}</Text>
                    <Text style={styles.responsavelFuncao}>{responsavel.funcao}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Divider style={styles.divider} />
          </>
        )}
        
        {/* Botão de participação */}
        <View style={styles.participacaoContainer}>
          {renderBotaoParticipacao()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  categoriaContainer: {
    backgroundColor: '#e8eaf6',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 10,
  },
  categoriaTexto: {
    color: '#3f51b5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginHorizontal: 20,
    marginTop: 10,
  },
  dataHoraContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  horaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  dataTexto: {
    fontSize: 14,
    color: '#555',
  },
  horaTexto: {
    fontSize: 14,
    color: '#555',
  },
  estatisticasContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
  },
  estatisticaItem: {
    alignItems: 'center',
    marginRight: 30,
    flexDirection: 'row',
  },
  estatisticaNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginRight: 5,
  },
  estatisticaDescricao: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: '#e0e0e0',
  },
  secaoContainer: {
    marginHorizontal: 20,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descricaoTexto: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  verMaisContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  verMaisTexto: {
    color: '#3f51b5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  localNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  localEndereco: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  mapaContainer: {
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mapaPlaceholder: {
    alignItems: 'center',
  },
  mapaPlaceholderText: {
    marginTop: 5,
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  infoAdicionalTexto: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  responsavelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  responsavelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  responsavelAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  responsavelInfo: {
    flex: 1,
  },
  responsavelNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  responsavelFuncao: {
    fontSize: 14,
    color: '#666',
  },
  participacaoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  botaoParticipar: {
    backgroundColor: '#3f51b5',
    paddingVertical: 8,
  },
  botaoCancelar: {
    borderColor: '#f44336',
    borderWidth: 1,
    paddingVertical: 8,
  },
  botaoCancelarLabel: {
    color: '#f44336',
  },
  botaoDesabilitado: {
    borderColor: '#999',
    borderWidth: 1,
    paddingVertical: 8,
  },
  botaoDesabilitadoLabel: {
    color: '#999',
  },
  botaoCarregando: {
    backgroundColor: '#3f51b5',
    paddingVertical: 8,
  },
});

export default DetalheEventoScreen; 