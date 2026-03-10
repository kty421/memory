import { Pressable, StyleSheet, Text, View } from "react-native";
import { Person } from "@/types";
import { formatDateLabel } from "@/utils/date";
import { theme } from "@/theme";

type PersonCardProps = {
  person: Person;
  memoCount?: number;
  onPress?: () => void;
};

export const PersonCard = ({ person, memoCount, onPress }: PersonCardProps) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <View style={styles.row}>
      <View style={styles.nameWrap}>
        <Text style={styles.name}>{person.name}</Text>
        {person.nickname ? <Text style={styles.nickname}>{person.nickname}</Text> : null}
      </View>
      {typeof memoCount === "number" ? (
        <View style={styles.countChip}>
          <Text style={styles.countText}>{memoCount}件</Text>
        </View>
      ) : null}
    </View>
    <Text style={styles.updated}>最終更新 {formatDateLabel(person.updatedAt)}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    ...theme.shadow.card
  },
  pressed: {
    opacity: 0.88
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md
  },
  nameWrap: {
    gap: theme.spacing.xs,
    flex: 1
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.size.lg,
    fontWeight: "700"
  },
  nickname: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.sm
  },
  countChip: {
    backgroundColor: theme.colors.cardMuted,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs
  },
  countText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs,
    fontWeight: "600"
  },
  updated: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs
  }
});
