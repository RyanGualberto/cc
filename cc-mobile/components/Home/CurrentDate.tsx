import { Colors } from "@/constants/Colors";
import { StyleSheet, Text } from "react-native";

export default function CurrentDate() {
  const date = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Text style={styles.date}>
      {date}
    </Text>
  )
}

const styles = StyleSheet.create({
  date: {
    fontSize: 18,
    color: Colors.input_text_color,
  }
})