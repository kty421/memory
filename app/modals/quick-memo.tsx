import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { addDays, format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppHeader } from "@/components/common/AppHeader";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { MemoComposer } from "@/components/memo/MemoComposer";
import { usePeople } from "@/features/people/hooks";
import { useMemos } from "@/features/memos/hooks";
import { parseDateInputToIso } from "@/utils/date";
import { theme } from "@/theme";

export default function QuickMemoModal() {
  const router = useRouter();
  const { personId } = useLocalSearchParams<{ personId?: string }>();
  const preselectedPersonId = Array.isArray(personId) ? personId[0] : personId;

  const { people, load: loadPeople, addPerson } = usePeople();
  const { addMemo } = useMemos();

  const [selectedPersonId, setSelectedPersonId] = useState<string | undefined>(preselectedPersonId);
  const [createNewPerson, setCreateNewPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonNickname, setNewPersonNickname] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reminderInput, setReminderInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadPeople();
  }, [loadPeople]);

  useEffect(() => {
    if (preselectedPersonId) {
      setSelectedPersonId(preselectedPersonId);
      setCreateNewPerson(false);
      return;
    }
    if (!selectedPersonId && people.length > 0 && !createNewPerson) {
      setSelectedPersonId(people[0].id);
    }
  }, [preselectedPersonId, selectedPersonId, people, createNewPerson]);

  const selectedPersonName = useMemo(
    () => people.find((person) => person.id === selectedPersonId)?.name,
    [people, selectedPersonId]
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((value) => value !== tag) : [...prev, tag]));
  };

  const applyReminderPreset = (days: number) => {
    const next = format(addDays(new Date(), days), "yyyy-MM-dd");
    setReminderInput(next);
  };

  const handleSave = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      Alert.alert("入力エラー", "メモ内容を入力してください");
      return;
    }

    setSubmitting(true);
    try {
      let targetPersonId = selectedPersonId;

      if (createNewPerson) {
        if (!newPersonName.trim()) {
          Alert.alert("入力エラー", "新規人物の名前を入力してください");
          setSubmitting(false);
          return;
        }
        const person = await addPerson({
          name: newPersonName.trim(),
          nickname: newPersonNickname.trim() || undefined
        });
        targetPersonId = person.id;
      }

      if (!targetPersonId) {
        Alert.alert("入力エラー", "人物を選択してください");
        setSubmitting(false);
        return;
      }

      const reminderIso = parseDateInputToIso(reminderInput);
      if (reminderInput.trim() && !reminderIso) {
        Alert.alert("日付形式エラー", "リマインド日は YYYY-MM-DD 形式で入力してください");
        setSubmitting(false);
        return;
      }

      await addMemo({
        personId: targetPersonId,
        content: trimmedContent,
        tags: selectedTags,
        reminderDate: reminderIso ?? undefined
      });

      router.back();
    } catch {
      Alert.alert("保存に失敗しました", "時間をおいて再度お試しください");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <AppHeader
            title="クイックメモ"
            subtitle={selectedPersonName ? `相手: ${selectedPersonName}` : "人物を選んで1行メモ"}
          />

          <View style={styles.section}>
            <Text style={styles.label}>人物</Text>
            <View style={styles.personList}>
              {people.map((person) => (
                <Pressable
                  key={person.id}
                  onPress={() => {
                    setSelectedPersonId(person.id);
                    setCreateNewPerson(false);
                  }}
                  style={({ pressed }) => [
                    styles.personChip,
                    selectedPersonId === person.id && !createNewPerson && styles.personChipSelected,
                    pressed && styles.personChipPressed
                  ]}
                >
                  <Text
                    style={[
                      styles.personChipText,
                      selectedPersonId === person.id && !createNewPerson && styles.personChipTextSelected
                    ]}
                  >
                    {person.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => {
                setCreateNewPerson((prev) => !prev);
                setSelectedPersonId(undefined);
              }}
              style={({ pressed }) => [styles.newPersonToggle, pressed && styles.personChipPressed]}
            >
              <Text style={styles.newPersonToggleText}>{createNewPerson ? "既存人物から選ぶ" : "＋ 新しい人物を作成"}</Text>
            </Pressable>

            {createNewPerson ? (
              <View style={styles.newPersonForm}>
                <TextInput
                  value={newPersonName}
                  onChangeText={setNewPersonName}
                  placeholder="名前（必須）"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                />
                <TextInput
                  value={newPersonNickname}
                  onChangeText={setNewPersonNickname}
                  placeholder="ニックネーム（任意）"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                />
              </View>
            ) : null}
          </View>

          <MemoComposer
            content={content}
            onChangeContent={setContent}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            reminderInput={reminderInput}
            onChangeReminderInput={setReminderInput}
          />

          <View style={styles.presetRow}>
            <Text style={styles.presetLabel}>日付クイック設定</Text>
            <View style={styles.presetButtons}>
              {[
                { label: "明日", days: 1 },
                { label: "3日後", days: 3 },
                { label: "1週間後", days: 7 }
              ].map((preset) => (
                <Pressable
                  key={preset.label}
                  onPress={() => applyReminderPreset(preset.days)}
                  style={({ pressed }) => [styles.presetButton, pressed && styles.personChipPressed]}
                >
                  <Text style={styles.presetButtonText}>{preset.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <PrimaryButton label={submitting ? "保存中..." : "保存"} onPress={() => void handleSave()} disabled={submitting} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg
  },
  flex: {
    flex: 1
  },
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.xl
  },
  section: {
    gap: theme.spacing.sm
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  },
  personList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  personChip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  personChipSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft
  },
  personChipPressed: {
    opacity: 0.82
  },
  personChipText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  },
  personChipTextSelected: {
    color: theme.colors.accent
  },
  newPersonToggle: {
    alignSelf: "flex-start",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cardMuted
  },
  newPersonToggleText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  },
  newPersonForm: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm
  },
  input: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.typography.size.md
  },
  presetRow: {
    gap: theme.spacing.sm
  },
  presetLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs,
    fontWeight: "600"
  },
  presetButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  presetButton: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  presetButtonText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs,
    fontWeight: "600"
  }
});
