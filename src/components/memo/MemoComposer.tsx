import { StyleSheet, Text, TextInput, View } from "react-native";
import { PRESET_TAGS } from "@/constants/tags";
import { TagChip } from "@/components/memo/TagChip";
import { theme } from "@/theme";

type MemoComposerProps = {
  content: string;
  onChangeContent: (text: string) => void;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  reminderInput: string;
  onChangeReminderInput: (value: string) => void;
};

export const MemoComposer = ({
  content,
  onChangeContent,
  selectedTags,
  onToggleTag,
  reminderInput,
  onChangeReminderInput
}: MemoComposerProps) => (
  <View style={styles.container}>
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>メモ</Text>
      <TextInput
        value={content}
        onChangeText={onChangeContent}
        multiline
        placeholder="例: 来月旅行に行くらしい"
        placeholderTextColor={theme.colors.textMuted}
        style={[styles.input, styles.memoInput]}
      />
    </View>

    <View style={styles.fieldWrap}>
      <Text style={styles.label}>タグ</Text>
      <View style={styles.tags}>
        {PRESET_TAGS.map((tag) => (
          <TagChip key={tag} label={tag} selected={selectedTags.includes(tag)} onPress={() => onToggleTag(tag)} />
        ))}
      </View>
    </View>

    <View style={styles.fieldWrap}>
      <Text style={styles.label}>リマインド日（任意）</Text>
      <TextInput
        value={reminderInput}
        onChangeText={onChangeReminderInput}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg
  },
  fieldWrap: {
    gap: theme.spacing.sm
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.typography.size.md
  },
  memoInput: {
    minHeight: 110,
    textAlignVertical: "top"
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  }
});
