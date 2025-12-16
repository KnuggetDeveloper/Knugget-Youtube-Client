"use client";

import { useState, useEffect, useCallback } from "react";
import {
  linkedinService,
  LinkedinPostData,
  LinkedinPostQueryParams,
  LinkedinPostStats,
  SaveLinkedinPostRequest,
  UpdateLinkedinPostRequest,
} from "@/lib/linkedin-service";
import { formatError } from "@/lib/utils";
import { useAuth } from "@/contexts/firebase-auth-context";

/**
 * Hook for managing LinkedIn posts list with pagination, filtering, and search
 */
export function useLinkedinPosts(initialParams: LinkedinPostQueryParams = {}) {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<LinkedinPostData[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<LinkedinPostQueryParams>({
    page: 1,
    limit: 20,
    sortBy: "savedAt",
    sortOrder: "desc",
    ...initialParams,
  });

  // Update query parameters
  const updateParams = useCallback(
    (newParams: Partial<LinkedinPostQueryParams>) => {
      setParams((prevParams) => ({ ...prevParams, ...newParams }));
    },
    []
  );

  // Search posts
  const search = useCallback(
    (query: string) => {
      updateParams({ search: query, page: 1 });
    },
    [updateParams]
  );

  // Filter by author
  const filterByAuthor = useCallback(
    (author: string | undefined) => {
      updateParams({ author, page: 1 });
    },
    [updateParams]
  );

  // Sort posts
  const sort = useCallback(
    (
      sortBy: LinkedinPostQueryParams["sortBy"],
      sortOrder: LinkedinPostQueryParams["sortOrder"]
    ) => {
      updateParams({ sortBy, sortOrder, page: 1 });
    },
    [updateParams]
  );

  // Change page
  const changePage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  // Change page size
  const changePageSize = useCallback(
    (limit: number) => {
      updateParams({ limit, page: 1 });
    },
    [updateParams]
  );

  // Refresh posts
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await linkedinService.getPosts(params);

      if (response.success && response.data) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || "Failed to fetch LinkedIn posts");
        setPosts([]);
        setPagination({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, params]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setParams((prevParams) => ({
      page: 1,
      limit: prevParams.limit,
      sortBy: "savedAt" as const,
      sortOrder: "desc" as const,
    }));
  }, []);

  // Fetch when params change or on initial load
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await linkedinService.getPosts(params);

        if (response.success && response.data) {
          setPosts(response.data.data);
          setPagination(response.data.pagination);
        } else {
          setError(response.error || "Failed to fetch LinkedIn posts");
          setPosts([]);
          setPagination({
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          });
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params, isAuthenticated]);

  // Listen for extension sync events
  useEffect(() => {
    const handleLinkedinSync = () => {
      refresh();
    };

    window.addEventListener("linkedinPostSync", handleLinkedinSync);
    return () =>
      window.removeEventListener("linkedinPostSync", handleLinkedinSync);
  }, [refresh]);

  return {
    posts,
    pagination,
    isLoading,
    error,
    params,
    search,
    filterByAuthor,
    sort,
    changePage,
    changePageSize,
    refresh,
    clearFilters,
  };
}

/**
 * Hook for managing a single LinkedIn post
 */
export function useLinkedinPost(id?: string) {
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<LinkedinPostData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(
    async (postId: string) => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await linkedinService.getPostById(postId);

        if (response.success && response.data) {
          setPost(response.data);
        } else {
          setError(response.error || "Failed to fetch LinkedIn post");
          setPost(null);
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchPost(id);
    }
  }, [id, isAuthenticated, fetchPost]);

  return {
    post,
    isLoading,
    error,
    refresh: () => id && fetchPost(id),
  };
}

/**
 * Hook for LinkedIn post CRUD operations
 */
export function useLinkedinPostActions() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePost = useCallback(
    async (data: SaveLinkedinPostRequest): Promise<LinkedinPostData | null> => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        setError(null);

        const response = await linkedinService.savePost(data);

        if (response.success && response.data) {
          // Emit sync event
          window.dispatchEvent(new CustomEvent("linkedinPostSync"));
          return response.data;
        } else {
          setError(response.error || "Failed to save LinkedIn post");
          return null;
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const updatePost = useCallback(
    async (
      id: string,
      data: UpdateLinkedinPostRequest
    ): Promise<LinkedinPostData | null> => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        setError(null);

        const response = await linkedinService.updatePost(id, data);

        if (response.success && response.data) {
          // Emit sync event
          window.dispatchEvent(new CustomEvent("linkedinPostSync"));
          return response.data;
        } else {
          setError(response.error || "Failed to update LinkedIn post");
          return null;
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const deletePost = useCallback(
    async (id: string): Promise<boolean> => {
      if (!isAuthenticated) return false;

      try {
        setIsLoading(true);
        setError(null);

        const response = await linkedinService.deletePost(id);

        if (response.success) {
          // Emit sync event
          window.dispatchEvent(new CustomEvent("linkedinPostSync"));
          return true;
        } else {
          setError(response.error || "Failed to delete LinkedIn post");
          return false;
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const bulkDeletePosts = useCallback(
    async (ids: string[]): Promise<boolean> => {
      if (!isAuthenticated || ids.length === 0) return false;

      try {
        setIsLoading(true);
        setError(null);

        const response = await linkedinService.bulkDeletePosts(ids);

        if (response.success) {
          // Emit sync event
          window.dispatchEvent(new CustomEvent("linkedinPostSync"));
          return true;
        } else {
          setError(response.error || "Failed to delete LinkedIn posts");
          return false;
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  const checkPostExists = useCallback(
    async (
      postUrl: string
    ): Promise<{ exists: boolean; post?: LinkedinPostData } | null> => {
      if (!isAuthenticated) return null;

      try {
        setError(null);

        const response = await linkedinService.checkPostExists(postUrl);

        if (response.success && response.data) {
          return response.data;
        } else {
          return { exists: false };
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        return null;
      }
    },
    [isAuthenticated]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    savePost,
    updatePost,
    deletePost,
    bulkDeletePosts,
    checkPostExists,
    isLoading,
    error,
    clearError,
  };
}

/**
 * Hook for LinkedIn post statistics
 */
export function useLinkedinPostStats() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<LinkedinPostStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await linkedinService.getStats();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || "Failed to fetch statistics");
        setStats(null);
      }
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, fetchStats]);

  // Listen for sync events
  useEffect(() => {
    const handleLinkedinSync = () => {
      fetchStats();
    };

    window.addEventListener("linkedinPostSync", handleLinkedinSync);
    return () =>
      window.removeEventListener("linkedinPostSync", handleLinkedinSync);
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refresh: fetchStats,
  };
}

/**
 * Hook for top LinkedIn authors
 */
export function useTopLinkedinAuthors(limit: number = 10) {
  const { isAuthenticated } = useAuth();
  const [authors, setAuthors] = useState<{ author: string; count: number }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await linkedinService.getTopAuthors(limit);

      if (response.success && response.data) {
        setAuthors(response.data);
      } else {
        setError(response.error || "Failed to fetch authors");
        setAuthors([]);
      }
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
      setAuthors([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, limit]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAuthors();
    }
  }, [isAuthenticated, fetchAuthors]);

  return {
    authors,
    isLoading,
    error,
    refresh: fetchAuthors,
  };
}

