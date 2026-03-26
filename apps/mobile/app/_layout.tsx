import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#0f172a",
        contentStyle: { backgroundColor: "#f4f7f5" }
      }}
    />
  );
}

