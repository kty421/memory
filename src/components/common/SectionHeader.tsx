import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const SectionHeader = ({ title, actionLabel, onActionPress }: SectionHeaderProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {actionLabel && onActionPress ? (
      <Pressable onPress={onActionPress}>
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.size.lg,
    fontWeight: "700"
  },
  action: {
    color: theme.colors.accent,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  }
});
