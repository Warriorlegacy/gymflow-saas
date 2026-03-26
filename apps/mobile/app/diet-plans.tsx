import { demoDietPlans, demoMembers, demoTrainers } from "@gymflow/lib";
import { api } from "@gymflow/services";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

const memberMap = new Map(demoMembers.map((m) => [m.id, m.full_name]));
const trainerMap = new Map(demoTrainers.map((t) => [t.id, t.full_name]));

export default function DietPlansScreen() {
  const loadDietPlans = useCallback(() => api.getDietPlans(), []);
  const { data: dietPlans, loading } = useAsyncResource(
    loadDietPlans,
    demoDietPlans,
  );

  return (
    <Screen>
      <MobileCard
        title="Diet Plans"
        subtitle="Nutrition plans assigned to gym members."
      >
        <Text style={styles.helper}>
          {loading ? "Loading diet plans..." : "Live API with demo fallback."}
        </Text>
        {dietPlans.map((plan) => (
          <View key={plan.id} style={styles.card}>
            <Text style={styles.title}>{plan.title}</Text>
            {plan.objective ? (
              <Text style={styles.meta}>Objective: {plan.objective}</Text>
            ) : null}
            <View style={styles.row}>
              <Text style={styles.label}>
                Member:{" "}
                {plan.member_id ? (memberMap.get(plan.member_id) ?? "-") : "-"}
              </Text>
              <Text style={styles.label}>
                Trainer:{" "}
                {plan.trainer_id
                  ? (trainerMap.get(plan.trainer_id) ?? "-")
                  : "-"}
              </Text>
            </View>
            {plan.meals?.length ? (
              <View style={styles.meals}>
                {plan.meals.map((meal, i) => (
                  <View key={i} style={styles.mealRow}>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                    <Text style={styles.mealName}>{meal.meal}</Text>
                    <Text style={styles.mealItems}>
                      {meal.items.join(", ")}
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
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  helper: { color: colors.muted, fontSize: 12 },
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
