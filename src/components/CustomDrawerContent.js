import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import theme from '../utils/theme';

const CustomDrawerContent = (props) => {
  const { currentUser, userData, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const socialLinks = theme.church.socialMedia;

  const handleSocialPress = (platform) => {
    const url = socialLinks[platform];
    if (url) {
      Linking.openURL(url)
        .catch(err => console.error('Erro ao abrir link:', err));
    }
  };

  // Renderiza apenas as redes sociais que estão configuradas (não são null)
  const renderSocialButtons = () => {
    return (
      <View style={styles.socialIcons}>
        {socialLinks.facebook && (
          <TouchableOpacity onPress={() => handleSocialPress('facebook')} style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={22} color="#3b5998" />
          </TouchableOpacity>
        )}
        {socialLinks.instagram && (
          <TouchableOpacity onPress={() => handleSocialPress('instagram')} style={styles.socialButton}>
            <Ionicons name="logo-instagram" size={22} color="#c13584" />
          </TouchableOpacity>
        )}
        {socialLinks.youtube && (
          <TouchableOpacity onPress={() => handleSocialPress('youtube')} style={styles.socialButton}>
            <Ionicons name="logo-youtube" size={22} color="#ff0000" />
          </TouchableOpacity>
        )}
        {socialLinks.twitter && (
          <TouchableOpacity onPress={() => handleSocialPress('twitter')} style={styles.socialButton}>
            <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: theme.colors.primary }}
      >
        <View style={styles.userSection}>
          {userData?.photoURL ? (
            <Image
              source={{ uri: userData.photoURL }}
              style={styles.userImage}
            />
          ) : (
            <View style={styles.userImagePlaceholder}>
              <Text style={styles.userImagePlaceholderText}>
                {userData?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
              </Text>
            </View>
          )}
          <Text style={styles.userName}>
            {userData?.displayName || currentUser?.email?.split('@')[0] || 'Usuário'}
          </Text>
          {userData?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{userData.role}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.drawerListItems}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      
      <View style={styles.bottomSection}>
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Acompanhe nossas redes</Text>
          {renderSocialButtons()}
        </View>
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={22} color="#f44336" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userSection: {
    padding: 20,
    alignItems: 'center',
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  userImagePlaceholder: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userImagePlaceholderText: {
    fontSize: 32,
    color: 'white',
    textTransform: 'uppercase',
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  drawerListItems: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',
  },
  socialSection: {
    marginBottom: 20,
  },
  socialTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  socialButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#f44336',
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent; 