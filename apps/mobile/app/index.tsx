import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>GymFlow</Text>
        <Text style={styles.headerSubtitle}>The Modern Gym Stack</Text>
      </View>

      <MobileCard
        title="Welcome back"
        subtitle="Sign in to your gym control room"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>OWNER EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="owner@gymflow.demo"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

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
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={styles.outlineButton}
          onPress={handleDemoAccess}
          disabled={loading}
        >
          <Text style={styles.outlineText}>Demo Tenant Access</Text>
        </Pressable>

        <Text style={styles.status}>{status}</Text>
      </MobileCard>

      <MobileCard title="Sellable SaaS" subtitle="Why GymFlow is market-ready:">
        {[
          { icon: "✓", text: "Zero infrastructure costs to run" },
          { icon: "✓", text: "Multi-tenant data isolation" },
          { icon: "✓", text: "AI-powered member benefits" },
          { icon: "✓", text: "WhatsApp automation baked-in" },
          { icon: "✓", text: "Cross-platform mobile & web" },
        ].map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>{feature.icon}</Text>
            </View>
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  logoText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.muted,
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.brand,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#fff",
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
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  status: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  featureIconText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.brand,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
});
