import { useCallback, useEffect, useMemo, useState } from "react";
import { repository } from "@/storage/repository";
import { Person } from "@/types";
import { filterPeopleByQuery } from "@/features/people/utils";
import { generateId } from "@/utils/id";
import { nowIso } from "@/utils/date";
import { sortByUpdatedDesc } from "@/utils/sort";

export type CreatePersonInput = {
  name: string;
  nickname?: string;
};

export const usePeople = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const all = await repository.getPeople();
    setPeople(sortByUpdatedDesc(all));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addPerson = useCallback(
    async (input: CreatePersonInput): Promise<Person> => {
      const name = input.name.trim();
      if (!name) {
        throw new Error("名前は必須です");
      }

      const timestamp = nowIso();
      const person: Person = {
        id: generateId(),
        name,
        nickname: input.nickname?.trim() || undefined,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const next = sortByUpdatedDesc([person, ...people]);
      await repository.savePeople(next);
      setPeople(next);
      return person;
    },
    [people]
  );

  const touchPerson = useCallback(
    async (personId: string): Promise<void> => {
      const timestamp = nowIso();
      const next = people.map((person) =>
        person.id === personId ? { ...person, updatedAt: timestamp } : person
      );
      await repository.savePeople(next);
      setPeople(sortByUpdatedDesc(next));
    },
    [people]
  );

  const getPersonById = useCallback(
    (id: string): Person | undefined => people.find((person) => person.id === id),
    [people]
  );

  const searchPeople = useCallback(
    (query: string): Person[] => filterPeopleByQuery(people, query),
    [people]
  );

  const recentPeople = useMemo(() => people.slice(0, 5), [people]);

  return {
    people,
    loading,
    load,
    addPerson,
    touchPerson,
    getPersonById,
    searchPeople,
    recentPeople
  };
};
