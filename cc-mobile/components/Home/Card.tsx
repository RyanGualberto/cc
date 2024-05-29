import { Colors } from "@/constants/Colors"
import { PropsWithChildren } from "react"
import { StyleSheet, View, ViewProps } from "react-native"

type CardProps = ViewProps & PropsWithChildren

export default function Card({ children, ...props }: CardProps) {
  return (
    <View style={styles.card} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface_40_opc,
    borderRadius: 18,
    padding: 24,
    display: 'flex',
    gap: 16,
  },
})