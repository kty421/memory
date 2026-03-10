import { useCallback, useMemo } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { AppHeader } from "@/components/common/AppHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { PersonSummary } from "@/components/people/PersonSummary";
import { MemoCard } from "@/components/memo/MemoCard";
import { ReminderCard } from "@/components/reminder/ReminderCard";
import { usePeople } from "@/features/people/hooks";
import { useMemos } from "@/features/memos/hooks";
import { useReminders } from "@/features/reminders/hooks";
import { addDaysIso } from "@/utils/date";
import { theme } from "@/theme";

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const { people, getPersonById, load: loadPeople, loading: peopleLoading } = usePeople();
  const { memos, getMemosForPerson, getTalkTopicsForPerson, load: loadMemos, loading: memosLoading } = useMemos();
  const { addReminder, getRemindersForPerson, toggleReminderDone, load: loadReminders, loading: remindersLoading } =
    useReminders();

  useFocusEffect(
    useCallback(() => {
      void Promise.all([loadPeople(), loadMemos(), loadReminders()]);
    }, [loadPeople, loadMemos, loadReminders])
  );

  const person = useMemo(() => (personId ? getPersonById(personId) : undefined), [getPersonById, people, personId]);
  const personMemos = useMemo(() => (personId ? getMemosForPerson(personId) : []), [memos, getMemosForPerson, personId]);
  const talkTopics = useMemo(
    () => (personId ? getTalkTopicsForPerson(personId) : []),
    [memos, getTalkTopicsForPerson, personId]
  );
  const personReminders = useMemo(
    () => (personId ? getRemindersForPerson(personId).slice(0, 3) : []),
    [getRemindersForPerson, personId]
  );

  const loading = peopleLoading || memosLoading || remindersLoading;

  const handleCreatePersonReminder = async (days: number) => {
    if (!personId || !person) {
      return;
    }
    await addReminder({
      personId,
      title: `${person.name}さんに近況を聞く`,
      remindAt: addDaysIso(days)
    });
    Alert.alert("追加しました", `${days}日後のリマインドを設定しました`);
    await loadReminders();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!person || !personId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <EmptyState
            title="人物が見つかりませんでした"
            description="一覧に戻って別の人物を選択してください。"
            actionLabel="人物一覧へ"
            onActionPress={() => router.replace("/people")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="人物詳細"
          subtitle="次回の会話で使える伏線をまとめて確認"
          actionLabel="＋メモ"
          onActionPress={() => router.push({ pathname: "/modals/quick-memo", params: { personId } })}
        />

        <PersonSummary person={person} />

        <PrimaryButton label="この人へのクイックメモ追加" onPress={() => router.push({ pathname: "/modals/quick-memo", params: { personId } })} />

        <View style={styles.section}>
          <SectionHeader title="リマインド設定" actionLabel="一覧へ" onActionPress={() => router.push("/reminders")} />
          <View style={styles.reminderActions}>
            {[
              { label: "明日", days: 1 },
              { label: "3日後", days: 3 },
              { label: "1週間後", days: 7 }
            ].map((preset) => (
              <Pressable
                key={preset.label}
                onPress={() => void handleCreatePersonReminder(preset.days)}
                style={({ pressed }) => [styles.quickReminder, pressed && styles.quickReminderPressed]}
              >
                <Text style={styles.quickReminderText}>{preset.label}</Text>
              </Pressable>
            ))}
          </View>

          {personReminders.length > 0 ? (
            <View style={styles.stack}>
              {personReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  memoContent={reminder.memoId ? personMemos.find((memo) => memo.id === reminder.memoId)?.content : undefined}
                  onToggleDone={() => void toggleReminderDone(reminder.id)}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              title="リマインドはまだありません"
              description="次回触れたい話題があるときに、日付だけ軽く設定できます。"
            />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="次回使えそうな話題" />
          {talkTopics.length === 0 ? (
            <EmptyState
              title="メモがまだありません"
              description="1行メモでも十分です。雑に残して次回に活かしましょう。"
            />
          ) : (
            <View style={styles.stack}>
              {talkTopics.map((memo) => (
                <MemoCard key={memo.id} memo={memo} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="会話メモ一覧" />
          {personMemos.length === 0 ? (
            <EmptyState
              title="この人のメモがありません"
              description="右上の「+メモ」から最初の会話メモを追加してください。"
              actionLabel="メモ追加"
              onActionPress={() => router.push({ pathname: "/modals/quick-memo", params: { personId } })}
            />
          ) : (
            <View style={styles.stack}>
              {personMemos.map((memo) => (
                <MemoCard key={memo.id} memo={memo} />
              ))}
            </View>
          )}
        </View>
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
    gap: theme.spacing.xl
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  section: {
    gap: theme.spacing.md
  },
  reminderActions: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  quickReminder: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  quickReminderPressed: {
    opacity: 0.8
  },
  quickReminderText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  },
  stack: {
    gap: theme.spacing.md
  }
});
