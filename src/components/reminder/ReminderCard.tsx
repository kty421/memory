import { Pressable, StyleSheet, Text, View } from "react-native";
import { Reminder } from "@/types";
import { formatDateTimeLabel } from "@/utils/date";
import { ReminderBadge } from "@/components/reminder/ReminderBadge";
import { theme } from "@/theme";

type ReminderCardProps = {
  reminder: Reminder;
  personName?: string;
  memoContent?: string;
  onToggleDone?: () => void;
};

export const ReminderCard = ({ reminder, personName, memoContent, onToggleDone }: ReminderCardProps) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.main}>
        <Text style={[styles.title, reminder.isDone && styles.doneText]}>{reminder.title}</Text>
        <Text style={styles.meta}>{formatDateTimeLabel(reminder.remindAt)}</Text>
        {personName ? <Text style={styles.meta}>相手: {personName}</Text> : null}
        {memoContent ? <Text style={styles.memo}>「{memoContent}」</Text> : null}
      </View>
      <View style={styles.right}>
        <ReminderBadge remindAt={reminder.remindAt} isDone={reminder.isDone} />
        {onToggleDone ? (
          <Pressable onPress={onToggleDone} style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}>
            <Text style={styles.toggleText}>{reminder.isDone ? "未完了に戻す" : "完了"}</Text>
          </Pressable>
        ) : null}
      </View>
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
    ...theme.shadow.card
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "space-between"
  },
  main: {
    flex: 1,
    gap: theme.spacing.xs
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.size.md,
    fontWeight: "700"
  },
  doneText: {
    textDecorationLine: "line-through",
    color: theme.colors.textMuted
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs
  },
  memo: {
    color: theme.colors.text,
    fontSize: theme.typography.size.sm
  },
  right: {
    alignItems: "flex-end",
    gap: theme.spacing.sm
  },
  toggle: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.cardMuted
  },
  togglePressed: {
    opacity: 0.8
  },
  toggleText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs,
    fontWeight: "600"
  }
});
