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
  Trash2,
  Loader2,
  BookOpen,
  User,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/utils";
import { auth } from "@/lib/firebase";

interface WebsiteArticleData {
  id: string;
  url: string;
  title: string;
  content: string; // Clean HTML from Readability
  textContent?: string | null; // Plain text
  excerpt?: string | null; // Short excerpt
  byline?: string | null; // Author from Readability
  websiteName?: string | null;
  favicon?: string | null;
  platform: string;
  wordCount?: number | null;
  readTime?: number | null;
  language?: string | null;
  direction?: string | null;
  publishedTime?: string | null;
  savedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function WebsiteArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<WebsiteArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"reader" | "original">("reader");

  const fetchArticle = useCallback(async () => {
    try {
      setIsLoading(true);
      const baseUrl = getApiBaseUrl();
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      const response = await fetch(`${baseUrl}/api/website/${articleId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setArticle(data.data);
      } else {
        setError(data.error || "Failed to fetch article");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch article");
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId, fetchArticle]);

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
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      setIsDeleting(true);
      const baseUrl = getApiBaseUrl();
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      const response = await fetch(`${baseUrl}/api/website/${articleId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        router.push("/knugget");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete article");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  const openOriginalPage = () => {
    if (article?.url) {
      window.open(article.url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading article...</span>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Article not found</h2>
          <p className="text-gray-400 mb-4">{error || "The article you're looking for doesn't exist."}</p>
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
            <span className="text-white font-semibold">Saved Article</span>
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
              title="Delete article"
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
              {article.favicon && (
                <img
                  src={article.favicon}
                  alt={article.websiteName || ""}
                  className="w-10 h-10 rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">{article.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  {article.websiteName && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {article.websiteName}
                    </span>
                  )}
                  {article.byline && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {article.byline}
                    </span>
                  )}
                  {article.readTime && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {article.readTime} min read
                    </span>
                  )}
                  {article.wordCount && (
                    <span>{article.wordCount.toLocaleString()} words</span>
                  )}
                </div>
              </div>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <div className="mt-4 p-4 bg-[#0a0a0a] rounded-lg border border-gray-800">
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  {article.excerpt}
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab("reader")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === "reader"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Reader View
            </button>
            <button
              onClick={() => setActiveTab("original")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === "original"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4" />
              Plain Text
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "reader" && (
              <div 
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-gray-200 prose-p:leading-relaxed
                  prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-semibold
                  prose-code:text-emerald-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
                  prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
                  prose-img:rounded-lg prose-img:my-6
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-ul:text-gray-200 prose-ol:text-gray-200
                  prose-li:marker:text-emerald-400"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}

            {activeTab === "original" && (
              <div className="bg-[#0a0a0a] rounded-lg p-6 border border-gray-800">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm max-h-[600px] overflow-y-auto">
                  {article.textContent || article.content.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            )}
          </div>

          {/* Metadata Footer */}
          <div className="p-6 sm:p-8 border-t border-gray-800">
            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Saved: {formatDate(article.savedAt)}</span>
              </div>
              {article.publishedTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Published: {article.publishedTime}</span>
                </div>
              )}
              {article.language && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Language: {article.language.toUpperCase()}</span>
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
