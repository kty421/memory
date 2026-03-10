import { StyleSheet, Text, View } from "react-native";
import { Memo } from "@/types";
import { formatDateLabel } from "@/utils/date";
import { TagChip } from "@/components/memo/TagChip";
import { ReminderBadge } from "@/components/reminder/ReminderBadge";
import { theme } from "@/theme";

type MemoCardProps = {
  memo: Memo;
};

export const MemoCard = ({ memo }: MemoCardProps) => (
  <View style={styles.card}>
    <Text style={styles.content}>{memo.content}</Text>
    <View style={styles.tags}>
      {memo.tags.map((tag) => (
        <TagChip key={tag} label={tag} />
      ))}
    </View>
    <View style={styles.footer}>
      <Text style={styles.date}>{formatDateLabel(memo.memoDate)}</Text>
      {memo.reminderDate ? <ReminderBadge remindAt={memo.reminderDate} /> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md
  },
  content: {
    color: theme.colors.text,
    fontSize: theme.typography.size.md,
    lineHeight: theme.typography.lineHeight.md
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  date: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs
  }
});
