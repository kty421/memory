import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { repository } from "@/storage/repository";
import { configureNotifications } from "@/lib/notifications";
import { theme } from "@/theme";

export default function RootLayout() {
  useEffect(() => {
    void repository.bootstrap();
    void configureNotifications();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bg },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text,
          contentStyle: { backgroundColor: theme.colors.bg }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="people/index" options={{ title: "人物一覧" }} />
        <Stack.Screen name="people/new" options={{ title: "人物を追加" }} />
        <Stack.Screen name="people/[id]" options={{ title: "人物詳細" }} />
        <Stack.Screen name="reminders/index" options={{ title: "リマインド" }} />
        <Stack.Screen
          name="modals/quick-memo"
          options={{
            title: "クイックメモ",
            presentation: "modal"
          }}
        />
      </Stack>
    </>
  );
}
