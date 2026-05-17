import { api } from "@gymflow/services";
import { Link } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

const emptyDashboard = {
  gym: { name: "Your Gym" } as any,
  metrics: {
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    expiringSubscriptions: 0,
    todayAttendance: 0,
    trainers: 0,
  },
  recentMembers: [] as any[],
  pendingPayments: [] as any[],
  expiringMembers: [] as any[],
};

export default function DashboardScreen() {
  const loadDashboard = useCallback(() => api.getDashboard(), []);
  const { data, loading, error } = useAsyncResource(
    loadDashboard,
    emptyDashboard,
  );
  const metrics = data.metrics;

  return (
    <Screen>
      <MobileCard
        title="Dashboard"
        subtitle="Quick gym health snapshot from the mobile app."
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <Text style={styles.helper}>
            {loading ? "Syncing from backend..." : "Live data from your gym."}
          </Text>
        )}
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
  errorContainer: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "500",
  },
});
