"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Calendar,
  Clock,
  FileText,
  List,
  Tag,
  Trash2,
  Loader2,
  BookOpen,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/utils";
import { auth } from "@/lib/firebase";

interface WebsiteSummaryData {
  id: string;
  url: string;
  title: string;
  content: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  websiteName?: string | null;
  favicon?: string | null;
  wordCount?: number | null;
  readTime?: number | null;
  author?: string | null;
  publishedAt?: string | null;
  status: string;
  savedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function WebsiteSummaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const summaryId = params.id as string;
  
  const [summary, setSummary] = useState<WebsiteSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "keypoints" | "original">("summary");

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const baseUrl = getApiBaseUrl();
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      const response = await fetch(`${baseUrl}/api/website/${summaryId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSummary(data.data);
      } else {
        setError(data.error || "Failed to fetch summary");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch summary");
    } finally {
      setIsLoading(false);
    }
  }, [summaryId]);

  useEffect(() => {
    if (summaryId) {
      fetchSummary();
    }
  }, [summaryId, fetchSummary]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this summary?")) return;

    try {
      setIsDeleting(true);
      const baseUrl = getApiBaseUrl();
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      const response = await fetch(`${baseUrl}/api/website/${summaryId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete summary");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete summary");
    } finally {
      setIsDeleting(false);
    }
  };

  const openOriginalPage = () => {
    if (summary?.url) {
      window.open(summary.url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading summary...</span>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Summary not found</h2>
          <p className="text-gray-400 mb-4">{error || "The summary you're looking for doesn't exist."}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-500" />
            <span className="text-white font-semibold">Website Summary</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openOriginalPage}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Open original page"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              title="Delete summary"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#151515] rounded-xl border border-gray-800 overflow-hidden">
          {/* Title Section */}
          <div className="p-6 sm:p-8 border-b border-gray-800">
            <div className="flex items-start gap-4 mb-4">
              {summary.favicon && (
                <img
                  src={summary.favicon}
                  alt={summary.websiteName || ""}
                  className="w-10 h-10 rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">{summary.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  {summary.websiteName && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {summary.websiteName}
                    </span>
                  )}
                  {summary.author && (
                    <span>By {summary.author}</span>
                  )}
                  {summary.readTime && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {summary.readTime} min read
                    </span>
                  )}
                  {summary.wordCount && (
                    <span>{summary.wordCount.toLocaleString()} words</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {summary.tags && summary.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {summary.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === "summary"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              Summary
            </button>
            <button
              onClick={() => setActiveTab("keypoints")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === "keypoints"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
              Key Points
            </button>
            <button
              onClick={() => setActiveTab("original")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === "original"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Tag className="w-4 h-4" />
              Original
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "summary" && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
                  {summary.summary}
                </p>
              </div>
            )}

            {activeTab === "keypoints" && (
              <ul className="space-y-4">
                {summary.keyPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-200"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "original" && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm max-h-96 overflow-y-auto">
                  {summary.content}
                </p>
              </div>
            )}
          </div>

          {/* Metadata Footer */}
          <div className="p-6 sm:p-8 border-t border-gray-800">
            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Saved: {formatDate(summary.savedAt)}</span>
              </div>
              {summary.publishedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Published: {formatDate(summary.publishedAt)}</span>
                </div>
              )}
            </div>

            {/* View Original Button */}
            <button
              onClick={openOriginalPage}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              View Original Article
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

