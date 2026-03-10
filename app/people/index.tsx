import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { AppHeader } from "@/components/common/AppHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { SearchBar } from "@/components/common/SearchBar";
import { PersonCard } from "@/components/people/PersonCard";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { usePeople } from "@/features/people/hooks";
import { useMemos } from "@/features/memos/hooks";
import { theme } from "@/theme";

export default function PeopleScreen() {
  const router = useRouter();
  const { people, searchPeople, load: loadPeople, loading: peopleLoading } = usePeople();
  const { memos, load: loadMemos, loading: memosLoading } = useMemos();
  const [query, setQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      void Promise.all([loadPeople(), loadMemos()]);
    }, [loadPeople, loadMemos])
  );

  const filteredPeople = useMemo(() => searchPeople(query), [query, searchPeople, people]);
  const memoCountByPerson = useMemo(() => {
    const map = new Map<string, number>();
    for (const memo of memos) {
      map.set(memo.personId, (map.get(memo.personId) ?? 0) + 1);
    }
    return map;
  }, [memos]);

  const loading = peopleLoading || memosLoading;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AppHeader title="人物一覧" subtitle="会話の伏線を相手ごとに管理" actionLabel="新規追加" onActionPress={() => router.push("/people/new")} />
        <SearchBar value={query} onChangeText={setQuery} placeholder="名前 / ニックネームで検索" />

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.colors.accent} />
          </View>
        ) : filteredPeople.length === 0 ? (
          <EmptyState
            title={query ? "該当する人物がいません" : "人物がまだいません"}
            description={
              query
                ? "検索ワードを変えるか、新しい人物を追加してください。"
                : "まずはよく話す相手を1人追加すると、クイックメモが使いやすくなります。"
            }
            actionLabel="人物を追加"
            onActionPress={() => router.push("/people/new")}
          />
        ) : (
          <FlatList
            data={filteredPeople}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PersonCard
                person={item}
                memoCount={memoCountByPerson.get(item.id) ?? 0}
                onPress={() => router.push(`/people/${item.id}`)}
              />
            )}
          />
        )}

        <PrimaryButton label="クイックメモを追加" onPress={() => router.push("/modals/quick-memo")} style={styles.quickButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md
  },
  list: {
    paddingBottom: 90,
    gap: theme.spacing.md
  },
  loadingWrap: {
    paddingVertical: theme.spacing.xl
  },
  quickButton: {
    position: "absolute",
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.lg
  }
});
