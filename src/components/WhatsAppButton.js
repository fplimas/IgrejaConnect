import React from 'react';
import { TouchableOpacity, StyleSheet, Linking, Platform, Text, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../utils/theme';

const WhatsAppButton = () => {
  // Obter dimensões da tela para posicionamento
  const screenWidth = Dimensions.get('window').width;
  
  const handlePress = async () => {
    // Número de telefone para o WhatsApp deve incluir o código do país (sem o '+')
    // Por exemplo, para Brasil: 55 + DDD + número
    const phoneNumber = theme.church.whatsappNumber;
    const message = `Olá! Gostaria de falar com a equipe da ${theme.church.name}.`;
    
    let url = '';
    if (Platform.OS === 'android') {
      url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    } else {
      url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    }
    
    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Não foi possível abrir o WhatsApp. Por favor, verifique se o aplicativo está instalado.');
      }
    } catch (error) {
      console.error('Erro ao abrir o WhatsApp:', error);
    }
  };

  // Se o botão de WhatsApp estiver desabilitado nas configurações, não renderize nada
  if (!theme.app.showFloatingWhatsApp) {
    return null;
  }

  // Definir tipo de botão baseado na configuração do tema
  const buttonStyle = theme.app.whatsAppButtonStyle || 'circular';
  const buttonPosition = theme.app.whatsAppButtonPosition || 'bottom-right';
  
  // Determinar posicionamento baseado na configuração
  const getPositionStyle = () => {
    switch (buttonPosition) {
      case 'bottom-left':
        return { left: 20, right: 'auto' };
      case 'bottom-center':
        return { left: (screenWidth - 60) / 2, right: 'auto' };
      case 'bottom-right':
      default:
        return { right: 20, left: 'auto' };
    }
  };
  
  const positionStyle = getPositionStyle();
  
  if (buttonStyle === 'pill') {
    return (
      <TouchableOpacity 
        style={[styles.pillButton, positionStyle]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="whatsapp" size={24} color="#fff" />
        <Text style={styles.pillButtonText}>Fale Conosco</Text>
      </TouchableOpacity>
    );
  }
  
  if (buttonStyle === 'card') {
    // Card sempre ficará na parte inferior centralizado, independente da config de posição
    return (
      <TouchableOpacity 
        style={styles.cardButton}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.cardIconContainer}>
          <MaterialCommunityIcons name="whatsapp" size={26} color="#fff" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Precisando de ajuda?</Text>
          <Text style={styles.cardSubtitle}>Fale conosco pelo WhatsApp</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Padrão: botão circular
  return (
    <TouchableOpacity 
      style={[styles.circularButton, positionStyle]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons name="whatsapp" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Botão circular (padrão)
  circularButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 80,
    backgroundColor: '#25d366',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  // Botão tipo "pill"
  pillButton: {
    position: 'absolute',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    bottom: 80,
    backgroundColor: '#25d366',
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  pillButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  
  // Botão tipo "card"
  cardButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    right: 20,
    left: 20,
    bottom: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#25d366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default WhatsAppButton; 