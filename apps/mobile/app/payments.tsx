import { api } from "@gymflow/services";
import type { Payment } from "@gymflow/lib";
import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View, ListRenderItem } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

const keyExtractor = (item: Payment) => item.id;

export default function PaymentsScreen() {
  const loadPayments = useCallback(() => api.getPayments(), []);
  const {
    data: payments,
    loading,
    error,
  } = useAsyncResource(loadPayments, [] as Payment[], "payments");

  const renderItem: ListRenderItem<Payment> = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        <View>
          <Text style={styles.name}>{item.member_id}</Text>
          <Text style={styles.meta}>
            {item.method?.toUpperCase()} • {item.paid_on}
          </Text>
        </View>
        <Text style={styles.amount}>Rs. {item.amount}</Text>
      </View>
    ),
    [],
  );

  return (
    <Screen>
      <MobileCard
        title="Payments"
        subtitle="Collections and pending dues while you are on the floor."
      >
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text style={styles.helper}>
            {loading
              ? "Loading collections..."
              : `${payments.length} payments loaded`}
          </Text>
        )}
        <FlatList
          data={payments}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.helper}>
                No payments yet. Record payments from the web dashboard.
              </Text>
            ) : null
          }
        />
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
    borderBottomColor: colors.border,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    color: colors.muted,
  },
  amount: {
    color: colors.brand,
    fontWeight: "700",
  },
  helper: {
    color: colors.muted,
    fontSize: 12,
  },
  error: {
    color: "#dc2626",
    fontSize: 12,
  },
});
