/* eslint-disable @next/next/no-img-element */
// components/layout/sidebar.tsx - FIXED HOVER AND ACTIVE STATE
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Youtube, Clock } from "lucide-react";
import { useAuth } from "@/contexts/firebase-auth-context";
import { useSummariesQuery } from "@/hooks/use-summaries-query";
import { useUserStatsQuery } from "@/hooks/use-profile-query";
import { BuyNowButton } from "@/components/payment/buy-now-button";
import { TokenUsageDisplay } from "@/components/token/token-usage-display";
// LinkedIn hooks disabled - can be re-enabled via feature flags
// import { useLinkedinPosts } from "@/hooks/use-linkedin-posts";
import { Button } from "@/components/ui/button";

export function GlobalSidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarCollapsed = false;

  // Get data for counts - Start with 20 most recent, load more on demand
  const { data: summariesData, isLoading: summariesLoading } =
    useSummariesQuery({
      limit: 20, // Only fetch 20 most recent (enough for sidebar)
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  const summaries = summariesData?.data || [];

  // Get user stats for token usage
  const { data: stats } = useUserStatsQuery();

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

  // Group summaries by date for chronological list
  const groupedSummaries =
    summaries?.reduce(
      (groups, summary) => {
        const date = new Date(summary.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(summary);
        return groups;
      },
      {} as Record<string, typeof summaries>
    ) || {};

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedSummaries).sort((a, b) => {
    const dateA = new Date(a.split("/").reverse().join("-"));
    const dateB = new Date(b.split("/").reverse().join("-"));
    return dateB.getTime() - dateA.getTime();
  });

  // Handle video click
  const handleVideoClick = (summaryId: string) => {
    router.push(`/knugget/youtube/${summaryId}`);
  };

  return (
    <div
      className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-[#151515] flex flex-col transition-all duration-300 fixed left-0 top-0 h-full z-50`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r flex items-center justify-center">
                <img src="/logo.png" alt="Knugget" className="h-10 w-10" />
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
                Recent Videos
              </h3>
              {!summariesLoading && sortedDates.length > 0 && (
                <Link
                  href="/dashboard"
                  className="text-xs text-orange-500 hover:text-orange-400"
                >
                  View All
                </Link>
              )}
            </div>

            {summariesLoading ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-800 rounded"></div>
                ))}
              </div>
            ) : sortedDates.length > 0 ? (
              <div>
                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
                  {sortedDates.slice(0, 10).map((date) => (
                    <div key={date} className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 px-2">
                        {date}
                      </div>
                      <div className="space-y-1">
                        {groupedSummaries[date]?.slice(0, 5).map((summary) => (
                          <button
                            key={summary.id}
                            onClick={() => handleVideoClick(summary.id)}
                            className="w-full text-left px-2 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors group"
                          >
                            <div className="flex items-start space-x-2">
                              <Youtube className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                              <span
                                className="text-left block overflow-hidden"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {summary.videoTitle || summary.title}
                              </span>
                            </div>
                          </button>
                        ))}
                        {groupedSummaries[date]?.length > 5 && (
                          <div className="text-xs text-gray-600 px-2 py-1">
                            +{groupedSummaries[date].length - 5} more videos
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-4">
                No videos yet. Start summarizing!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buy Now Button */}
      {!sidebarCollapsed && user && (
        <div className="px-4 py-3 border-t border-gray-800">
          <BuyNowButton variant="button" size="default" className="w-full" />
        </div>
      )}

      {/* Token Usage for Premium Users */}
      {!sidebarCollapsed && user?.plan === "PREMIUM" && (
        <div className="px-4 py-3 border-t border-gray-800">
          <TokenUsageDisplay compact={true} showRefresh={false} />
        </div>
      )}

      {/* OpenAI Usage Stats for All Users */}
      {!sidebarCollapsed && user && stats && (
        <div className="px-4 py-3 border-t border-gray-800">
          <div className="text-xs text-gray-400 mb-2 font-medium">
            Total Usage
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Input:</span>
              <span className="text-white font-mono">
                {stats.totalInputTokens.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Output:</span>
              <span className="text-white font-mono">
                {stats.totalOutputTokens.toLocaleString()}
              </span>
            </div>
          </div>
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
