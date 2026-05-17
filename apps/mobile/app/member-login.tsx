import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
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
import { Screen } from "../src/components/screen";
import { MobileCard } from "../src/components/mobile-card";
import { colors } from "../src/lib/theme";

export default function MemberLoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(
    "Sign in with your gym member credentials.",
  );
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = useCallback(async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter phone and password.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL =
        process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000";

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/api/member/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, password }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const result = await response.json();
      if (result.success) {
        setStatus("Login successful!");
        router.push({
          pathname: "/member-dashboard",
          params: {
            memberId: result.member.id,
            memberName: result.member.name,
            memberPhone: result.member.phone,
            gymId: result.member.gymId,
            token: result.token,
          },
        });
      } else {
        setStatus(result.error || "Login failed");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setStatus("Connection timeout. Please try again.");
      } else {
        setStatus("Connection error. Please check your internet.");
      }
    }
    setLoading(false);
  }, [phone, password, router]);

  return (
    <Screen>
      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>GymFlow</Text>
        <Text style={styles.headerSubtitle}>Member Portal</Text>
      </View>

      <MobileCard
        title="Member Login"
        subtitle="Sign in to view your gym activity"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.muted}
            keyboardType="phone-pad"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            ref={passwordRef}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <Text style={styles.status}>{status}</Text>
      </MobileCard>

      <Pressable onPress={() => router.push("/")}>
        <Text style={styles.switchText}>
          Are you a gym owner?{" "}
          <Text style={styles.switchLink}>Owner Login</Text>
        </Text>
      </Pressable>

      <MobileCard title="Member Features" subtitle="What you can do:">
        {[
          { icon: "✓", text: "View your membership status" },
          { icon: "✓", text: "Check attendance records" },
          { icon: "✓", text: "Track subscription details" },
          { icon: "✓", text: "Check-in via mobile" },
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
    marginBottom: 12,
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
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  status: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  switchText: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 14,
    marginVertical: 8,
  },
  switchLink: {
    color: colors.brand,
    fontWeight: "700",
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
