/* eslint-disable @next/next/no-img-element */
// components/layout/sidebar.tsx - FIXED HOVER AND ACTIVE STATE
"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LogOut, Youtube, Clock, Linkedin, Globe } from "lucide-react";
import { useAuth } from "@/contexts/firebase-auth-context";
import { useSummariesQuery } from "@/hooks/use-summaries-query";
import { useLinkedinPosts } from "@/hooks/use-linkedin-posts";
import { useWebsiteArticles } from "@/hooks/use-website-articles";
import { useUserStatsQuery } from "@/hooks/use-profile-query";
import { BuyNowButton } from "@/components/payment/buy-now-button";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

export function GlobalSidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sidebarCollapsed = false;
  const buyNowButtonRef = useRef<HTMLDivElement>(null);

  // Get data for counts - Start with 20 most recent, load more on demand
  const { data: summariesData, isLoading: summariesLoading } =
    useSummariesQuery({
      limit: 20, // Only fetch 20 most recent (enough for sidebar)
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  const summaries = summariesData?.data || [];

  // Fetch LinkedIn posts for sidebar
  const { posts: linkedinPosts, isLoading: linkedinLoading } = useLinkedinPosts({
    limit: 20,
    sortBy: "savedAt",
    sortOrder: "desc",
  });

  // Fetch Website articles for sidebar
  const { articles: websiteArticles, isLoading: websiteLoading } = useWebsiteArticles({
    limit: 20,
    sortBy: "savedAt", // Use savedAt to match backend
    sortOrder: "desc",
  });

  // Get user stats for token usage
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: stats } = useUserStatsQuery();

  // Auto-open upgrade modal when redirected from extension
  // This must be before any conditional returns (React rules of hooks)
  useEffect(() => {
    const openUpgrade = searchParams.get("openUpgrade");
    if (openUpgrade === "true" && buyNowButtonRef.current) {
      // Small delay to ensure the button is rendered
      const timer = setTimeout(() => {
        const button = buyNowButtonRef.current?.querySelector("button");
        if (button) {
          button.click();
          // Clear the parameter from URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("openUpgrade");
          window.history.replaceState({}, "", newUrl.toString());
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Don't show sidebar on auth pages or landing page for non-authenticated users
  const hideSidebar =
    !isAuthenticated ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/landing") ||
    (pathname === "/" && !isAuthenticated);

  if (hideSidebar) return null;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  // Combine all content items for timeline
  interface TimelineItem {
    id: string;
    type: "youtube" | "linkedin" | "website";
    title: string;
    createdAt: string;
  }

  const allTimelineItems: TimelineItem[] = [
    ...summaries.map((s) => ({
      id: s.id,
      type: "youtube" as const,
      title: s.videoTitle || s.title,
      createdAt: s.createdAt,
    })),
    ...linkedinPosts.map((p) => ({
      id: p.id,
      type: "linkedin" as const,
      title: p.title || p.content.substring(0, 100),
      createdAt: p.savedAt,
    })),
    ...websiteArticles.map((a) => ({
      id: a.id,
      type: "website" as const,
      title: a.title,
      createdAt: a.savedAt, // Use savedAt for consistency with other platforms
    })),
  ];

  // Group all items by date for chronological list
  const groupedItems = allTimelineItems.reduce(
    (groups, item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    },
    {} as Record<string, TimelineItem[]>
  );

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedItems).sort((a, b) => {
    const dateA = new Date(a.split("/").reverse().join("-"));
    const dateB = new Date(b.split("/").reverse().join("-"));
    return dateB.getTime() - dateA.getTime();
  });

  // Handle item click based on type
  const handleItemClick = (item: TimelineItem) => {
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

  // Get icon for content type
  const getItemIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "youtube":
        return <Youtube className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />;
      case "linkedin":
        return <Linkedin className="w-3 h-3 text-[#0A66C2] mt-0.5 flex-shrink-0" />;
      case "website":
        return <Globe className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />;
    }
  };

  return (
    <div
      className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-black flex flex-col transition-all duration-300 fixed left-0 top-0 h-full z-50`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-lg bg-gradient-to-r flex items-center justify-center">
                <img src="/logo.png" alt="Knugget" className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold text-white">Knugget</span>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Recent Videos */}
        {!sidebarCollapsed && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Recent Content
              </h3>
              {!summariesLoading && !linkedinLoading && !websiteLoading && sortedDates.length > 0 && (
                <Link
                  href="/dashboard"
                  className="text-xs text-orange-500 hover:text-orange-400"
                >
                  View All
                </Link>
              )}
            </div>

            {(summariesLoading || linkedinLoading || websiteLoading) ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-800 rounded"></div>
                ))}
              </div>
            ) : sortedDates.length > 0 ? (
              <div>
                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
                  {sortedDates.slice(0, 10).map((date) => {
                    // Sort items within each date by createdAt (newest first)
                    const itemsForDate = groupedItems[date].sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );

                    return (
                      <div key={date} className="space-y-2">
                        <div className="text-xs font-medium text-gray-500 px-2">
                          {date}
                        </div>
                        <div className="space-y-1">
                          {itemsForDate.slice(0, 5).map((item) => (
                            <button
                              key={`${item.type}-${item.id}`}
                              onClick={() => handleItemClick(item)}
                              className="w-full text-left px-2 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors group"
                            >
                              <div className="flex items-start space-x-2">
                                {getItemIcon(item.type)}
                                <span
                                  className="text-left block overflow-hidden"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {item.title}
                                </span>
                              </div>
                            </button>
                          ))}
                          {itemsForDate.length > 5 && (
                            <div className="text-xs text-gray-600 px-2 py-1">
                              +{itemsForDate.length - 5} more items
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-4">
                No content yet. Start saving!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buy Now Button */}
      {!sidebarCollapsed && user && (
        <div
          ref={buyNowButtonRef}
          className="px-4 py-3 border-t border-gray-800"
        >
          <BuyNowButton variant="button" size="default" className="w-full" />
        </div>
      )}

      {/* User Profile */}
      {!sidebarCollapsed && user && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name
                  ? user.name[0].toUpperCase()
                  : user.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-400">{user.plan} Plan</p>
            </div>
          </div>

          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed User Profile */}
      {sidebarCollapsed && user && (
        <div className="p-2 border-t border-gray-800">
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name
                  ? user.name[0].toUpperCase()
                  : user.email[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
