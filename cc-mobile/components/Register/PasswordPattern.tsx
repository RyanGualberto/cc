import { StyleSheet, View } from "react-native";
import PasswordPatternItem from "./PasswordPatternItem";

export default function PasswordPattern() {
  return (
    <View style={styles.container}>
      <PasswordPatternItem satisfied label="Deve possuir pelo menos 8 caracteres" />
      <PasswordPatternItem satisfied label="Deve possuir letras minúsculas" />
      <PasswordPatternItem satisfied label="Deve possuir letras maiúsculas" />
      <PasswordPatternItem satisfied label="Deve possuir caracteres especiais" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    gap: 8
  }
})