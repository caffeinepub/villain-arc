import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CardCategory,
  JournalEntryInput,
  ReviewQuality,
} from "../backend.d.ts";
import { useBackend } from "../lib/backend-client";

// Cases
export function useListCases() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCase(id: bigint | null) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["case", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCase(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSearchCases(
  name: string | null,
  category: string | null,
  yearFrom: bigint | null,
  yearTo: bigint | null,
  minSeverity: bigint | null,
) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: [
      "cases",
      "search",
      name,
      category,
      yearFrom?.toString(),
      yearTo?.toString(),
      minSeverity?.toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchCases(name, category, yearFrom, yearTo, minSeverity);
    },
    enabled: !!actor && !isFetching,
  });
}

// Theories
export function useListTheories() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["theories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTheories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTheory(id: string | null) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["theory", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getTheory(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useMatchTheories() {
  const { actor } = useBackend();
  return useMutation({
    mutationFn: async (scenario: string) => {
      if (!actor) return [];
      return actor.matchTheories(scenario);
    },
  });
}

// Flashcards
export function useListCards() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListCardsByCategory(category: CardCategory | null) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["cards", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.listCardsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetDueCards() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["cards", "due"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDueCards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReviewCard() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cardId,
      quality,
    }: { cardId: bigint; quality: ReviewQuality }) => {
      if (!actor) return;
      return actor.reviewCard(cardId, quality);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", "due"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}

export function useGetSessionSummary() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSessionSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

// Journal
export function useListJournalEntries(page = 0n, pageSize = 20n) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["journal", "list", page.toString(), pageSize.toString()],
    queryFn: async () => {
      if (!actor)
        return { page: 0n, totalCount: 0n, pageSize: 20n, entries: [] };
      return actor.listJournalEntries(page, pageSize);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJournalEntry(id: bigint | null) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["journal", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getJournalEntry(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSearchJournalEntries(
  fromDate: bigint | null,
  toDate: bigint | null,
  tag: string | null,
  keyword: string | null,
) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: [
      "journal",
      "search",
      fromDate?.toString(),
      toDate?.toString(),
      tag,
      keyword,
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchJournalEntries(fromDate, toDate, tag, keyword);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateJournalEntry() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: JournalEntryInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createJournalEntry(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["milestone"] });
    },
  });
}

export function useUpdateJournalEntry() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: JournalEntryInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateJournalEntry(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useDeleteJournalEntry() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteJournalEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["milestone"] });
    },
  });
}

export function useGetJournalMilestone() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["milestone"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getJournalMilestone();
    },
    enabled: !!actor && !isFetching,
  });
}
