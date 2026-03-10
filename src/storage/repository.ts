import AsyncStorage from "@react-native-async-storage/async-storage";
import { seedMemos, seedPeople, seedReminders } from "@/storage/seed";
import { STORAGE_KEYS } from "@/storage/keys";
import { Memo, Person, Reminder } from "@/types";

const parseArray = <T,>(raw: string | null): T[] => {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readCollection = async <T,>(key: string): Promise<T[]> => {
  const raw = await AsyncStorage.getItem(key);
  return parseArray<T>(raw);
};

const writeCollection = async <T,>(key: string, value: T[]): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

let bootstrapPromise: Promise<void> | null = null;

const seedIfNeeded = async (): Promise<void> => {
  const seeded = await AsyncStorage.getItem(STORAGE_KEYS.seeded);
  if (seeded === "1") {
    return;
  }

  await Promise.all([
    writeCollection<Person>(STORAGE_KEYS.people, seedPeople()),
    writeCollection<Memo>(STORAGE_KEYS.memos, seedMemos()),
    writeCollection<Reminder>(STORAGE_KEYS.reminders, seedReminders()),
    AsyncStorage.setItem(STORAGE_KEYS.seeded, "1")
  ]);
};

const ensureBootstrapped = async (): Promise<void> => {
  if (!bootstrapPromise) {
    bootstrapPromise = seedIfNeeded();
  }
  await bootstrapPromise;
};

export const repository = {
  bootstrap: ensureBootstrapped,
  getPeople: async (): Promise<Person[]> => {
    await ensureBootstrapped();
    return readCollection<Person>(STORAGE_KEYS.people);
  },
  savePeople: async (people: Person[]): Promise<void> => {
    await writeCollection<Person>(STORAGE_KEYS.people, people);
  },
  getMemos: async (): Promise<Memo[]> => {
    await ensureBootstrapped();
    return readCollection<Memo>(STORAGE_KEYS.memos);
  },
  saveMemos: async (memos: Memo[]): Promise<void> => {
    await writeCollection<Memo>(STORAGE_KEYS.memos, memos);
  },
  getReminders: async (): Promise<Reminder[]> => {
    await ensureBootstrapped();
    return readCollection<Reminder>(STORAGE_KEYS.reminders);
  },
  saveReminders: async (reminders: Reminder[]): Promise<void> => {
    await writeCollection<Reminder>(STORAGE_KEYS.reminders, reminders);
  }
};
