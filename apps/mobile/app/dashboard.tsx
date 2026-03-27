import { demoDashboardSnapshot } from "@gymflow/lib";
import { api } from "@gymflow/services";
import { Link } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

export default function DashboardScreen() {
  const loadDashboard = useCallback(() => api.getDashboard(), []);
  const { data, loading } = useAsyncResource(
    loadDashboard,
    demoDashboardSnapshot,
  );
  const metrics = data.metrics;

  return (
    <Screen>
      <MobileCard
        title="Dashboard"
        subtitle="Quick gym health snapshot from the mobile app."
      >
        <Text style={styles.helper}>
          {loading ? "Syncing from backend..." : "Live API with demo fallback."}
        </Text>
        <View style={styles.grid}>
          {[
            ["Members", String(metrics.totalMembers)],
            ["Revenue", `Rs. ${metrics.monthlyRevenue}`],
            ["Attendance", String(metrics.todayAttendance)],
            ["Expiring", String(metrics.expiringSubscriptions)],
          ].map(([label, value]) => (
            <View key={label} style={styles.metric}>
              <Text style={styles.metricLabel}>{label}</Text>
              <Text style={styles.metricValue}>{value}</Text>
            </View>
          ))}
        </View>
      </MobileCard>

      <MobileCard
        title="Quick access"
        subtitle="Move between the front-desk workflows."
      >
        {[
          ["/members", "Members"],
          ["/attendance", "Attendance"],
          ["/payments", "Payments"],
          ["/workouts", "Workouts"],
          ["/diet-plans", "Diet Plans"],
          ["/profile", "Profile"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={
              href as
                | "/members"
                | "/attendance"
                | "/payments"
                | "/workouts"
                | "/diet-plans"
                | "/profile"
            }
            asChild
          >
            <Pressable style={styles.linkRow}>
              <Text style={styles.linkText}>{label}</Text>
            </Pressable>
          </Link>
        ))}
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metric: {
    width: "47%",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#f8fbf9",
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  metricValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  linkRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  helper: {
    color: colors.muted,
    fontSize: 12,
  },
});
