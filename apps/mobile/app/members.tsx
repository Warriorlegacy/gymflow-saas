import { demoMembers } from "@gymflow/lib";
import { api } from "@gymflow/services";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

export default function MembersScreen() {
  const loadMembers = useCallback(() => api.getMembers(), []);
  const { data: members, loading } = useAsyncResource(loadMembers, demoMembers);

  return (
    <Screen>
      <MobileCard title="Members" subtitle="Front-desk friendly member list for quick lookups.">
        <Text style={styles.helper}>{loading ? "Loading member roster..." : "Live API with demo fallback."}</Text>
        {members.map((member) => (
          <View key={member.id} style={styles.row}>
            <View>
              <Text style={styles.name}>{member.full_name}</Text>
              <Text style={styles.meta}>{member.phone}</Text>
            </View>
            <Text style={styles.status}>{member.status}</Text>
          </View>
        ))}
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text
  },
  meta: {
    color: colors.muted
  },
  status: {
    color: colors.brand,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  helper: {
    color: colors.muted,
    fontSize: 12
  }
});
