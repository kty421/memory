import { Memo } from "@/types";
import { sortByUpdatedDesc } from "@/utils/sort";

export const getMemosForPerson = (memos: Memo[], personId: string): Memo[] =>
  sortByUpdatedDesc(memos.filter((memo) => memo.personId === personId));

export const getRecentMemos = (memos: Memo[], limit = 5): Memo[] =>
  sortByUpdatedDesc(memos).slice(0, limit);

export const getTalkTopics = (memos: Memo[], limit = 3): Memo[] => {
  const uniqueByContent: Memo[] = [];
  const seen = new Set<string>();

  for (const memo of sortByUpdatedDesc(memos)) {
    if (seen.has(memo.content)) {
      continue;
    }
    seen.add(memo.content);
    uniqueByContent.push(memo);
    if (uniqueByContent.length >= limit) {
      break;
    }
  }

  return uniqueByContent;
};
