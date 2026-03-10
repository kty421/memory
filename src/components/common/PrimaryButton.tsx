import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { theme } from "@/theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export const PrimaryButton = ({ label, onPress, disabled, style }: PrimaryButtonProps) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      disabled && styles.buttonDisabled,
      pressed && !disabled && styles.buttonPressed,
      style
    ]}
  >
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonPressed: {
    opacity: 0.85
  },
  label: {
    color: "#FFFFFF",
    fontSize: theme.typography.size.md,
    fontWeight: "600"
  }
});
