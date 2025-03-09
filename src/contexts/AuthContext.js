import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, requestNotificationPermission, registerPushToken } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registrar um novo usuário
  const register = async (email, password, displayName, telefone, endereco) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Atualizar o perfil com o nome de exibição
      await updateProfile(user, { displayName });
      
      // Salvar informações adicionais no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        telefone,
        endereco,
        role: 'membro', // Papel padrão para novos usuários
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Obter e registrar token para notificações push
      const token = await requestNotificationPermission();
      if (token) {
        await registerPushToken(user.uid, token);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Login de usuário
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Obter e registrar token para notificações push
      const token = await requestNotificationPermission();
      if (token && user) {
        await registerPushToken(user.uid, token);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Redefinir senha
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Atualizar dados do usuário
  const updateUserData = async (data) => {
    if (!currentUser) return;
    
    try {
      // Atualiza os dados no Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        ...userData,
        ...data,
        updatedAt: new Date()
      }, { merge: true });
      
      // Atualiza os dados no state
      setUserData(prevData => ({
        ...prevData,
        ...data
      }));
      
      // Se o nome de exibição for atualizado, atualizar no Auth também
      if (data.displayName) {
        await updateProfile(currentUser, { displayName: data.displayName });
      }
    } catch (error) {
      throw error;
    }
  };

  // Buscar dados do usuário do Firestore
  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Buscar dados adicionais do usuário do Firestore
        await fetchUserData(user.uid);
        
        // Armazenar uid para rápida recuperação
        await AsyncStorage.setItem('userId', user.uid);
      } else {
        // Limpar dados quando não há usuário
        setUserData(null);
        await AsyncStorage.removeItem('userId');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    register,
    logout,
    resetPassword,
    updateUserData,
    fetchUserData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 