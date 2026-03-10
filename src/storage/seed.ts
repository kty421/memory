import { addDays, subDays } from "date-fns";
import { Memo, Person, Reminder } from "@/types";

const toIso = (date: Date): string => date.toISOString();

export const seedPeople = (): Person[] => {
  const now = new Date();
  return [
    {
      id: "p1",
      name: "佐藤 玲奈",
      nickname: "れな",
      createdAt: toIso(subDays(now, 20)),
      updatedAt: toIso(subDays(now, 1))
    },
    {
      id: "p2",
      name: "田中 拓海",
      createdAt: toIso(subDays(now, 45)),
      updatedAt: toIso(subDays(now, 2))
    },
    {
      id: "p3",
      name: "山本 翔",
      nickname: "しょう",
      createdAt: toIso(subDays(now, 15)),
      updatedAt: toIso(subDays(now, 4))
    },
    {
      id: "p4",
      name: "伊藤 美咲",
      createdAt: toIso(subDays(now, 10)),
      updatedAt: toIso(subDays(now, 6))
    }
  ];
};

export const seedMemos = (): Memo[] => {
  const now = new Date();
  return [
    {
      id: "m1",
      personId: "p1",
      content: "就活でコンサル業界も見ていると言っていた",
      tags: ["就活", "仕事"],
      memoDate: toIso(subDays(now, 1)),
      reminderDate: toIso(addDays(now, 3)),
      createdAt: toIso(subDays(now, 1)),
      updatedAt: toIso(subDays(now, 1))
    },
    {
      id: "m2",
      personId: "p1",
      content: "誕生日が今月末らしい",
      tags: ["誕生日"],
      memoDate: toIso(subDays(now, 3)),
      createdAt: toIso(subDays(now, 3)),
      updatedAt: toIso(subDays(now, 3))
    },
    {
      id: "m3",
      personId: "p2",
      content: "来月ヨーロッパ旅行に行く予定",
      tags: ["旅行"],
      memoDate: toIso(subDays(now, 2)),
      reminderDate: toIso(addDays(now, 14)),
      createdAt: toIso(subDays(now, 2)),
      updatedAt: toIso(subDays(now, 2))
    },
    {
      id: "m4",
      personId: "p3",
      content: "修論前で研究がかなり忙しい",
      tags: ["研究"],
      memoDate: toIso(subDays(now, 4)),
      createdAt: toIso(subDays(now, 4)),
      updatedAt: toIso(subDays(now, 4))
    },
    {
      id: "m5",
      personId: "p4",
      content: "最近カフェでバイトを始めた",
      tags: ["バイト"],
      memoDate: toIso(subDays(now, 6)),
      createdAt: toIso(subDays(now, 6)),
      updatedAt: toIso(subDays(now, 6))
    }
  ];
};

export const seedReminders = (): Reminder[] => {
  const now = new Date();
  return [
    {
      id: "r1",
      personId: "p1",
      memoId: "m1",
      title: "就活状況を聞く",
      remindAt: toIso(addDays(now, 3)),
      isDone: false,
      createdAt: toIso(subDays(now, 1)),
      updatedAt: toIso(subDays(now, 1))
    },
    {
      id: "r2",
      personId: "p2",
      memoId: "m3",
      title: "旅行準備どうか聞く",
      remindAt: toIso(addDays(now, 10)),
      isDone: false,
      createdAt: toIso(subDays(now, 2)),
      updatedAt: toIso(subDays(now, 2))
    },
    {
      id: "r3",
      personId: "p4",
      title: "新しいバイト先の話を振る",
      remindAt: toIso(addDays(now, 1)),
      isDone: false,
      createdAt: toIso(subDays(now, 6)),
      updatedAt: toIso(subDays(now, 6))
    }
  ];
};
