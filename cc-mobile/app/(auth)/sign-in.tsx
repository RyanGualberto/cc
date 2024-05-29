import { Link, router, useNavigation } from 'expo-router';
import { ActivityIndicator, Easing, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSession } from '../ctx';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '@/components/shared/Input';
import { Smartphone, Lock } from 'lucide-react-native';
import Button from '@/components/shared/Button';
import { Dimensions } from 'react-native';
import GradientView from '@/components/shared/GradientView';



export default function SignIn() {
  const navigation = useNavigation()
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
              Entrar em Finance<Text style={styles.highlightedText}>App</Text>
            </Text>

            <View style={styles.inputsContainer}>
              <Input
                Icon={Smartphone}
                placeholder='Email ou Telefone'
              />
              <Input
                Icon={Lock}
                secureTextEntry
                placeholder='Sua Senha'
              />
            </View>
            <View style={styles.codeContainer}>
              <Text style={{ color: Colors.input_text_color, fontSize: 16 }}>ou</Text>
              <Text style={styles.codeLink}>solicite um código para login</Text>
            </View>
            <View style={styles.footer}>
              <Button label="Continuar" />
              <Text style={styles.authLabel}>
                Não tem uma conta? <Link style={styles.codeLink} push href="sign-up">Registre-se</Link>
              </Text>
            </View>
          </View>
        </ScrollView >
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
  }
})