import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await resetPassword(values.email);
      Alert.alert(
        'E-mail Enviado', 
        'Verifique sua caixa de entrada para redefinir sua senha.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      let errorMessage = '';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Não existe conta com este e-mail.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'E-mail inválido.';
          break;
        default:
          errorMessage = 'Erro ao enviar e-mail de recuperação. Tente novamente.';
      }
      
      Alert.alert('Erro', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#3f51b5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recuperar Senha</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.instructionText}>
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </Text>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleResetPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
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

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                Enviar E-mail
              </Button>
              
              <TouchableOpacity 
                style={styles.backToLoginButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.backToLoginText}>Voltar ao Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 10,
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
  backToLoginButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  backToLoginText: {
    color: '#3f51b5',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen; 