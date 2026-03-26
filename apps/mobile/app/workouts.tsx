import { demoMembers, demoTrainers, demoWorkouts } from "@gymflow/lib";
import { api } from "@gymflow/services";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

const memberMap = new Map(demoMembers.map((m) => [m.id, m.full_name]));
const trainerMap = new Map(demoTrainers.map((t) => [t.id, t.full_name]));

export default function WorkoutsScreen() {
  const loadWorkouts = useCallback(() => api.getWorkouts(), []);
  const { data: workouts, loading } = useAsyncResource(
    loadWorkouts,
    demoWorkouts,
  );

  return (
    <Screen>
      <MobileCard
        title="Workouts"
        subtitle="Assigned workout plans for gym members."
      >
        <Text style={styles.helper}>
          {loading ? "Loading workouts..." : "Live API with demo fallback."}
        </Text>
        {workouts.map((workout) => (
          <View key={workout.id} style={styles.card}>
            <Text style={styles.title}>{workout.title}</Text>
            {workout.goal ? (
              <Text style={styles.meta}>Goal: {workout.goal}</Text>
            ) : null}
            <View style={styles.row}>
              <Text style={styles.label}>
                Member:{" "}
                {workout.member_id
                  ? (memberMap.get(workout.member_id) ?? "-")
                  : "-"}
              </Text>
              <Text style={styles.label}>
                Trainer:{" "}
                {workout.trainer_id
                  ? (trainerMap.get(workout.trainer_id) ?? "-")
                  : "-"}
              </Text>
            </View>
            {workout.schedule?.length ? (
              <View style={styles.schedule}>
                {workout.schedule.map((day, i) => (
                  <View key={i} style={styles.dayRow}>
                    <Text style={styles.dayName}>{day.day}</Text>
                    <Text style={styles.dayFocus}>{day.focus}</Text>
                    <Text style={styles.dayExercises}>
                      {day.exercises.join(", ")}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {workout.ai_generated ? (
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
  schedule: { marginTop: 8, gap: 6 },
  dayRow: { gap: 2 },
  dayName: { fontSize: 13, fontWeight: "600", color: colors.text },
  dayFocus: { fontSize: 12, color: colors.brand },
  dayExercises: { fontSize: 12, color: colors.muted },
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
