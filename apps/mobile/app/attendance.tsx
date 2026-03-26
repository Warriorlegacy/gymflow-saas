import { demoAttendance, demoMembers } from "@gymflow/lib";
import { api } from "@gymflow/services";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileCard } from "../src/components/mobile-card";
import { Screen } from "../src/components/screen";
import { useAsyncResource } from "../src/hooks/use-async-resource";
import { colors } from "../src/lib/theme";

const memberMap = new Map(demoMembers.map((member) => [member.id, member.full_name]));

export default function AttendanceScreen() {
  const loadAttendance = useCallback(() => api.getAttendance(), []);
  const { data: attendance, loading } = useAsyncResource(loadAttendance, demoAttendance);

  return (
    <Screen>
      <MobileCard title="Attendance" subtitle="Check-ins synced from mobile, QR, or desk.">
        <Text style={styles.helper}>{loading ? "Loading attendance..." : "Live API with demo fallback."}</Text>
        {attendance.map((record) => (
          <View key={record.id} style={styles.row}>
            <Text style={styles.name}>{memberMap.get(record.member_id) ?? record.member_id}</Text>
            <Text style={styles.meta}>{record.attended_on}</Text>
          </View>
        ))}
      </MobileCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
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
  helper: {
    color: colors.muted,
    fontSize: 12
  }
});
