import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

interface MemberDashboardData {
  success: boolean;
  member: {
    name: string;
    phone: string;
    email: string | null;
    status: string;
  };
  subscription: {
    planName: string;
    status: string;
    endDate: string;
    daysLeft: number;
  } | null;
  attendance: {
    todayCheckedIn: boolean;
    totalThisMonth: number;
    streak: number;
  };
}

const emptyDashboard: MemberDashboardData = {
  success: false,
  member: { name: "", phone: "", email: null, status: "" },
  subscription: null,
  attendance: { todayCheckedIn: false, totalThisMonth: 0, streak: 0 },
};

export default function MemberDashboardScreen() {
  const params = useLocalSearchParams<{
    memberId: string;
    memberName: string;
    memberPhone: string;
    gymId: string;
    token: string;
  }>();
  const router = useRouter();
  const [checkingIn, setCheckingIn] = useState(false);

  const loadDashboard = useCallback(async () => {
    const API_BASE_URL =
      process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/member/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${params.token}`,
        },
        signal: controller.signal,
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to load dashboard");
      }
      return data as MemberDashboardData;
    } finally {
      clearTimeout(timeout);
    }
  }, [params.token]);

  const { data, loading, error, refetch } = useAsyncResource(
    loadDashboard,
    emptyDashboard,
    `member-dashboard-${params.memberId}`,
  );

  const handleCheckIn = useCallback(async () => {
    if (!params.memberId) {
      Alert.alert("Error", "Member ID not found");
      return;
    }
    setCheckingIn(true);
    try {
      const API_BASE_URL =
        process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000";

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/api/member/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: params.memberId }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const result = await response.json();
      if (result.success) {
        Alert.alert("Success", "Check-in successful!");
        refetch?.();
      } else {
        Alert.alert("Info", result.error || "Check-in failed");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        Alert.alert("Error", "Connection timeout. Please try again.");
      } else {
        Alert.alert("Error", "Connection error. Please try again.");
      }
    }
    setCheckingIn(false);
  }, [params.memberId, refetch]);

  const handleLogout = useCallback(() => {
    router.replace("/member-login");
  }, [router]);

  return (
    <Screen>
      <MobileCard
        title="Member Dashboard"
        subtitle={`Welcome, ${data.member.name || params.memberName || "Member"}`}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={styles.loadingText}>Loading your data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => refetch?.()}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{data.member.name}</Text>
              <Text style={styles.memberPhone}>{data.member.phone}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{data.member.status}</Text>
              </View>
            </View>
          </>
        )}
      </MobileCard>

      {!loading && !error && (
        <>
          <MobileCard title="Attendance" subtitle="Your gym visit tracking">
            <View style={styles.grid}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Today</Text>
                <Text
                  style={[
                    styles.metricValue,
                    data.attendance.todayCheckedIn
                      ? styles.checkedIn
                      : styles.notCheckedIn,
                  ]}
                >
                  {data.attendance.todayCheckedIn ? "Checked In" : "Not Yet"}
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>This Month</Text>
                <Text style={styles.metricValue}>
                  {data.attendance.totalThisMonth} days
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.checkInButton,
                data.attendance.todayCheckedIn && styles.checkInDisabled,
                pressed &&
                  !data.attendance.todayCheckedIn &&
                  styles.buttonPressed,
              ]}
              onPress={handleCheckIn}
              disabled={checkingIn || data.attendance.todayCheckedIn}
            >
              {checkingIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.checkInText}>
                  {data.attendance.todayCheckedIn
                    ? "Already Checked In"
                    : "Check In Now"}
                </Text>
              )}
            </Pressable>
          </MobileCard>

          <MobileCard title="Subscription" subtitle="Your membership details">
            {data.subscription ? (
              <>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>
                    {data.subscription.planName}
                  </Text>
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>
                      {data.subscription.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.planDetails}>
                  <View style={styles.planDetail}>
                    <Text style={styles.planDetailLabel}>Expires</Text>
                    <Text style={styles.planDetailValue}>
                      {new Date(data.subscription.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.planDetail}>
                    <Text style={styles.planDetailLabel}>Days Left</Text>
                    <Text
                      style={[
                        styles.planDetailValue,
                        data.subscription.daysLeft <= 7 &&
                          styles.expiringWarning,
                      ]}
                    >
                      {data.subscription.daysLeft} days
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.noPlan}>No active subscription found.</Text>
            )}
          </MobileCard>

          <MobileCard title="Quick Actions" subtitle="Manage your gym activity">
            <Pressable
              style={({ pressed }) => [
                styles.actionRow,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => refetch?.()}
            >
              <Text style={styles.actionText}>Refresh Data</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </MobileCard>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: colors.brand,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
  memberInfo: {
    alignItems: "center",
    paddingVertical: 8,
  },
  memberName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  memberPhone: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 8,
    backgroundColor: colors.brandSoft,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: colors.brand,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  metric: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  checkedIn: {
    color: "#16a34a",
  },
  notCheckedIn: {
    color: "#f59e0b",
  },
  checkInButton: {
    backgroundColor: colors.brand,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  checkInDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  checkInText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  planInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  planBadge: {
    backgroundColor: colors.brandSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    color: colors.brand,
    fontWeight: "700",
    fontSize: 11,
    textTransform: "uppercase",
  },
  planDetails: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  planDetail: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#f8fbf9",
  },
  planDetailLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  planDetailValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  expiringWarning: {
    color: "#f59e0b",
  },
  noPlan: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  actionRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.brand,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
  },
});
