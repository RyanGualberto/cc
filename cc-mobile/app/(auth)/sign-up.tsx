import { Link, router } from 'expo-router';
import { Easing, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSession } from '../ctx';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '@/components/shared/Input';
import { Smartphone, Lock, User } from 'lucide-react-native';
import Button from '@/components/shared/Button';
import PasswordPattern from '@/components/Register/PasswordPattern';
import GradientView from '@/components/shared/GradientView';


export default function SignUp() {
  const { signIn } = useSession();
  return (
    <GradientView
      colors={[Colors.dark_primary_color, Colors.dark_surface]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={14}
        style={styles.flexContainer}
      >
        <ScrollView
          bounces={false}
          style={styles.flexContainer}
        >
          <View style={styles.container}>
            <Text style={styles.title}>
              Registrar em Finance<Text style={styles.highlightedText}>App</Text>
            </Text>

            <View style={styles.inputsContainer}>
              <Input
                Icon={User}
                placeholder='Nome'
              />
              <Input
                Icon={User}
                placeholder='Sobrenome'
              />
              <Input
                Icon={User}
                placeholder='CPF'
              />
              <View style={styles.passwordMatcherContainer}>
                <Input
                  Icon={Lock}
                  secureTextEntry
                  placeholder='Senha'
                  textContentType="none"
                />
                <PasswordPattern />
              </View>
              <Input
                Icon={Lock}
                secureTextEntry
                placeholder='Confirme sua senha'
                blurOnSubmit={false}
                textContentType="none"
              />
            </View>
            <View style={styles.footer}>
              <Button label="Continuar" />
              <Text style={styles.authLabel}>
                Já possui uma conta? <Link style={styles.codeLink} href="sign-in">Entrar</Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientView>
  );
}

const styles = StyleSheet.create({

  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 94,
    display: 'flex',
    gap: 44,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: "#fff"
  },
  highlightedText: {
    color: Colors.primary_color,
  },
  inputsContainer: {
    gap: 14,
  },
  codeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  authLabel: {
    color: Colors.input_text_color,
    textAlign: "center",
    fontSize: 18
  },
  codeLink: {
    color: Colors.primary_color,
    textDecorationLine: 'underline',
  },
  footer: {
    gap: 8
  },
  passwordMatcherContainer: {
    gap: 18
  }
})