import { Image, StyleSheet, Text, View } from "react-native";

export default function Greeting({ username }: { username: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>
        Olá, {username}
      </Text>
      <Image
        style={{ width: 32, height: 32 }}
        source={require('../../assets/icons/waving-hand.png')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#fff"
  }
})