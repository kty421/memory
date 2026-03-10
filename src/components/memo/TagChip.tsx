import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "@/theme";

type TagChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export const TagChip = ({ label, selected, onPress }: TagChipProps) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}>
    <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.card
  },
  selected: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft
  },
  pressed: {
    opacity: 0.8
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.xs,
    fontWeight: "600"
  },
  selectedLabel: {
    color: theme.colors.accent
  }
});
