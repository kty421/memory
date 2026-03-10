import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { AppHeader } from "@/components/common/AppHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ReminderCard } from "@/components/reminder/ReminderCard";
import { usePeople } from "@/features/people/hooks";
import { useMemos } from "@/features/memos/hooks";
import { useReminders } from "@/features/reminders/hooks";
import { theme } from "@/theme";

export default function RemindersScreen() {
  const router = useRouter();
  const [showDone, setShowDone] = useState(false);
  const { people, load: loadPeople, loading: peopleLoading } = usePeople();
  const { memos, load: loadMemos, loading: memosLoading } = useMemos();
  const { reminders, upcomingReminders, load: loadReminders, loading: remindersLoading, toggleReminderDone } =
    useReminders();

  useFocusEffect(
    useCallback(() => {
      void Promise.all([loadPeople(), loadMemos(), loadReminders()]);
    }, [loadPeople, loadMemos, loadReminders])
  );

  const personMap = useMemo(() => new Map(people.map((person) => [person.id, person.name])), [people]);
  const memoMap = useMemo(() => new Map(memos.map((memo) => [memo.id, memo.content])), [memos]);
  const targetReminders = showDone ? reminders : upcomingReminders;
  const loading = peopleLoading || memosLoading || remindersLoading;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader title="リマインド" subtitle="近い予定から順に確認" actionLabel="+メモ" onActionPress={() => router.push("/modals/quick-memo")} />

        <View style={styles.toggleWrap}>
          <Pressable onPress={() => setShowDone((prev) => !prev)} style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}>
            <Text style={styles.toggleText}>{showDone ? "未完了のみ表示" : "完了済みも表示"}</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.colors.accent} />
          </View>
        ) : targetReminders.length === 0 ? (
          <EmptyState
            title="表示できるリマインドがありません"
            description="メモ追加時に日付を入れると、ここに自動で表示されます。"
            actionLabel="クイックメモを追加"
            onActionPress={() => router.push("/modals/quick-memo")}
          />
        ) : (
          <View style={styles.stack}>
            {targetReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                personName={personMap.get(reminder.personId)}
                memoContent={reminder.memoId ? memoMap.get(reminder.memoId) : undefined}
                onToggleDone={() => void toggleReminderDone(reminder.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg
  },
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md
  },
  toggleWrap: {
    alignItems: "flex-start"
  },
  toggle: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cardMuted,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  togglePressed: {
    opacity: 0.8
  },
  toggleText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  },
  loadingWrap: {
    paddingVertical: theme.spacing.xl
  },
  stack: {
    gap: theme.spacing.md
  }
});
