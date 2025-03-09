import React, { useEffect } from 'react';
import { Platform, TouchableOpacity, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useAuth } from '../contexts/AuthContext';

// Telas de autenticação
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Telas principais
import HomeScreen from '../screens/main/HomeScreen';
import EventosScreen from '../screens/main/EventosScreen';
import DetalheEventoScreen from '../screens/main/DetalheEventoScreen';
import BibliaScreen from '../screens/main/BibliaScreen';
import DoacoesScreen from '../screens/main/DoacoesScreen';
import PedidosOracaoScreen from '../screens/main/PedidosOracaoScreen';
import NovoPedidoScreen from '../screens/main/NovoPedidoScreen';
import PerfilScreen from '../screens/main/PerfilScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';

// Componente para o botão do WhatsApp
import WhatsAppButton from '../components/WhatsAppButton';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const headerOptions = {
  headerStyle: {
    backgroundColor: '#3f51b5',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

// Stack do Home
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ title: 'Início' }} 
      />
      <Stack.Screen 
        name="DetalheEvento" 
        component={DetalheEventoScreen} 
        options={{ title: 'Detalhes do Evento' }} 
      />
    </Stack.Navigator>
  );
};

// Stack de Eventos
const EventosStack = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen 
        name="EventosMain" 
        component={EventosScreen} 
        options={{ title: 'Eventos' }} 
      />
      <Stack.Screen 
        name="DetalheEvento" 
        component={DetalheEventoScreen} 
        options={{ title: 'Detalhes do Evento' }} 
      />
    </Stack.Navigator>
  );
};

// Stack da Bíblia
const BibliaStack = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen 
        name="BibliaMain" 
        component={BibliaScreen} 
        options={{ title: 'Bíblia Sagrada' }} 
      />
    </Stack.Navigator>
  );
};

// Stack de Pedidos de Oração
const PedidosStack = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen 
        name="PedidosMain" 
        component={PedidosOracaoScreen} 
        options={{ title: 'Pedidos de Oração' }} 
      />
      <Stack.Screen 
        name="NovoPedido" 
        component={NovoPedidoScreen} 
        options={{ title: 'Novo Pedido' }} 
      />
    </Stack.Navigator>
  );
};

// Stack de Doações
const DoacoesStack = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen 
        name="DoacoesMain" 
        component={DoacoesScreen} 
        options={{ title: 'Doações' }} 
      />
    </Stack.Navigator>
  );
};

// Stack de Perfil
const PerfilStack = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen 
        name="PerfilMain" 
        component={PerfilScreen} 
        options={{ title: 'Meu Perfil' }} 
      />
    </Stack.Navigator>
  );
};

// Tab Navigator (Menu inferior)
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Eventos') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Bíblia') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Pedidos') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Doações') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3f51b5',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60
        },
        tabBarLabelStyle: {
          fontSize: 12
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Eventos" 
        component={EventosStack} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Bíblia" 
        component={BibliaStack} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Pedidos" 
        component={PedidosStack} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Doações" 
        component={DoacoesStack} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator (Menu lateral)
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#3f51b5',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen 
        name="TabNavigator" 
        component={TabNavigator} 
        options={{
          title: 'Início',
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Perfil" 
        component={PerfilStack} 
        options={{
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Navegação principal
const AppNavigator = () => {
  const { currentUser, loading } = useAuth();

  // Configuração do esquema de URL para links profundos
  const prefix = Linking.createURL('/');
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Auth: {
          screens: {
            Login: 'login',
            Register: 'register',
            ForgotPassword: 'forgot-password',
          },
        },
        Main: {
          screens: {
            TabNavigator: {
              screens: {
                Home: 'home',
                Eventos: 'eventos',
                Bíblia: 'biblia',
                Pedidos: 'pedidos',
                Doações: 'doacoes',
              },
            },
            Perfil: 'perfil',
          },
        },
      },
    },
  };

  if (loading) {
    return null; // ou um componente de carregamento
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
      <WhatsAppButton />
    </NavigationContainer>
  );
};

export default AppNavigator; 