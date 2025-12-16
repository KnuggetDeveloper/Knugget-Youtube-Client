/* eslint-disable @typescript-eslint/no-explicit-any */

import { getApiBaseUrl } from "@/lib/utils";
import { auth } from "@/lib/firebase";

// LinkedIn Post Types
export interface LinkedinPostData {
  id: string;
  linkedinPostId?: string | null;
  title?: string | null;
  content: string;
  author: string;
  authorUrl?: string | null;
  authorImage?: string | null;
  postUrl: string;
  imageUrl?: string | null;
  platform: string;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  metadata?: {
    timestamp?: string;
    source?: string;
    [key: string]: any;
  };
  savedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveLinkedinPostRequest {
  title?: string;
  content: string;
  author: string;
  authorUrl?: string;
  authorImage?: string;
  postUrl: string;
  imageUrl?: string;
  linkedinPostId?: string;
  platform?: string;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  metadata?: {
    timestamp?: string;
    source?: string;
    [key: string]: any;
  };
}

export interface UpdateLinkedinPostRequest {
  title?: string;
  content?: string;
  author?: string;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  metadata?: {
    timestamp?: string;
    source?: string;
    [key: string]: any;
  };
}

export interface LinkedinPostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "savedAt" | "createdAt" | "author" | "title";
  sortOrder?: "asc" | "desc";
}

export interface LinkedinPostStats {
  totalPosts: number;
  postsThisMonth: number;
  postsThisWeek: number;
  topAuthors: { author: string; count: number }[];
  recentPosts: {
    id: string;
    title: string;
    author: string;
    savedAt: string;
  }[];
}

export interface PaginatedLinkedinPosts {
  data: LinkedinPostData[];
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
const LINKEDIN_ENDPOINTS = {
  LIST: "/api/linkedin",
  CREATE: "/api/linkedin",
  GET_BY_ID: (id: string) => `/api/linkedin/${id}`,
  UPDATE: (id: string) => `/api/linkedin/${id}`,
  DELETE: (id: string) => `/api/linkedin/${id}`,
  BULK_DELETE: "/api/linkedin/bulk",
  STATS: "/api/linkedin/stats",
  CHECK: "/api/linkedin/check",
};

class LinkedinService {
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
      console.error("LinkedIn API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  /**
   * Get paginated list of LinkedIn posts with optional filters
   */
  async getPosts(
    params: LinkedinPostQueryParams = {}
  ): Promise<ApiResponse<PaginatedLinkedinPosts>> {
    const queryString = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, String(value));
      }
    });

    const endpoint = `${LINKEDIN_ENDPOINTS.LIST}?${queryString.toString()}`;
    return this.makeRequest<PaginatedLinkedinPosts>(endpoint);
  }

  /**
   * Get single LinkedIn post by ID
   */
  async getPostById(id: string): Promise<ApiResponse<LinkedinPostData>> {
    return this.makeRequest<LinkedinPostData>(LINKEDIN_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Save a new LinkedIn post
   */
  async savePost(
    data: SaveLinkedinPostRequest
  ): Promise<ApiResponse<LinkedinPostData>> {
    return this.makeRequest<LinkedinPostData>(LINKEDIN_ENDPOINTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update existing LinkedIn post
   */
  async updatePost(
    id: string,
    data: UpdateLinkedinPostRequest
  ): Promise<ApiResponse<LinkedinPostData>> {
    return this.makeRequest<LinkedinPostData>(LINKEDIN_ENDPOINTS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete LinkedIn post
   */
  async deletePost(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(LINKEDIN_ENDPOINTS.DELETE(id), {
      method: "DELETE",
    });
  }

  /**
   * Bulk delete LinkedIn posts
   */
  async bulkDeletePosts(
    ids: string[]
  ): Promise<ApiResponse<{ deletedCount: number }>> {
    return this.makeRequest<{ deletedCount: number }>(
      LINKEDIN_ENDPOINTS.BULK_DELETE,
      {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      }
    );
  }

  /**
   * Get LinkedIn post statistics
   */
  async getStats(): Promise<ApiResponse<LinkedinPostStats>> {
    return this.makeRequest<LinkedinPostStats>(LINKEDIN_ENDPOINTS.STATS);
  }

  /**
   * Check if a post already exists by URL
   */
  async checkPostExists(
    postUrl: string
  ): Promise<ApiResponse<{ exists: boolean; post?: LinkedinPostData }>> {
    const endpoint = `${LINKEDIN_ENDPOINTS.CHECK}?url=${encodeURIComponent(postUrl)}`;
    return this.makeRequest<{ exists: boolean; post?: LinkedinPostData }>(
      endpoint
    );
  }

  /**
   * Search LinkedIn posts by text
   */
  async searchPosts(
    query: string,
    params: Omit<LinkedinPostQueryParams, "search"> = {}
  ): Promise<ApiResponse<PaginatedLinkedinPosts>> {
    return this.getPosts({
      ...params,
      search: query,
    });
  }

  /**
   * Get posts by author
   */
  async getPostsByAuthor(
    author: string,
    params: Omit<LinkedinPostQueryParams, "author"> = {}
  ): Promise<ApiResponse<PaginatedLinkedinPosts>> {
    return this.getPosts({
      ...params,
      author,
    });
  }

  /**
   * Get recent LinkedIn posts
   */
  async getRecentPosts(
    limit: number = 10
  ): Promise<ApiResponse<PaginatedLinkedinPosts>> {
    return this.getPosts({
      limit,
      sortBy: "savedAt",
      sortOrder: "desc",
    });
  }

  /**
   * Get posts by date range
   */
  async getPostsByDateRange(
    startDate: string,
    endDate: string,
    params: Omit<LinkedinPostQueryParams, "startDate" | "endDate"> = {}
  ): Promise<ApiResponse<PaginatedLinkedinPosts>> {
    return this.getPosts({
      ...params,
      startDate,
      endDate,
    });
  }

  /**
   * Export posts to JSON
   */
  async exportPosts(ids?: string[]): Promise<ApiResponse<LinkedinPostData[]>> {
    if (ids && ids.length > 0) {
      const results = await Promise.allSettled(
        ids.map((id) => this.getPostById(id))
      );

      const posts = results
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<ApiResponse<LinkedinPostData>> =>
            result.status === "fulfilled" && result.value.success
        )
        .map((result) => result.value.data!);

      return { success: true, data: posts };
    } else {
      const response = await this.getPosts({ limit: 1000 });
      if (response.success && response.data) {
        return { success: true, data: response.data.data };
      }
      return response as unknown as ApiResponse<LinkedinPostData[]>;
    }
  }

  /**
   * Get top authors
   */
  async getTopAuthors(
    limit: number = 10
  ): Promise<ApiResponse<Array<{ author: string; count: number }>>> {
    const stats = await this.getStats();
    if (stats.success && stats.data) {
      return {
        success: true,
        data: stats.data.topAuthors.slice(0, limit),
      };
    }
    return {
      success: false,
      error: "Failed to fetch top authors",
    };
  }
}

// Export singleton instance
export const linkedinService = new LinkedinService();

