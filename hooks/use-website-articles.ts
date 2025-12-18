"use client";

import { useState, useEffect, useCallback } from "react";
import {
  websiteService,
  WebsiteArticleData,
  WebsiteArticleQueryParams,
  SaveWebsiteArticleRequest,
} from "@/lib/website-service";
import { formatError } from "@/lib/utils";
import { useAuth } from "@/contexts/firebase-auth-context";

/**
 * Hook for managing website articles list with pagination, filtering, and search
 */
export function useWebsiteArticles(
  initialParams: WebsiteArticleQueryParams = {}
) {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<WebsiteArticleData[]>([]);
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
  const [params, setParams] = useState<WebsiteArticleQueryParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialParams,
  });

  // Update query parameters
  const updateParams = useCallback(
    (newParams: Partial<WebsiteArticleQueryParams>) => {
      setParams((prevParams) => ({ ...prevParams, ...newParams }));
    },
    []
  );

  // Search articles
  const search = useCallback(
    (query: string) => {
      updateParams({ search: query, page: 1 });
    },
    [updateParams]
  );

  // Filter by website name
  const filterByWebsite = useCallback(
    (websiteName: string | undefined) => {
      updateParams({ websiteName, page: 1 });
    },
    [updateParams]
  );

  // Sort articles
  const sort = useCallback(
    (
      sortBy: WebsiteArticleQueryParams["sortBy"],
      sortOrder: WebsiteArticleQueryParams["sortOrder"]
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

  // Refresh articles
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await websiteService.getArticles(params);

      if (response.success && response.data) {
        setArticles(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || "Failed to fetch website articles");
        setArticles([]);
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
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, params]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setParams((prevParams) => ({
      page: 1,
      limit: prevParams.limit,
      sortBy: "createdAt" as const,
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

        const response = await websiteService.getArticles(params);

        if (response.success && response.data) {
          setArticles(response.data.data);
          setPagination(response.data.pagination);
        } else {
          setError(response.error || "Failed to fetch website articles");
          setArticles([]);
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
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params, isAuthenticated]);

  // Listen for extension sync events
  useEffect(() => {
    const handleWebsiteSync = () => {
      refresh();
    };

    window.addEventListener("websiteArticleSync", handleWebsiteSync);
    return () =>
      window.removeEventListener("websiteArticleSync", handleWebsiteSync);
  }, [refresh]);

  return {
    articles,
    pagination,
    isLoading,
    error,
    params,
    search,
    filterByWebsite,
    sort,
    changePage,
    changePageSize,
    refresh,
    clearFilters,
  };
}

/**
 * Hook for managing a single website article
 */
export function useWebsiteArticle(id?: string) {
  const { isAuthenticated } = useAuth();
  const [article, setArticle] = useState<WebsiteArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(
    async (articleId: string) => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await websiteService.getArticleById(articleId);

        if (response.success && response.data) {
          setArticle(response.data);
        } else {
          setError(response.error || "Failed to fetch website article");
          setArticle(null);
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchArticle(id);
    }
  }, [id, isAuthenticated, fetchArticle]);

  return {
    article,
    isLoading,
    error,
    refresh: () => id && fetchArticle(id),
  };
}

/**
 * Hook for website article CRUD operations
 */
export function useWebsiteArticleActions() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveArticle = useCallback(
    async (
      data: SaveWebsiteArticleRequest
    ): Promise<WebsiteArticleData | null> => {
      if (!isAuthenticated) return null;

      try {
        setIsLoading(true);
        setError(null);

        const response = await websiteService.saveArticle(data);

        if (response.success && response.data) {
          // Emit sync event
          window.dispatchEvent(new CustomEvent("websiteArticleSync"));
          return response.data;
        } else {
          setError(response.error || "Failed to save website article");
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

  const deleteArticle = useCallback(
    async (id: string): Promise<boolean> => {
      if (!isAuthenticated) return false;

      try {
        setIsLoading(true);
        setError(null);

        const response = await websiteService.deleteArticle(id);

        if (response.success) {
          // Emit sync event
          window.dispatchEvent(new CustomEvent("websiteArticleSync"));
          return true;
        } else {
          setError(response.error || "Failed to delete website article");
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

  const bulkDeleteArticles = useCallback(
    async (ids: string[]): Promise<boolean> => {
      if (!isAuthenticated || ids.length === 0) return false;

      try {
        setIsLoading(true);
        setError(null);

        const response = await websiteService.bulkDeleteArticles(ids);

        if (response.success) {
          // Emit sync event
          window.dispatchEvent(new CustomEvent("websiteArticleSync"));
          return true;
        } else {
          setError(response.error || "Failed to delete website articles");
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

  const checkArticleExists = useCallback(
    async (
      url: string
    ): Promise<{ exists: boolean; article?: WebsiteArticleData } | null> => {
      if (!isAuthenticated) return null;

      try {
        setError(null);

        const response = await websiteService.checkArticleExists(url);

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
    saveArticle,
    deleteArticle,
    bulkDeleteArticles,
    checkArticleExists,
    isLoading,
    error,
    clearError,
  };
}
