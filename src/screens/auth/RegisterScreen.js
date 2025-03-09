import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const RegisterSchema = Yup.object().shape({
  nome: Yup.string()
    .min(2, 'Nome muito curto')
    .max(50, 'Nome muito longo')
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  telefone: Yup.string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato: (00) 00000-0000')
    .required('Telefone é obrigatório'),
  endereco: Yup.string()
    .min(5, 'Endereço muito curto')
    .required('Endereço é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'As senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
});

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      await register(
        values.email, 
        values.password, 
        values.nome, 
        values.telefone, 
        values.endereco
      );
      Alert.alert(
        'Sucesso', 
        'Cadastro realizado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      let errorMessage = '';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este e-mail já está em uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'E-mail inválido.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operação não permitida.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca.';
          break;
        default:
          errorMessage = 'Erro ao criar conta. Tente novamente.';
      }
      
      Alert.alert('Erro', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar telefone como (XX) XXXXX-XXXX
  const formatPhoneNumber = (text, setFieldValue) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    
    if (cleaned.length > 0) {
      formatted = '(' + cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += ') ' + cleaned.substring(2, 7);
    }
    if (cleaned.length > 7) {
      formatted += '-' + cleaned.substring(7, 11);
    }
    
    setFieldValue('telefone', formatted);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#3f51b5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Conta</Text>
        </View>

        <Formik
          initialValues={{ 
            nome: '', 
            email: '', 
            telefone: '', 
            endereco: '', 
            password: '', 
            confirmPassword: '' 
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.formContainer}>
              <TextInput
                label="Nome Completo"
                value={values.nome}
                onChangeText={handleChange('nome')}
                onBlur={handleBlur('nome')}
                style={styles.input}
                error={touched.nome && errors.nome}
                left={<TextInput.Icon icon="account" />}
                mode="outlined"
              />
              {touched.nome && errors.nome && (
                <Text style={styles.errorText}>{errors.nome}</Text>
              )}

              <TextInput
                label="E-mail"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email && errors.email}
                left={<TextInput.Icon icon="email" />}
                mode="outlined"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                label="Telefone"
                value={values.telefone}
                onChangeText={(text) => formatPhoneNumber(text, setFieldValue)}
                onBlur={handleBlur('telefone')}
                style={styles.input}
                keyboardType="phone-pad"
                error={touched.telefone && errors.telefone}
                left={<TextInput.Icon icon="phone" />}
                mode="outlined"
                placeholder="(00) 00000-0000"
              />
              {touched.telefone && errors.telefone && (
                <Text style={styles.errorText}>{errors.telefone}</Text>
              )}

              <TextInput
                label="Endereço"
                value={values.endereco}
                onChangeText={handleChange('endereco')}
                onBlur={handleBlur('endereco')}
                style={styles.input}
                error={touched.endereco && errors.endereco}
                left={<TextInput.Icon icon="map-marker" />}
                mode="outlined"
              />
              {touched.endereco && errors.endereco && (
                <Text style={styles.errorText}>{errors.endereco}</Text>
              )}

              <TextInput
                label="Senha"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry={!passwordVisible}
                style={styles.input}
                error={touched.password && errors.password}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={passwordVisible ? "eye-off" : "eye"} 
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
                mode="outlined"
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TextInput
                label="Confirmar Senha"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry={!confirmPasswordVisible}
                style={styles.input}
                error={touched.confirmPassword && errors.confirmPassword}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon 
                    icon={confirmPasswordVisible ? "eye-off" : "eye"} 
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  />
                }
                mode="outlined"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                Cadastrar
              </Button>
              
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Já tem uma conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLinkText}>Entrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#3f51b5',
    paddingVertical: 6,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#333',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#3f51b5',
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 