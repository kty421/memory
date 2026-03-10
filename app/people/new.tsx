import { SafeAreaView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { PersonForm } from "@/components/people/PersonForm";
import { usePeople } from "@/features/people/hooks";
import { theme } from "@/theme";

export default function NewPersonScreen() {
  const router = useRouter();
  const { addPerson } = usePeople();

  const handleSubmit = async (input: { name: string; nickname?: string }) => {
    const person = await addPerson(input);
    router.replace(`/people/${person.id}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <PersonForm onSubmit={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md
  }
});
