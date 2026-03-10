import { useCallback, useMemo } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { AppHeader } from "@/components/common/AppHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { PersonCard } from "@/components/people/PersonCard";
import { ReminderCard } from "@/components/reminder/ReminderCard";
import { usePeople } from "@/features/people/hooks";
import { useMemos } from "@/features/memos/hooks";
import { useReminders } from "@/features/reminders/hooks";
import { theme } from "@/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { people, recentPeople, load: loadPeople, loading: peopleLoading } = usePeople();
  const { memos, recentMemos, load: loadMemos, loading: memosLoading } = useMemos();
  const { upcomingReminders, load: loadReminders, loading: remindersLoading } = useReminders();

  useFocusEffect(
    useCallback(() => {
      void Promise.all([loadPeople(), loadMemos(), loadReminders()]);
    }, [loadPeople, loadMemos, loadReminders])
  );

  const memoCountByPerson = useMemo(() => {
    const map = new Map<string, number>();
    for (const memo of memos) {
      map.set(memo.personId, (map.get(memo.personId) ?? 0) + 1);
    }
    return map;
  }, [memos]);

  const personMap = useMemo(() => new Map(people.map((person) => [person.id, person])), [people]);
  const memoMap = useMemo(() => new Map(memos.map((memo) => [memo.id, memo])), [memos]);

  const loading = peopleLoading || memosLoading || remindersLoading;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="会話の伏線メモ"
          subtitle="次に誰へ何を話すか、すぐ思い出せる"
          actionLabel="＋メモ"
          onActionPress={() => router.push("/modals/quick-memo")}
        />

        <PrimaryButton label="クイックメモを追加" onPress={() => router.push("/modals/quick-memo")} />

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.colors.accent} />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <SectionHeader title="最近メモした人" actionLabel="一覧へ" onActionPress={() => router.push("/people")} />
              {recentPeople.length === 0 ? (
                <EmptyState
                  title="まず1人登録してみましょう"
                  description="会話の断片を1行メモするだけで、次回の会話がラクになります。"
                  actionLabel="人物を追加"
                  onActionPress={() => router.push("/people/new")}
                />
              ) : (
                <View style={styles.stack}>
                  {recentPeople.map((person) => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      memoCount={memoCountByPerson.get(person.id) ?? 0}
                      onPress={() => router.push(`/people/${person.id}`)}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <SectionHeader
                title="近いリマインド"
                actionLabel="すべて"
                onActionPress={() => router.push("/reminders")}
              />
              {upcomingReminders.length === 0 ? (
                <EmptyState
                  title="リマインドはまだありません"
                  description="メモに日付を添えると、ホームに優先度高く表示されます。"
                />
              ) : (
                <View style={styles.stack}>
                  {upcomingReminders.slice(0, 3).map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      personName={personMap.get(reminder.personId)?.name}
                      memoContent={reminder.memoId ? memoMap.get(reminder.memoId)?.content : undefined}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <SectionHeader title="直近で話題にしやすいメモ" />
              {recentMemos.length === 0 ? (
                <EmptyState
                  title="メモがまだありません"
                  description="まずは雑な1文で大丈夫です。思い出す材料だけ残しましょう。"
                />
              ) : (
                <View style={styles.stack}>
                  {recentMemos.slice(0, 4).map((memo) => (
                    <Pressable
                      key={memo.id}
                      onPress={() => router.push(`/people/${memo.personId}`)}
                      style={({ pressed }) => [styles.topicCard, pressed && styles.topicPressed]}
                    >
                      <Text style={styles.topicMeta}>{personMap.get(memo.personId)?.name ?? "不明な人物"}</Text>
                      <Text style={styles.topicContent}>{memo.content}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </>
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
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.xl
  },
  loadingWrap: {
    paddingVertical: theme.spacing.xxl
  },
  section: {
    gap: theme.spacing.sm
  },
  stack: {
    gap: theme.spacing.md
  },
  topicCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs
  },
  topicPressed: {
    opacity: 0.82
  },
  topicMeta: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs,
    fontWeight: "600"
  },
  topicContent: {
    color: theme.colors.text,
    fontSize: theme.typography.size.md,
    lineHeight: theme.typography.lineHeight.md
  }
});
