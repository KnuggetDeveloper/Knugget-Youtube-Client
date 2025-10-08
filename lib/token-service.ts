// lib/token-service.ts
"use client";

import { ApiResponse } from "@/types/auth";

export interface TokenStatus {
  inputTokensRemaining: number;
  outputTokensRemaining: number;
  tokenResetDate: string | null;
  hasEnoughTokens: boolean;
  isTokensExhausted: boolean;
}

export interface TokenAvailabilityRequest {
  inputTokens: number;
  outputTokens: number;
}

class TokenService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem("knugget_access_token");

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get current token status for the authenticated user
   */
  async getTokenStatus(): Promise<ApiResponse<TokenStatus>> {
    try {
      return await this.makeRequest<TokenStatus>("/token/status");
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get token status",
      };
    }
  }

  /**
   * Check if user has enough tokens for an operation
   */
  async checkTokenAvailability(
    request: TokenAvailabilityRequest
  ): Promise<ApiResponse<TokenStatus>> {
    try {
      return await this.makeRequest<TokenStatus>("/token/check-availability", {
        method: "POST",
        body: JSON.stringify(request),
      });
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check token availability",
      };
    }
  }

  /**
   * Format token numbers for display
   */
  formatTokenCount(tokens: number): string {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  }

  /**
   * Calculate token usage percentage
   */
  calculateUsagePercentage(remaining: number, total: number): number {
    if (total === 0) return 0;
    const used = total - remaining;
    return Math.round((used / total) * 100);
  }

  /**
   * Get token reset date formatted for display
   */
  formatResetDate(resetDate: string | null): string {
    if (!resetDate) return "Not set";

    const date = new Date(resetDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Overdue";
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Get token status color based on remaining percentage
   */
  getTokenStatusColor(remaining: number, total: number): string {
    const percentage = (remaining / total) * 100;

    if (percentage > 50) {
      return "text-green-600 dark:text-green-400";
    } else if (percentage > 20) {
      return "text-yellow-600 dark:text-yellow-400";
    } else {
      return "text-red-600 dark:text-red-400";
    }
  }

  /**
   * Get progress bar color based on remaining percentage
   */
  getProgressBarColor(remaining: number, total: number): string {
    const percentage = (remaining / total) * 100;

    if (percentage > 50) {
      return "bg-green-500";
    } else if (percentage > 20) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  }
}

export const tokenService = new TokenService();
