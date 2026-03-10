import { StyleSheet, TextInput, View } from "react-native";
import { theme } from "@/theme";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export const SearchBar = ({ value, onChangeText, placeholder = "検索" }: SearchBarProps) => (
  <View style={styles.container}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textMuted}
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.input}
      returnKeyType="search"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  input: {
    color: theme.colors.text,
    fontSize: theme.typography.size.md
  }
});
