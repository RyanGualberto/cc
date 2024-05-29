import { StyleSheet, Text, View } from "react-native";
import GradientView from "./GradientView";
import { Colors } from "@/constants/Colors";

export default function SplashScreen() {
  return (
    <GradientView
      colors={Colors.dashboard_gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          Finance<Text style={styles.highlightedText}>App</Text>
        </Text>
      </View>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#fff",
  },
  highlightedText: {
    color: Colors.primary_color,
  },
});