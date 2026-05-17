import { api } from "@gymflow/services";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

const emptyProfile = {
  gym: null,
  user: null,
};

export default function ProfileScreen() {
  const loadProfile = useCallback(async () => {
    try {
      const dashboard = await api.getDashboard();
      return {
        gym: dashboard.gym,
        user: null,
      };
    } catch {
      return emptyProfile;
    }
  }, []);

  const { data, loading, error } = useAsyncResource(loadProfile, emptyProfile);

  if (loading) {
    return (
      <Screen>
        <MobileCard title="Profile" subtitle="Loading your account details...">
          <ActivityIndicator size="large" color={colors.brand} />
        </MobileCard>
      </Screen>
    );
  }

  return (
    <Screen>
      <MobileCard
        title="Profile"
        subtitle="Your account details and gym information."
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Gym Name</Text>
              <Text style={styles.value}>{data.gym?.name || "-"}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>City</Text>
              <Text style={styles.value}>{data.gym?.city || "-"}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>State</Text>
              <Text style={styles.value}>{data.gym?.state || "-"}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Subscription</Text>
              <Text style={styles.value}>
                {data.gym?.subscription_tier || "starter"} -{" "}
                {data.gym?.subscription_status || "trial"}
              </Text>
            </View>
          </>
        )}
      </MobileCard>

      <MobileCard title="Settings" subtitle="App preferences.">
        <Pressable style={styles.linkRow}>
          <Text style={styles.linkText}>Notifications</Text>
        </Pressable>
        <Pressable style={styles.linkRow}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Pressable>
        <Pressable style={styles.linkRow}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </Pressable>
        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
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
