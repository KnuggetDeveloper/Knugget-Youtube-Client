"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/firebase-auth-context";
import { useSummariesQuery } from "@/hooks/use-summaries-query";
// LinkedIn hooks disabled - can be re-enabled via feature flags
// import { useLinkedinPosts } from "@/hooks/use-linkedin-posts";
import { Input } from "@/components/ui/input";
import { YouTubeCard } from "@/components/content-cards";
// LinkedIn components disabled
// import { LinkedInCard } from "@/components/content-cards";

interface KnuggetItem {
  id: string;
  type: "youtube"; // | "linkedin" | "website" | "twitter" - disabled platforms
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
  metadata?: {
    authorImage?: string;
    authorAbout?: string;
    siteLogo?: string;
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
  // LinkedIn posts disabled - can be re-enabled via feature flags
  // const { posts: linkedinPosts, isLoading: linkedinLoading } = useLinkedinPosts(
  //   { limit: 50 }
  // );
  const linkedinLoading = false;

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

    // LinkedIn posts disabled - no items added
    // linkedinPosts.forEach((post) => {
    //   items.push({
    //     id: post.id,
    //     type: "linkedin",
    //     title: post.title || "",
    //     source: "LinkedIn",
    //     author: post.author,
    //     content: post.content,
    //     url: post.postUrl,
    //     tags: [], // LinkedIn posts don't have tags in current structure
    //     createdAt: post.savedAt,
    //     metadata: {
    //       authorImage: post.metadata?.authorImage as string,
    //       authorAbout: post.metadata?.authorAbout as string,
    //     },
    //   });
    // });

    // Sort by creation date (newest first)
    items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return items;
  }, [summariesData?.data]);

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
      // Disabled platforms
      // case "linkedin":
      //   return "LinkedIn Posts";
      // case "website":
      //   return "Website Articles";
      // case "twitter":
      //   return "X Posts";
      default:
        return "All Knuggets";
    }
  };

  const handleItemClick = (item: KnuggetItem) => {
    switch (item.type) {
      case "youtube":
        router.push(`/knugget/youtube/${item.id}`);
        break;
      // Disabled platforms
      // case "linkedin":
      //   router.push(`/knugget/linkedin/${item.id}`);
      //   break;
      // case "website":
      //   router.push(`/knugget/website/${item.id}`);
      //   break;
      // case "twitter":
      //   router.push(`/knugget/twitter/${item.id}`);
      //   break;
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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black text-orange-500">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black">
        {/* Header */}
        <div
          className="p-6 transition-all duration-300"
          style={{
            background: "black",
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
                  className="pl-10 bg-black border-gray-800 text-orange-500 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 w-full transition-all duration-300"
                  style={{
                    background: "rgba(0, 0, 0, 0.8)",
                    borderColor: "rgba(255, 107, 53, 0.3)",
                    color: "#ff6b35",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-6 overflow-auto bg-black">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">{getDisplayTitle()}</h1>
            <p className="text-gray-400 text-sm">
              {filteredItems.length} items
              {searchQuery && ` matching "${searchQuery}"`}
              {activeFilter !== "all" && ` in ${activeFilter}`}
            </p>
          </div>

          {/* Loading State */}
          {(summariesLoading || linkedinLoading) && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Items Grid - Fixed Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
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
                // LinkedIn cards disabled
                // case "linkedin":
                //   return (
                //     <LinkedInCard
                //       key={item.id}
                //       data={{
                //         id: item.id,
                //         title: item.title,
                //         author: item.author || "Unknown Author",
                //         role: item.metadata?.authorAbout,
                //         profileImage: item.metadata?.authorImage,
                //         content: item.content || "",
                //         url: item.url,
                //         tags: item.tags,
                //         createdAt: item.createdAt,
                //       }}
                //       onCardClick={() => handleItemClick(item)}
                //     />
                //   );
                default:
                  return null;
              }
            })}
          </div>

          {/* Empty State */}
          {!summariesLoading &&
            !linkedinLoading &&
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
    <div className="flex items-center justify-center min-h-screen bg-black">
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
