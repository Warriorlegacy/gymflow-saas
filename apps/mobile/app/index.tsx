import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { sendMagicLink } from "@gymflow/services";
import { Screen } from "../src/components/screen";
import { MobileCard } from "../src/components/mobile-card";
import { colors } from "../src/lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@gymflow.demo");
  const [status, setStatus] = useState(
    "Use Supabase magic link or enter the demo tenant.",
  );
  const [loading, setLoading] = useState(false);

  async function handleMagicLink() {
    if (!email) {
      Alert.alert("Error", "Please enter an email address.");
      return;
    }
    setLoading(true);
    const result = await sendMagicLink(email);
    setStatus(result.message);
    setLoading(false);
  }

  function handleDemoAccess() {
    setLoading(true);
    setStatus("Entering demo tenant...");
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 500);
  }

  return (
    <Screen>
      <MobileCard
        title="GymFlow Mobile"
        subtitle="Manage your gym from anywhere."
      >
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="owner@gymflow.demo"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Pressable
          style={styles.button}
          onPress={handleMagicLink}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Magic Link</Text>
          )}
        </Pressable>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
        <Pressable
          style={styles.outlineButton}
          onPress={handleDemoAccess}
          disabled={loading}
        >
          <Text style={styles.outlineText}>Enter Demo Tenant</Text>
        </Pressable>
        <Text style={styles.status}>{status}</Text>
      </MobileCard>

      <MobileCard title="Features" subtitle="What you can do with GymFlow:">
        {[
          "Track member attendance",
          "Manage payments & dues",
          "View workout & diet plans",
          "AI-powered coaching tools",
          "WhatsApp reminders",
        ].map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  outlineText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.muted,
    fontSize: 13,
  },
  status: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
  },
});
