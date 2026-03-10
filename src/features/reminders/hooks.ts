import { useCallback, useEffect, useMemo, useState } from "react";
import { repository } from "@/storage/repository";
import { Reminder } from "@/types";
import { generateId } from "@/utils/id";
import { nowIso } from "@/utils/date";
import { getUpcomingReminders, getRemindersForPerson } from "@/features/reminders/utils";
import { cancelScheduledNotification, scheduleReminderNotification } from "@/lib/notifications";

export type CreateReminderInput = {
  personId: string;
  title: string;
  remindAt: string;
  memoId?: string;
};

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const all = await repository.getReminders();
    setReminders(getUpcomingReminders(all, true));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addReminder = useCallback(
    async (input: CreateReminderInput): Promise<Reminder> => {
      const title = input.title.trim();
      if (!title) {
        throw new Error("リマインドタイトルは必須です");
      }

      const timestamp = nowIso();
      const notificationId = await scheduleReminderNotification(
        "会話の伏線メモ",
        title,
        input.remindAt
      );

      const reminder: Reminder = {
        id: generateId(),
        personId: input.personId,
        memoId: input.memoId,
        title,
        remindAt: input.remindAt,
        isDone: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        notificationId: notificationId ?? undefined
      };

      const next = [...reminders, reminder];
      await repository.saveReminders(next);
      setReminders(getUpcomingReminders(next, true));
      return reminder;
    },
    [reminders]
  );

  const toggleReminderDone = useCallback(
    async (id: string): Promise<void> => {
      const timestamp = nowIso();
      const next = await Promise.all(
        reminders.map(async (reminder) => {
          if (reminder.id !== id) {
            return reminder;
          }
          const updated = { ...reminder, isDone: !reminder.isDone, updatedAt: timestamp };
          if (updated.isDone) {
            await cancelScheduledNotification(reminder.notificationId);
          }
          return updated;
        })
      );

      await repository.saveReminders(next);
      setReminders(getUpcomingReminders(next, true));
    },
    [reminders]
  );

  const upcomingReminders = useMemo(() => getUpcomingReminders(reminders), [reminders]);

  return {
    reminders,
    loading,
    load,
    addReminder,
    toggleReminderDone,
    upcomingReminders,
    getRemindersForPerson: (personId: string) => getRemindersForPerson(reminders, personId)
  };
};
