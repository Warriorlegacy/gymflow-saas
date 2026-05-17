import { api } from "@gymflow/services";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

export default function DietPlansScreen() {
  const loadDietPlans = useCallback(() => api.getDietPlans(), []);
  const {
    data: dietPlans,
    loading,
    error,
  } = useAsyncResource(loadDietPlans, []);

  return (
    <Screen>
      <MobileCard
        title="Diet Plans"
        subtitle="Nutrition plans assigned to gym members."
      >
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text style={styles.helper}>
            {loading
              ? "Loading diet plans..."
              : `${dietPlans.length} plans loaded`}
          </Text>
        )}
        {dietPlans.map((plan: any) => (
          <View key={plan.id} style={styles.card}>
            <Text style={styles.title}>{plan.title}</Text>
            {plan.objective ? (
              <Text style={styles.meta}>Objective: {plan.objective}</Text>
            ) : null}
            <View style={styles.row}>
              <Text style={styles.label}>
                Member: {plan.members?.full_name || "-"}
              </Text>
              <Text style={styles.label}>
                Trainer: {plan.trainers?.full_name || "-"}
              </Text>
            </View>
            {plan.meals?.length ? (
              <View style={styles.meals}>
                {plan.meals.map((meal: any, i: number) => (
                  <View key={i} style={styles.mealRow}>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                    <Text style={styles.mealName}>{meal.meal}</Text>
                    <Text style={styles.mealItems}>
                      {meal.items?.join(", ")}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {plan.ai_generated ? (
              <Text style={styles.aiBadge}>AI Generated</Text>
            ) : null}
          </View>
        ))}
        {!loading && dietPlans.length === 0 && (
          <Text style={styles.helper}>
            No diet plans yet. Create plans from the web dashboard.
          </Text>
        )}
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  helper: { color: colors.muted, fontSize: 12 },
  error: { color: "#dc2626", fontSize: 12 },
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#f8fbf9",
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  meta: { fontSize: 13, color: colors.muted },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  label: { fontSize: 12, color: colors.muted },
  meals: { marginTop: 8, gap: 6 },
  mealRow: { gap: 2 },
  mealTime: { fontSize: 12, fontWeight: "600", color: colors.brand },
  mealName: { fontSize: 13, fontWeight: "600", color: colors.text },
  mealItems: { fontSize: 12, color: colors.muted },
  aiBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.brand + "20",
    color: colors.brand,
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
});
