import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";

export function MobileCard({
  title,
  subtitle,
  children
}: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.accentBar} />
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#163b28",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    gap: 16
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12
  },
  accentBar: {
    width: 4,
    height: "100%",
    backgroundColor: colors.brand,
    borderRadius: 2,
    marginTop: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: colors.text
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.muted,
    marginTop: 2
  },
  body: {
    gap: 12
  }
});
