import { demoMembers, demoPayments } from "@gymflow/lib";
import { api } from "@gymflow/services";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

const memberMap = new Map(demoMembers.map((member) => [member.id, member.full_name]));

export default function PaymentsScreen() {
  const loadPayments = useCallback(() => api.getPayments(), []);
  const { data: payments, loading } = useAsyncResource(loadPayments, demoPayments);

  return (
    <Screen>
      <MobileCard title="Payments" subtitle="Collections and pending dues while you are on the floor.">
        <Text style={styles.helper}>{loading ? "Loading collections..." : "Live API with demo fallback."}</Text>
        {payments.map((payment) => (
          <View key={payment.id} style={styles.row}>
            <View>
              <Text style={styles.name}>{memberMap.get(payment.member_id) ?? payment.member_id}</Text>
              <Text style={styles.meta}>{payment.method.toUpperCase()} • {payment.paid_on}</Text>
            </View>
            <Text style={styles.amount}>Rs. {payment.amount}</Text>
          </View>
        ))}
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text
  },
  meta: {
    color: colors.muted
  },
  amount: {
    color: colors.brand,
    fontWeight: "700"
  },
  helper: {
    color: colors.muted,
    fontSize: 12
  }
});
