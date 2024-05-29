import { Colors } from "@/constants/Colors";
import { Check } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type PasswordPatternItemProps = {
  satisfied: boolean
  label: string
}
export default function PasswordPatternItem({ satisfied, label }: PasswordPatternItemProps) {
  return (
    <View style={styles.container}>
      <View style={[
        styles.marker,
        satisfied && styles.satisfied
      ]}>
        {satisfied && <Check size={10} color="#000" strokeWidth={5} />}
      </View>
      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center"
  },
  marker: {
    width: 18,
    height: 18,
    borderRadius: 999,
    display: "flex",
    justifyContent: "center",
    backgroundColor: Colors.light_background,
    alignItems: "center"
  },
  satisfied: {
    backgroundColor: Colors.primary_color,
  },
  label: {
    color: Colors.input_text_color
  }
})