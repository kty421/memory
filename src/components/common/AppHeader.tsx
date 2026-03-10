import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const AppHeader = ({ title, subtitle, actionLabel, onActionPress }: AppHeaderProps) => (
  <View style={styles.container}>
    <View style={styles.titleWrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {actionLabel && onActionPress ? (
      <Pressable onPress={onActionPress} style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  titleWrap: {
    flex: 1,
    gap: theme.spacing.xs
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.size.xxl,
    fontWeight: "700"
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.sm
  },
  action: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accentSoft
  },
  actionPressed: {
    opacity: 0.75
  },
  actionText: {
    color: theme.colors.accent,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  }
});
