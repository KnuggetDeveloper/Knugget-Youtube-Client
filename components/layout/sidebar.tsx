/* eslint-disable @next/next/no-img-element */
// components/layout/sidebar.tsx - FIXED HOVER AND ACTIVE STATE
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Tag } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useSummaries } from "@/hooks/use-summaries";
// LinkedIn hooks disabled - can be re-enabled via feature flags
// import { useLinkedinPosts } from "@/hooks/use-linkedin-posts";
import { Button } from "@/components/ui/button";

export function GlobalSidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarCollapsed = false;

  // Get data for counts
  const { summaries } = useSummaries({ limit: 1000 });

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

  // Get all unique tags for the topics section
  const allTags = Array.from(
    new Set([
      ...(summaries?.flatMap((s) => s.tags) || []),
      // Add other content types when available
    ])
  ).slice(0, 20);

  // Handle tag clicks with proper search
  const handleTagClick = (tag: string) => {
    router.push(`/dashboard?search=${encodeURIComponent(tag)}`);
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
        {/* Topics */}
        {!sidebarCollapsed && allTags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Topics
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
              {allTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className="w-full text-left px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                >
                  <span className="text-orange-500 mr-2">#</span>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
