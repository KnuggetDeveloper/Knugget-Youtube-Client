/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Linkedin, User, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { BaseCard, CardHeader, CardTitle } from "./base-card";

interface LinkedinCardData {
  id: string;
  title?: string | null;
  content: string;
  author: string;
  authorImage?: string | null;
  postUrl: string;
  imageUrl?: string | null;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  savedAt: string;
  createdAt: string;
}

interface LinkedinCardProps {
  data: LinkedinCardData;
  onCardClick?: (data: LinkedinCardData) => void;
  onAuthorClick?: (author: string) => void;
}

export const LinkedInCard: React.FC<LinkedinCardProps> = ({
  data,
  onCardClick,
  onAuthorClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleCardClick = () => {
    onCardClick?.(data);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAuthorClick?.(data.author);
  };

  return (
    <BaseCard onClick={handleCardClick} style={{ backgroundColor: "#151515" }}>
      <CardHeader
        iconComponent={<Linkedin className="w-4 h-4 text-[#0A66C2]" />}
        sourceName="LinkedIn"
        date={formatDate(data.savedAt)}
      />

      {/* Author Info */}
      <div
        className="flex items-center gap-3 mb-3 cursor-pointer group/author"
        onClick={handleAuthorClick}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
          {data.authorImage ? (
            <img
              src={data.authorImage}
              alt={data.author}
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
          ) : null}
          <User
            className={`fallback-icon w-5 h-5 text-gray-400 ${data.authorImage ? "hidden" : ""}`}
          />
        </div>
        <span className="text-white font-medium text-sm group-hover/author:text-[#0A66C2] transition-colors line-clamp-1">
          {data.author}
        </span>
      </div>

      {/* Title and Content Preview */}
      {data.title && <CardTitle title={data.title} />}
      <p className="text-xs mb-3 line-clamp-5 leading-snug break-words text-gray-300">
        {data.content}
      </p>

      {/* Post Image */}
      {data.imageUrl && (
        <div
          className="relative mb-4 rounded-lg overflow-hidden flex-shrink-0"
          style={{ backgroundColor: "#202020" }}
        >
          <div className="aspect-video w-full relative">
            <img
              src={data.imageUrl}
              alt="Post image"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.parentElement!.style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      {data.engagement && (
        <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
          {data.engagement.likes !== undefined && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{formatNumber(data.engagement.likes)}</span>
            </div>
          )}
          {data.engagement.comments !== undefined && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{formatNumber(data.engagement.comments)}</span>
            </div>
          )}
          {data.engagement.shares !== undefined && (
            <div className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>{formatNumber(data.engagement.shares)}</span>
            </div>
          )}
        </div>
      )}
    </BaseCard>
  );
};
