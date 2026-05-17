import { api } from "@gymflow/services";
import type { AttendanceRecord } from "@gymflow/lib";
import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View, ListRenderItem } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

const keyExtractor = (item: AttendanceRecord) => item.id;

export default function AttendanceScreen() {
  const loadAttendance = useCallback(() => api.getAttendance(), []);
  const {
    data: attendance,
    loading,
    error,
  } = useAsyncResource(loadAttendance, [] as AttendanceRecord[], "attendance");

  const renderItem: ListRenderItem<AttendanceRecord> = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        <Text style={styles.name}>{item.member_id}</Text>
        <Text style={styles.meta}>{item.attended_on}</Text>
      </View>
    ),
    [],
  );

  return (
    <Screen>
      <MobileCard
        title="Attendance"
        subtitle="Check-ins synced from mobile, QR, or desk."
      >
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text style={styles.helper}>
            {loading
              ? "Loading attendance..."
              : `${attendance.length} records loaded`}
          </Text>
        )}
        <FlatList
          data={attendance}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.helper}>No attendance records yet.</Text>
            ) : null
          }
        />
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
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
  helper: {
    color: colors.muted,
    fontSize: 12,
  },
  error: {
    color: "#dc2626",
    fontSize: 12,
  },
});
