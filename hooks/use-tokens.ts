"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/firebase-auth-context";
import {
  tokenService,
  TokenStatus,
  TokenAvailabilityRequest,
} from "@/lib/token-service";
import { formatError } from "@/lib/utils";

/**
 * Hook for managing token status and operations
 */
export function useTokens() {
  const { user, isAuthenticated } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenStatus = useCallback(async () => {
    if (!isAuthenticated || user?.plan !== "PREMIUM") {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await tokenService.getTokenStatus();

      if (response.success && response.data) {
        setTokenStatus(response.data);
      } else {
        setError(response.error || "Failed to fetch token status");
      }
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.plan]);

  const checkTokenAvailability = useCallback(
    async (request: TokenAvailabilityRequest): Promise<boolean> => {
      if (!isAuthenticated || user?.plan !== "PREMIUM") {
        return true; // Free users don't use tokens
      }

      try {
        setError(null);
        const response = await tokenService.checkTokenAvailability(request);

        if (response.success && response.data) {
          return response.data.hasEnoughTokens;
        } else {
          setError(response.error || "Failed to check token availability");
          return false;
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        return false;
      }
    },
    [isAuthenticated, user?.plan]
  );

  const refreshTokenStatus = useCallback(() => {
    fetchTokenStatus();
  }, [fetchTokenStatus]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchTokenStatus();
  }, [fetchTokenStatus]);

  // Auto-refresh every 5 minutes for premium users
  useEffect(() => {
    if (!isAuthenticated || user?.plan !== "PREMIUM") return;

    const interval = setInterval(
      () => {
        fetchTokenStatus();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.plan, fetchTokenStatus]);

  return {
    tokenStatus,
    isLoading,
    error,
    checkTokenAvailability,
    refreshTokenStatus,
    clearError,
    // Helper functions
    formatTokenCount: tokenService.formatTokenCount,
    formatResetDate: tokenService.formatResetDate,
    getTokenStatusColor: tokenService.getTokenStatusColor,
    getProgressBarColor: tokenService.getProgressBarColor,
  };
}

/**
 * Hook for token availability checking before operations
 */
export function useTokenAvailability() {
  const { checkTokenAvailability } = useTokens();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(
    async (inputTokens: number, outputTokens: number): Promise<boolean> => {
      setIsChecking(true);
      setError(null);

      try {
        const hasTokens = await checkTokenAvailability({
          inputTokens,
          outputTokens,
        });

        if (!hasTokens) {
          setError("Insufficient tokens for this operation");
        }

        return hasTokens;
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        return false;
      } finally {
        setIsChecking(false);
      }
    },
    [checkTokenAvailability]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    checkAvailability,
    isChecking,
    error,
    clearError,
  };
}
