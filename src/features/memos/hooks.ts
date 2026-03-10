import { useCallback, useEffect, useMemo, useState } from "react";
import { repository } from "@/storage/repository";
import { Memo, Reminder } from "@/types";
import { generateId } from "@/utils/id";
import { nowIso } from "@/utils/date";
import { getMemosForPerson, getRecentMemos, getTalkTopics } from "@/features/memos/utils";
import { sortByUpdatedDesc } from "@/utils/sort";
import { scheduleReminderNotification } from "@/lib/notifications";

export type CreateMemoInput = {
  personId: string;
  content: string;
  tags: string[];
  reminderDate?: string;
};

export const useMemos = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const all = await repository.getMemos();
    setMemos(sortByUpdatedDesc(all));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addMemo = useCallback(
    async (input: CreateMemoInput): Promise<Memo> => {
      const content = input.content.trim();
      if (!content) {
        throw new Error("メモ内容は必須です");
      }

      const timestamp = nowIso();
      const memo: Memo = {
        id: generateId(),
        personId: input.personId,
        content,
        tags: input.tags,
        memoDate: timestamp,
        reminderDate: input.reminderDate,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const nextMemos = sortByUpdatedDesc([memo, ...memos]);
      await repository.saveMemos(nextMemos);
      setMemos(nextMemos);

      const people = await repository.getPeople();
      const nextPeople = people.map((person) =>
        person.id === input.personId ? { ...person, updatedAt: timestamp } : person
      );
      await repository.savePeople(nextPeople);

      if (input.reminderDate) {
        const notificationId = await scheduleReminderNotification(
          "会話の伏線メモ",
          content,
          input.reminderDate
        );
        const reminder: Reminder = {
          id: generateId(),
          personId: input.personId,
          memoId: memo.id,
          title: content.length > 26 ? `${content.slice(0, 26)}...` : content,
          remindAt: input.reminderDate,
          isDone: false,
          createdAt: timestamp,
          updatedAt: timestamp,
          notificationId: notificationId ?? undefined
        };
        const reminders = await repository.getReminders();
        await repository.saveReminders([...reminders, reminder]);
      }

      return memo;
    },
    [memos]
  );

  const recentMemos = useMemo(() => getRecentMemos(memos, 5), [memos]);

  return {
    memos,
    loading,
    load,
    addMemo,
    getMemosForPerson: (personId: string) => getMemosForPerson(memos, personId),
    getTalkTopicsForPerson: (personId: string) => getTalkTopics(getMemosForPerson(memos, personId), 3),
    recentMemos
  };
};
