import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { theme } from "@/theme";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const EmptyState = ({ title, description, actionLabel, onActionPress }: EmptyStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {actionLabel && onActionPress ? (
      <PrimaryButton label={actionLabel} onPress={onActionPress} style={styles.button} />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.size.lg,
    fontWeight: "700"
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.sm,
    textAlign: "center",
    lineHeight: theme.typography.lineHeight.sm
  },
  button: {
    width: "100%",
    marginTop: theme.spacing.md
  }
});
