import { api } from "@gymflow/services";
import { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, Text, View, ListRenderItem } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

interface Member {
  id: string;
  full_name: string;
  phone: string;
  status: string;
}

const MemberItem = ({ member }: { member: Member }) => (
  <View style={styles.row}>
    <View>
      <Text style={styles.name}>{member.full_name}</Text>
      <Text style={styles.meta}>{member.phone}</Text>
    </View>
    <Text style={styles.status}>{member.status}</Text>
  </View>
);

const MemoizedMemberItem = MemberItem;

const keyExtractor = (item: Member) => item.id;

export default function MembersScreen() {
  const loadMembers = useCallback(() => api.getMembers(), []);
  const {
    data: members,
    loading,
    error,
  } = useAsyncResource(loadMembers, [] as Member[], "members");

  const renderItem: ListRenderItem<Member> = useCallback(
    ({ item }) => <MemoizedMemberItem member={item} />,
    [],
  );

  const emptyComponent = useMemo(
    () =>
      !loading && members.length === 0 ? (
        <Text style={styles.helper}>
          No members yet. Add members from the web dashboard.
        </Text>
      ) : null,
    [loading, members.length],
  );

  return (
    <Screen>
      <MobileCard
        title="Members"
        subtitle="Front-desk friendly member list for quick lookups."
      >
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text style={styles.helper}>
            {loading
              ? "Loading member roster..."
              : `${members.length} members loaded`}
          </Text>
        )}
        <FlatList
          data={members}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={emptyComponent}
          scrollEnabled={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
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
    borderBottomColor: colors.border,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    color: colors.muted,
  },
  status: {
    color: colors.brand,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  helper: {
    color: colors.muted,
    fontSize: 12,
  },
  error: {
    color: "#dc2626",
    fontSize: 12,
  },
});
