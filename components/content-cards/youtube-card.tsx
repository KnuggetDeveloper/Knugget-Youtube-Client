/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Youtube, Play } from "lucide-react";
import { BaseCard, CardHeader, CardTitle } from "./base-card";

interface YouTubeCardData {
  id: string;
  title: string;
  source: string;
  thumbnail?: string;
  url: string;
  tags: string[];
  createdAt: string;
  duration?: string;
}

interface YouTubeCardProps {
  data: YouTubeCardData;
  onCardClick?: (data: YouTubeCardData) => void;
  onThumbnailClick?: (data: YouTubeCardData) => void;
}

export const YouTubeCard: React.FC<YouTubeCardProps> = ({
  data,
  onCardClick,
  onThumbnailClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCardClick = () => {
    onCardClick?.(data);
  };

  const handleThumbnailClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onThumbnailClick?.(data);
  };

  return (
    <BaseCard onClick={handleCardClick} style={{ backgroundColor: "#151515" }}>
      <CardHeader
        iconComponent={<Youtube className="w-4 h-4 text-red-500" />}
        sourceName="YouTube"
        date={formatDate(data.createdAt)}
      />

      <CardTitle title={data.title} />

      {/* Thumbnail */}
      <div
        className="relative mb-4 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group"
        style={{ backgroundColor: "#151515" }}
        onClick={handleThumbnailClick}
      >
        <div className="aspect-video w-full relative">
          {data.thumbnail ? (
            <>
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.parentElement?.querySelector(
                    ".fallback-container"
                  ) as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div
                className="fallback-container hidden w-full h-full absolute inset-0 items-center justify-center text-gray-400"
                style={{ backgroundColor: "#151515" }}
              >
                <div className="bg-red-600 rounded-full p-3 shadow-lg">
                  <Play className="w-8 h-8 text-white fill-white ml-0.5" />
                </div>
              </div>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                <div className="bg-red-600 rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-200 opacity-0 group-hover:opacity-100">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-gray-400 group-hover:bg-gray-700 transition-colors"
              style={{ backgroundColor: "#151515" }}
            >
              <div className="bg-red-600 rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                <Play className="w-8 h-8 text-white fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Duration Badge */}
          {data.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
              {data.duration}
            </div>
          )}
        </div>
      </div>

      {/* Channel Name */}
      <p className="text-gray-400 text-sm mb-3 font-medium">{data.source}</p>
    </BaseCard>
  );
};
