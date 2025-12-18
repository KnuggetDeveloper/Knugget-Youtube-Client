/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Globe, Clock, BookOpen } from "lucide-react";
import { BaseCard, CardHeader, CardTitle, TagsContainer } from "./base-card";

interface WebsiteCardData {
  id: string;
  title: string;
  url: string;
  excerpt?: string | null;
  byline?: string | null; // Author
  websiteName?: string | null;
  faviconUrl?: string | null;
  readTime?: number | null;
  wordCount?: number | null;
  createdAt: string;
}

interface WebsiteCardProps {
  data: WebsiteCardData;
  onCardClick?: (data: WebsiteCardData) => void;
  onWebsiteClick?: (websiteName: string) => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({
  data,
  onCardClick,
  onWebsiteClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatReadTime = (minutes?: number | null) => {
    if (!minutes) return null;
    return `${minutes} min read`;
  };

  const formatWordCount = (count?: number | null) => {
    if (!count) return null;
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K words";
    }
    return count + " words";
  };

  // Get excerpt preview (first ~150 chars)
  const getExcerptPreview = (excerpt?: string | null) => {
    if (!excerpt) return null;
    const maxLength = 150;
    if (excerpt.length <= maxLength) return excerpt;
    return excerpt.substring(0, maxLength).trim() + "...";
  };

  const handleCardClick = () => {
    onCardClick?.(data);
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.websiteName) {
      onWebsiteClick?.(data.websiteName);
    }
  };

  // Extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  return (
    <BaseCard onClick={handleCardClick} style={{ backgroundColor: "#151515" }}>
      <CardHeader
        iconComponent={<Globe className="w-4 h-4 text-blue-400" />}
        sourceName={data.websiteName || getDomain(data.url)}
        date={formatDate(data.createdAt)}
      />

      {/* Favicon and Website Name */}
      {(data.faviconUrl || data.websiteName) && (
        <div
          className="flex items-center gap-2 mb-3 cursor-pointer group/website"
          onClick={handleWebsiteClick}
        >
          {data.faviconUrl && (
            <div className="w-5 h-5 rounded overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
              <img
                src={data.faviconUrl}
                alt={data.websiteName || "Website"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.parentElement?.querySelector(
                    ".fallback-icon"
                  ) as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <Globe className="fallback-icon w-3 h-3 text-gray-400 hidden" />
            </div>
          )}
          <span className="text-gray-400 text-xs group-hover/website:text-blue-400 transition-colors line-clamp-1">
            {data.websiteName || getDomain(data.url)}
          </span>
        </div>
      )}

      {/* Title */}
      <CardTitle title={data.title} />

      {/* Byline (Author) */}
      {data.byline && (
        <p className="text-gray-400 text-xs mb-2 line-clamp-1">
          By {data.byline}
        </p>
      )}

      {/* Excerpt */}
      {data.excerpt && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-3 leading-relaxed">
          {getExcerptPreview(data.excerpt)}
        </p>
      )}

      {/* Article Stats */}
      {(data.readTime || data.wordCount) && (
        <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
          {data.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatReadTime(data.readTime)}</span>
            </div>
          )}
          {data.wordCount && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{formatWordCount(data.wordCount)}</span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <TagsContainer tags={["Article", "Saved"]} />
    </BaseCard>
  );
};

