"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    try {
      setIsLoading(true);
      const baseUrl = getApiBaseUrl();
      const currentUser = auth.currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      const response = await fetch(`${baseUrl}/website/${articleId}`, {
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
    });
  };

  const handleBack = () => {
    router.back();
  };

  const openOriginalPage = () => {
    if (article?.url) {
      window.open(article.url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#151515] text-white">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#151515] text-white">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load article</p>
            <p className="text-gray-400 text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151515] text-white">
      {/* Header with Back Button */}
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-emerald-500" />
              <span className="text-white font-medium">Website</span>
            </div>
            <div className="text-gray-400 text-sm">
              {formatDate(article.savedAt)}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
            {article.title}
          </h1>

          {/* Website Info */}
          <div className="flex items-center space-x-2 mb-4">
            {article.favicon && (
              <img
                src={article.favicon}
                alt={article.websiteName || ""}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            {article.websiteName && (
              <span className="text-gray-300">{article.websiteName}</span>
            )}
            {article.byline && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">{article.byline}</span>
              </>
            )}
          </div>

          {/* Website Link */}
          <div className="mb-6">
            <button
              onClick={openOriginalPage}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="text-sm">Original Link</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-[#313130] rounded-lg p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}
