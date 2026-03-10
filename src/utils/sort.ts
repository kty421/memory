type HasUpdatedAt = { updatedAt: string };
type HasRemindAt = { remindAt: string };

export const sortByUpdatedDesc = <T extends HasUpdatedAt>(items: T[]): T[] =>
  [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export const sortByRemindAtAsc = <T extends HasRemindAt>(items: T[]): T[] =>
  [...items].sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime());
