"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/firebase-auth-context";
import { useSummariesQuery } from "@/hooks/use-summaries-query";
import { useLinkedinPosts } from "@/hooks/use-linkedin-posts";
import { useWebsiteArticles } from "@/hooks/use-website-articles";
import { Input } from "@/components/ui/input";
import {
  YouTubeCard,
  LinkedInCard,
  WebsiteCard,
} from "@/components/content-cards";

interface KnuggetItem {
  id: string;
  type: "youtube" | "linkedin" | "website";
  title: string;
  source: string;
  author?: string;
  content?: string;
  thumbnail?: string;
  url: string;
  tags: string[];
  createdAt: string;
  // Additional fields for different content types
  videoMetadata?: {
    duration?: string;
    channelName: string;
    thumbnailUrl?: string;
  };
  linkedinMetadata?: {
    authorImage?: string | null;
    postUrl: string;
    engagement?: {
      likes?: number;
      comments?: number;
      shares?: number;
    };
  };
  websiteMetadata?: {
    excerpt?: string | null;
    byline?: string | null;
    websiteName?: string | null;
    favicon?: string | null;
    readTime?: number | null;
  };
  summary?: string;
}

// Separate component that uses useSearchParams
function DashboardContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // FIXED: Get filter and search from URL parameters
  const filterParam = searchParams.get("filter");
  const searchParam = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [activeFilter, setActiveFilter] = useState<string>(
    filterParam || "all"
  );

  // Fetch data from hooks using React Query
  const { data: summariesData, isLoading: summariesLoading } =
    useSummariesQuery({
      limit: 50,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  // Fetch LinkedIn posts
  const { posts: linkedinPosts, isLoading: linkedinLoading } = useLinkedinPosts(
    {
      limit: 50,
      sortBy: "savedAt",
      sortOrder: "desc",
    }
  );

  // Fetch Website articles
  const { articles: websiteArticles, isLoading: websiteLoading } =
    useWebsiteArticles({
      limit: 50,
      sortBy: "savedAt", // Use savedAt to match backend
      sortOrder: "desc",
    });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // FIXED: Update search query when URL parameter changes
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  // FIXED: Update active filter when URL parameter changes
  useEffect(() => {
    setActiveFilter(filterParam || "all");
  }, [filterParam]);

  // Combine all data sources using useMemo to prevent infinite loops
  const allItems = useMemo(() => {
    const items: KnuggetItem[] = [];
    const summaries = summariesData?.data || [];

    // Add summaries (YouTube)
    summaries.forEach((summary) => {
      items.push({
        id: summary.id,
        type: "youtube",
        title: summary.videoTitle,
        source: summary.channelName,
        thumbnail: summary.thumbnailUrl,
        url: summary.videoUrl,
        tags: summary.tags,
        createdAt: summary.createdAt,
        videoMetadata: {
          duration: summary.videoDuration,
          channelName: summary.channelName,
          thumbnailUrl: summary.thumbnailUrl,
        },
        summary: summary.fullSummary,
      });
    });

    // Add LinkedIn posts
    linkedinPosts.forEach((post) => {
      items.push({
        id: post.id,
        type: "linkedin",
        title: post.title || post.content.substring(0, 100),
        source: post.author,
        author: post.author,
        content: post.content,
        url: post.postUrl,
        tags: ["LinkedIn", "Saved Post"],
        createdAt: post.savedAt,
        linkedinMetadata: {
          authorImage: post.authorImage,
          postUrl: post.postUrl,
          engagement: post.engagement,
        },
      });
    });

    // Add Website articles
    websiteArticles.forEach((article) => {
      items.push({
        id: article.id,
        type: "website",
        title: article.title,
        source:
          article.websiteName ||
          new URL(article.url).hostname.replace(/^www\./, ""),
        author: article.byline || undefined,
        url: article.url,
        tags: ["Article", "Saved"],
        createdAt: article.savedAt, // Use savedAt instead of createdAt for consistency
        websiteMetadata: {
          excerpt: article.excerpt,
          byline: article.byline,
          websiteName: article.websiteName,
          favicon: article.favicon,
          readTime: article.readTime,
        },
      });
    });

    // Sort by creation date (newest first)
    items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return items;
  }, [summariesData?.data, linkedinPosts, websiteArticles]);

  // FIXED: Filter items based on search and active filter using useMemo
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Apply type filter
      const matchesFilter =
        activeFilter === "all" || item.type === activeFilter;

      // Apply search filter
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author &&
          item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.content &&
          item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.summary &&
          item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.websiteMetadata?.excerpt &&
          item.websiteMetadata.excerpt
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesFilter && matchesSearch;
    });
  }, [allItems, activeFilter, searchQuery]);

  // FIXED: Handle search input with URL updates
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update URL with search parameter
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    // Preserve filter parameter
    if (activeFilter && activeFilter !== "all") {
      params.set("filter", activeFilter);
    }

    router.push(`/dashboard?${params.toString()}`);
  };

  // FIXED: Get display title based on active filter
  const getDisplayTitle = () => {
    switch (activeFilter) {
      case "youtube":
        return "YouTube Videos";
      case "linkedin":
        return "LinkedIn Posts";
      case "website":
        return "Website Articles";
      default:
        return "All Knuggets";
    }
  };

  const handleItemClick = (item: KnuggetItem) => {
    switch (item.type) {
      case "youtube":
        router.push(`/knugget/youtube/${item.id}`);
        break;
      case "linkedin":
        router.push(`/knugget/linkedin/${item.id}`);
        break;
      case "website":
        router.push(`/knugget/website/${item.id}`);
        break;
    }
  };

  const handleThumbnailClick = (item: KnuggetItem) => {
    switch (item.type) {
      case "youtube":
        // Navigate to detail page with autoplay parameter
        router.push(`/knugget/youtube/${item.id}?autoplay=true`);
        break;
      default:
        break;
    }
  };

  if (authLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#151515" }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="flex h-screen text-orange-500"
      style={{ backgroundColor: "#151515" }}
    >
      {/* Main Content */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ backgroundColor: "#151515" }}
      >
        {/* Header */}
        <div
          className="p-6 transition-all duration-300"
          style={{
            background: "#151515",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300"
                  style={{ color: "rgba(255, 107, 53, 0.7)" }}
                />
                <Input
                  type="text"
                  placeholder="Search your knuggets..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 border-gray-800 text-orange-500 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 w-full transition-all duration-300"
                  style={{
                    background: "#151515",
                    borderColor: "rgba(255, 107, 53, 0.3)",
                    color: "#ff6b35",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div
          className="flex-1 p-6 overflow-auto"
          style={{ backgroundColor: "#151515" }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">{getDisplayTitle()}</h1>
            <p className="text-gray-400 text-sm">
              {filteredItems.length} items
              {searchQuery && ` matching "${searchQuery}"`}
              {activeFilter !== "all" && ` in ${activeFilter}`}
            </p>
          </div>

          {/* Loading State */}
          {(summariesLoading || linkedinLoading || websiteLoading) && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Items Grid - Auto Height Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              switch (item.type) {
                case "youtube":
                  return (
                    <YouTubeCard
                      key={item.id}
                      data={{
                        id: item.id,
                        title: item.title,
                        source: item.source,
                        thumbnail: item.thumbnail,
                        url: item.url,
                        tags: item.tags,
                        createdAt: item.createdAt,
                        duration: item.videoMetadata?.duration,
                      }}
                      onCardClick={() => handleItemClick(item)}
                      onThumbnailClick={() => handleThumbnailClick(item)}
                    />
                  );
                case "linkedin":
                  return (
                    <LinkedInCard
                      key={item.id}
                      data={{
                        id: item.id,
                        title: item.title,
                        content: item.content || "",
                        author: item.author || "Unknown",
                        authorImage: item.linkedinMetadata?.authorImage,
                        postUrl: item.linkedinMetadata?.postUrl || item.url,
                        imageUrl: null,
                        engagement: item.linkedinMetadata?.engagement,
                        savedAt: item.createdAt,
                        createdAt: item.createdAt,
                      }}
                      onCardClick={() => handleItemClick(item)}
                    />
                  );
                case "website":
                  return (
                    <WebsiteCard
                      key={item.id}
                      data={{
                        id: item.id,
                        title: item.title,
                        url: item.url,
                        excerpt: item.websiteMetadata?.excerpt,
                        byline: item.websiteMetadata?.byline,
                        websiteName: item.websiteMetadata?.websiteName,
                        favicon: item.websiteMetadata?.favicon,
                        readTime: item.websiteMetadata?.readTime,
                        createdAt: item.createdAt,
                      }}
                      onCardClick={() => handleItemClick(item)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* Empty State */}
          {!summariesLoading &&
            !linkedinLoading &&
            !websiteLoading &&
            filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No knuggets found</p>
                  <p className="text-sm">
                    {searchQuery || activeFilter !== "all"
                      ? `No results for your current filters`
                      : "Start by adding some content"}
                  </p>
                </div>
                {(searchQuery || activeFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                      router.push("/dashboard");
                    }}
                    className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function DashboardLoading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "#151515" }}
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );
}

// Main dashboard page with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
