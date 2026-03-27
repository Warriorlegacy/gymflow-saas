import { demoUser, demoGym } from "@gymflow/lib";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { colors } from "../src/lib/theme";

export default function ProfileScreen() {
  return (
    <Screen>
      <MobileCard
        title="Profile"
        subtitle="Your account details and gym information."
      >
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{demoUser.full_name}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{demoUser.email}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{demoUser.role}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{demoUser.phone ?? "-"}</Text>
        </View>
      </MobileCard>

      <MobileCard title="Gym Info" subtitle="Current gym tenant details.">
        <View style={styles.section}>
          <Text style={styles.label}>Gym Name</Text>
          <Text style={styles.value}>{demoGym.name}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>{demoGym.city}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>State</Text>
          <Text style={styles.value}>{demoGym.state}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Subscription</Text>
          <Text style={styles.value}>
            {demoGym.subscription_tier} - {demoGym.subscription_status}
          </Text>
        </View>
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
});
