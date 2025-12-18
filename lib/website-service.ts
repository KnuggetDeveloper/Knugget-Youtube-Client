/* eslint-disable @typescript-eslint/no-explicit-any */

import { getApiBaseUrl } from "@/lib/utils";
import { auth } from "@/lib/firebase";

// Website Article Types
export interface WebsiteArticleData {
  id: string;
  url: string;
  title: string;
  content: string; // Clean HTML from Readability
  textContent?: string | null; // Plain text
  excerpt?: string | null;
  byline?: string | null; // Author
  websiteName?: string | null;
  faviconUrl?: string | null;
  wordCount?: number | null;
  readTime?: number | null;
  language?: string | null;
  direction?: string | null;
  publishedTime?: string | null;
  platform: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveWebsiteArticleRequest {
  url: string;
  title: string;
  content: string;
  textContent?: string;
  excerpt?: string;
  byline?: string;
  websiteName?: string;
  language?: string;
  direction?: string;
  publishedTime?: string;
}

export interface WebsiteArticleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  websiteName?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "title" | "websiteName" | "readTime";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedWebsiteArticles {
  data: WebsiteArticleData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Endpoints
const WEBSITE_ENDPOINTS = {
  LIST: "/api/website",
  CREATE: "/api/website",
  GET_BY_ID: (id: string) => `/api/website/${id}`,
  DELETE: (id: string) => `/api/website/${id}`,
  BULK_DELETE: "/api/website/bulk",
  CHECK: "/api/website/by-url",
};

class WebsiteService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        credentials: "include",
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const newToken = await currentUser.getIdToken(true);
            if (newToken) {
              const updatedOptions = {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${newToken}`,
                },
              };
              return this.makeRequest(endpoint, updatedOptions);
            }
          }
        }

        return {
          success: false,
          error:
            data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error("Website API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  /**
   * Get paginated list of website articles with optional filters
   */
  async getArticles(
    params: WebsiteArticleQueryParams = {}
  ): Promise<ApiResponse<PaginatedWebsiteArticles>> {
    const queryString = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, String(value));
      }
    });

    const endpoint = `${WEBSITE_ENDPOINTS.LIST}?${queryString.toString()}`;
    return this.makeRequest<PaginatedWebsiteArticles>(endpoint);
  }

  /**
   * Get single website article by ID
   */
  async getArticleById(id: string): Promise<ApiResponse<WebsiteArticleData>> {
    return this.makeRequest<WebsiteArticleData>(
      WEBSITE_ENDPOINTS.GET_BY_ID(id)
    );
  }

  /**
   * Save a new website article
   */
  async saveArticle(
    data: SaveWebsiteArticleRequest
  ): Promise<ApiResponse<WebsiteArticleData>> {
    return this.makeRequest<WebsiteArticleData>(WEBSITE_ENDPOINTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete website article
   */
  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(WEBSITE_ENDPOINTS.DELETE(id), {
      method: "DELETE",
    });
  }

  /**
   * Bulk delete website articles
   */
  async bulkDeleteArticles(
    ids: string[]
  ): Promise<ApiResponse<{ deletedCount: number }>> {
    return this.makeRequest<{ deletedCount: number }>(
      WEBSITE_ENDPOINTS.BULK_DELETE,
      {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      }
    );
  }

  /**
   * Check if an article already exists by URL
   */
  async checkArticleExists(
    url: string
  ): Promise<ApiResponse<{ exists: boolean; article?: WebsiteArticleData }>> {
    const endpoint = `${WEBSITE_ENDPOINTS.CHECK}?url=${encodeURIComponent(url)}`;
    return this.makeRequest<{
      exists: boolean;
      article?: WebsiteArticleData;
    }>(endpoint);
  }

  /**
   * Search website articles by text
   */
  async searchArticles(
    query: string,
    params: Omit<WebsiteArticleQueryParams, "search"> = {}
  ): Promise<ApiResponse<PaginatedWebsiteArticles>> {
    return this.getArticles({
      ...params,
      search: query,
    });
  }

  /**
   * Get recent website articles
   */
  async getRecentArticles(
    limit: number = 10
  ): Promise<ApiResponse<PaginatedWebsiteArticles>> {
    return this.getArticles({
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }

  /**
   * Get articles by date range
   */
  async getArticlesByDateRange(
    startDate: string,
    endDate: string,
    params: Omit<WebsiteArticleQueryParams, "startDate" | "endDate"> = {}
  ): Promise<ApiResponse<PaginatedWebsiteArticles>> {
    return this.getArticles({
      ...params,
      startDate,
      endDate,
    });
  }

  /**
   * Export articles to JSON
   */
  async exportArticles(
    ids?: string[]
  ): Promise<ApiResponse<WebsiteArticleData[]>> {
    if (ids && ids.length > 0) {
      const results = await Promise.allSettled(
        ids.map((id) => this.getArticleById(id))
      );

      const articles = results
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<
            ApiResponse<WebsiteArticleData>
          > => result.status === "fulfilled" && result.value.success
        )
        .map((result) => result.value.data!);

      return { success: true, data: articles };
    } else {
      const response = await this.getArticles({ limit: 1000 });
      if (response.success && response.data) {
        return { success: true, data: response.data.data };
      }
      return response as unknown as ApiResponse<WebsiteArticleData[]>;
    }
  }
}

// Export singleton instance
export const websiteService = new WebsiteService();
