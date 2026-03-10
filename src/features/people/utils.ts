import { Person } from "@/types";

export const filterPeopleByQuery = (people: Person[], query: string): Person[] => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return people;
  }
  return people.filter((person) =>
    `${person.name} ${person.nickname ?? ""}`.toLowerCase().includes(trimmed)
  );
};

export const getPersonDisplayName = (person: Person): string =>
  person.nickname ? `${person.name} (${person.nickname})` : person.name;
