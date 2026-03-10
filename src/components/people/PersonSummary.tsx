import { StyleSheet, Text, View } from "react-native";
import { Person } from "@/types";
import { theme } from "@/theme";

type PersonSummaryProps = {
  person: Person;
};

export const PersonSummary = ({ person }: PersonSummaryProps) => (
  <View style={styles.container}>
    <Text style={styles.name}>{person.name}</Text>
    {person.nickname ? <Text style={styles.nickname}>ニックネーム: {person.nickname}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.size.xl,
    fontWeight: "700"
  },
  nickname: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.size.sm
  }
});
