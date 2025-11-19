"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/firebase-auth-context";
import { profileService } from "@/lib/profile-service";
import { UpdateProfileRequest, UpgradePlanRequest } from "./profile-hooks";

// Query Keys
export const profileKeys = {
  all: ["profile"] as const,
  profile: () => [...profileKeys.all, "data"] as const,
  stats: () => [...profileKeys.all, "stats"] as const,
};

/**
 * Hook for fetching user profile with React Query caching
 */
export function useProfileQuery() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: profileKeys.profile(),
    queryFn: async () => {
      const response = await profileService.getProfile();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to fetch profile");
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes - profile doesn't change often
    initialData: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          plan: user.plan,
          subscriptionId: user.subscriptionId,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          videosProcessedThisMonth: user.videosProcessedThisMonth,
          videoResetDate: user.videoResetDate,
          inputTokensRemaining: user.inputTokensRemaining,
          outputTokensRemaining: user.outputTokensRemaining,
          tokenResetDate: user.tokenResetDate,
        }
      : undefined,
  });
}

/**
 * Hook for fetching user statistics with React Query caching
 */
export function useUserStatsQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: profileKeys.stats(),
    queryFn: async () => {
      const response = await profileService.getUserStats();
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
 * Mutation hook for updating profile
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { updateProfile: updateAuthProfile } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await profileService.updateProfile(data);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to update profile");
    },
    onSuccess: async (updatedProfile, variables) => {
      // Update profile in cache
      queryClient.setQueryData(profileKeys.profile(), updatedProfile);

      // Update auth context
      await updateAuthProfile(variables);
    },
  });
}

/**
 * Mutation hook for upgrading plan
 */
export function useUpgradePlanMutation() {
  const queryClient = useQueryClient();
  const { refreshAuth } = useAuth();

  return useMutation({
    mutationFn: async (data: UpgradePlanRequest) => {
      const response = await profileService.upgradePlan(data);
      if (response.success) {
        return data;
      }
      throw new Error(response.error || "Failed to upgrade plan");
    },
    onSuccess: async () => {
      // Refresh auth to get updated user data
      await refreshAuth();

      // Invalidate profile and stats
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

/**
 * Mutation hook for deleting account
 */
export function useDeleteAccountMutation() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async (confirmationEmail: string) => {
      const response = await profileService.deleteAccount({
        confirmationEmail,
      });
      if (response.success) {
        return true;
      }
      throw new Error(response.error || "Failed to delete account");
    },
    onSuccess: async () => {
      // Log out user after successful deletion
      await logout();
    },
  });
}
