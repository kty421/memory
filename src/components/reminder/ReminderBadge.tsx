import { StyleSheet, Text, View } from "react-native";
import { parseISO } from "date-fns";
import { getDueLabel } from "@/utils/date";
import { theme } from "@/theme";

type ReminderBadgeProps = {
  remindAt: string;
  isDone?: boolean;
};

export const ReminderBadge = ({ remindAt, isDone }: ReminderBadgeProps) => {
  const isOverdue = parseISO(remindAt).getTime() < Date.now() && !isDone;

  return (
    <View style={[styles.badge, isDone && styles.done, isOverdue && styles.overdue]}>
      <Text style={[styles.text, isDone && styles.doneText, isOverdue && styles.overdueText]}>
        {isDone ? "完了" : getDueLabel(remindAt)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accentSoft,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs
  },
  text: {
    color: theme.colors.accent,
    fontSize: theme.typography.size.xs,
    fontWeight: "700"
  },
  done: {
    backgroundColor: theme.colors.cardMuted
  },
  doneText: {
    color: theme.colors.textMuted
  },
  overdue: {
    backgroundColor: "#FDECEC"
  },
  overdueText: {
    color: theme.colors.danger
  }
});
