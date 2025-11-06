"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/firebase-auth-context";
import { summaryService } from "@/lib/summary-service";
import {
  Summary,
  SummaryQueryParams,
  SaveSummaryRequest,
  UpdateSummaryRequest,
} from "@/types/summary";

// Query Keys
export const summaryKeys = {
  all: ["summaries"] as const,
  lists: () => [...summaryKeys.all, "list"] as const,
  list: (params: SummaryQueryParams) =>
    [...summaryKeys.lists(), params] as const,
  details: () => [...summaryKeys.all, "detail"] as const,
  detail: (id: string) => [...summaryKeys.details(), id] as const,
  stats: () => [...summaryKeys.all, "stats"] as const,
  tags: (limit: number) => [...summaryKeys.all, "tags", limit] as const,
};

/**
 * Hook for fetching summaries list with React Query caching
 */
export function useSummariesQuery(params: SummaryQueryParams = {}) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: summaryKeys.list(params),
    queryFn: async () => {
      const response = await summaryService.getSummaries(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch summaries");
    },
    enabled: isAuthenticated, // Only run query if user is authenticated
    staleTime: 3 * 60 * 1000, // 3 minutes - summaries don't change often
  });
}

/**
 * Hook for fetching a single summary with React Query caching
 */
export function useSummaryQuery(id?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: summaryKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Summary ID is required");
      const response = await summaryService.getSummaryById(id);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch summary");
    },
    enabled: isAuthenticated && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes - individual summaries are stable
  });
}

/**
 * Hook for summary statistics with React Query caching
 */
export function useSummaryStatsQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: summaryKeys.stats(),
    queryFn: async () => {
      const response = await summaryService.getSummaryStats();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch stats");
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for popular tags with React Query caching
 */
export function usePopularTagsQuery(limit: number = 20) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: summaryKeys.tags(limit),
    queryFn: async () => {
      const response = await summaryService.getPopularTags(limit);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch tags");
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes - tags don't change often
  });
}

/**
 * Mutation hook for saving a summary
 */
export function useSaveSummaryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SaveSummaryRequest) => {
      const response = await summaryService.saveSummary(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to save summary");
    },
    onSuccess: (newSummary) => {
      // Invalidate summaries list to refetch
      queryClient.invalidateQueries({ queryKey: summaryKeys.lists() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: summaryKeys.stats() });

      // Optimistically add to cache
      queryClient.setQueryData(summaryKeys.detail(newSummary.id), newSummary);

      // Sync with extension
      summaryService.syncWithExtension();
    },
  });
}

/**
 * Mutation hook for updating a summary
 */
export function useUpdateSummaryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSummaryRequest;
    }) => {
      const response = await summaryService.updateSummary(id, data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to update summary");
    },
    onSuccess: (updatedSummary) => {
      // Invalidate summaries list
      queryClient.invalidateQueries({ queryKey: summaryKeys.lists() });

      // Update the specific summary in cache
      queryClient.setQueryData(
        summaryKeys.detail(updatedSummary.id),
        updatedSummary
      );

      // Sync with extension
      summaryService.syncWithExtension();
    },
  });
}

/**
 * Mutation hook for deleting a summary
 */
export function useDeleteSummaryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await summaryService.deleteSummary(id);
      if (response.success) {
        return id;
      }
      throw new Error(response.error || "Failed to delete summary");
    },
    onSuccess: (deletedId) => {
      // Invalidate summaries list
      queryClient.invalidateQueries({ queryKey: summaryKeys.lists() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: summaryKeys.stats() });

      // Remove from cache
      queryClient.removeQueries({ queryKey: summaryKeys.detail(deletedId) });

      // Sync with extension
      summaryService.syncWithExtension();
    },
  });
}

/**
 * Mutation hook for bulk deleting summaries
 */
export function useBulkDeleteSummariesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await summaryService.bulkDeleteSummaries(ids);
      if (response.success) {
        return ids;
      }
      throw new Error(response.error || "Failed to delete summaries");
    },
    onSuccess: (deletedIds) => {
      // Invalidate summaries list
      queryClient.invalidateQueries({ queryKey: summaryKeys.lists() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: summaryKeys.stats() });

      // Remove all deleted summaries from cache
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: summaryKeys.detail(id) });
      });

      // Sync with extension
      summaryService.syncWithExtension();
    },
  });
}
