import Card from "@/components/Home/Card";
import CurrentDate from "@/components/Home/CurrentDate";
import Greeting from "@/components/Home/Greeting";
import GradientView from "@/components/shared/GradientView";
import Transaction from "@/components/shared/Transaction";
import { Colors } from "@/constants/Colors";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { transactionsMock } from "../mocks/transactionsMock";
import { Link } from "expo-router";

export default function Home() {

  return (
    <GradientView
      colors={Colors.dashboard_gradient}
      locations={[0, 0.6]}
    >
      <ScrollView style={styles.scrollContainer}>
        <View
          style={styles.container}
        >
          <View style={styles.greetingContainer}>
            <Greeting username="Vinicius" />
            <CurrentDate />
          </View>
          <Card>
            <Text style={styles.overviewTitle}>
              Visão Geral
            </Text>
            <View>
              {
                transactionsMock.map(transaction => {
                  const isLastIndex = transactionsMock.indexOf(transaction) === transactionsMock.length - 1
                  return (
                    <Transaction
                      key={transaction.id}
                      transaction={transaction}
                      style={!isLastIndex && { borderBottomWidth: 1, borderBottomColor: Colors.divider }}
                    />
                  )
                })
              }
            </View>
            <Link href="/overview" style={styles.seeMoreLink}>Ver todos</Link>
          </Card>
        </View>
      </ScrollView>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 94,
    display: 'flex',
    gap: 44,
  },
  greetingContainer: {
    gap: 8
  },
  overviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fff"
  },
  seeMoreLink: {
    color: 'white',
    textDecorationLine: 'underline',
    textAlign: 'right'
  }
})