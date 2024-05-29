import { TransactionType } from "@/app/types/transaction";
import { Colors } from "@/constants/Colors";
import { Icon, TrendingDown, TrendingUp } from "lucide-react-native";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type TransactionProps = ViewProps & {
  transaction: TransactionType
}

export default function Transaction({ transaction, ...rest }: TransactionProps) {
  const parsedDate = new Date(transaction.date).toLocaleDateString("pt-BR", {
    dateStyle: "short"
  })

  const parsedValue = transaction.value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  function TransactionIcon() {
    const icons = {
      deposit: TrendingUp,
      withdraw: TrendingDown,
    }
    const Icon = icons[transaction.type]
    return (
      <Icon
        size={24}
        color={transaction.type === "deposit" ? Colors.primary_color : Colors.danger}
      />
    )
  }

  return (
    <View {...rest} style={[rest.style, styles.container]} >
      <View style={styles.header}>
        <Text style={styles.title}>Transaction</Text>
        <TransactionIcon />
      </View>
      <View style={styles.main}>
        <Text style={[styles.value, { color: transaction.type === "deposit" ? Colors.primary_color : Colors.danger }]}>
          {parsedValue}
        </Text>
        <View style={styles.infoContainer}>
          <Text style={styles.helpText}>
            {transaction.user}
          </Text>
          <Text style={styles.helpText}>
            {parsedDate}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    color: Colors.white_80_opc,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
  main: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  helpText: {
    color: Colors.white_60_opc
  },
  infoContainer: {
    alignItems: "flex-end",
    gap: 8
  }
})