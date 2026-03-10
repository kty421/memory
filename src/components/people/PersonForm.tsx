import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { theme } from "@/theme";

type PersonFormProps = {
  initialName?: string;
  initialNickname?: string;
  onSubmit: (input: { name: string; nickname?: string }) => Promise<void>;
};

export const PersonForm = ({ initialName = "", initialNickname = "", onSubmit }: PersonFormProps) => {
  const [name, setName] = useState(initialName);
  const [nickname, setNickname] = useState(initialNickname);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("入力エラー", "名前を入力してください");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), nickname: nickname.trim() || undefined });
    } catch {
      Alert.alert("保存に失敗しました", "時間をおいて再度お試しください");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>名前</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="例: 田中 拓海"
          placeholderTextColor={theme.colors.textMuted}
          autoFocus
        />
      </View>

      <View style={styles.fieldWrap}>
        <Text style={styles.label}>ニックネーム（任意）</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
          placeholder="例: たくみ"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>

      <PrimaryButton label={submitting ? "保存中..." : "保存"} onPress={handleSubmit} disabled={submitting} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg
  },
  fieldWrap: {
    gap: theme.spacing.sm
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.size.sm,
    fontWeight: "600"
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.typography.size.md
  }
});
