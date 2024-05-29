import GradientView from "@/components/shared/GradientView";
import { Colors } from "@/constants/Colors";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { transactionsMock } from "../mocks/transactionsMock";
import Transaction from "@/components/shared/Transaction";

export default function Overview() {
  return (
    <GradientView
      colors={Colors.dashboard_gradient}
      locations={[0, 0.6]}
    >
      <View style={styles.scrollContainer}>
        <View
          style={styles.container}
        >
          <Text style={styles.overviewTitle}>Visão Geral</Text>
          <View>
            <FlatList
              data={transactionsMock}
              style={{ width: '100%', height: '100%' }}
              keyExtractor={transaction => transaction.id}
              renderItem={({ item }) => {
                const isLastIndex = transactionsMock.indexOf(item) === transactionsMock.length - 1
                return (
                  <Transaction
                    transaction={item}
                    style={!isLastIndex && { borderBottomWidth: 1, borderBottomColor: Colors.divider }}
                  />
                )
              }}
            />
          </View>
        </View>
      </View>
    </GradientView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fff"
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 94,
    display: 'flex',
    gap: 44,
  },
})