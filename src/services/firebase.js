import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Importando configuração do Firebase do arquivo externo para facilitar personalização
import firebaseConfig from './firebaseConfig';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configuração de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Função para solicitar permissão de notificação
export const requestNotificationPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Não conseguimos obter permissão para enviar notificações!');
    return false;
  }
  
  // Obtenha o token do dispositivo e armazene-o no Firestore
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await AsyncStorage.setItem('pushToken', token);
  
  return token;
};

// Registrar o token no Firestore quando o usuário faz login
export const registerPushToken = async (userId, token) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      pushToken: token,
      deviceUpdatedAt: new Date()
    });
  } catch (error) {
    console.error("Erro ao registrar token:", error);
  }
};

export { auth, db, storage, app }; 