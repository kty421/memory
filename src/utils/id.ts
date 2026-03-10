export const generateId = (): string => {
  const random = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}-${random}`;
};
