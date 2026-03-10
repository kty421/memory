import { Reminder } from "@/types";
import { sortByRemindAtAsc } from "@/utils/sort";

export const getUpcomingReminders = (reminders: Reminder[], includeDone = false): Reminder[] => {
  const filtered = includeDone ? reminders : reminders.filter((reminder) => !reminder.isDone);
  return sortByRemindAtAsc(filtered);
};

export const getRemindersForPerson = (reminders: Reminder[], personId: string): Reminder[] =>
  sortByRemindAtAsc(reminders.filter((reminder) => reminder.personId === personId));
