"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  X,
  Linkedin,
  User,
  ThumbsUp,
  MessageSquare,
  Share2,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import { LinkedinPostData } from "@/lib/linkedin-service";

interface LinkedinPostModalProps {
  post: LinkedinPostData;
  isOpen: boolean;
  onClose: () => void;
  onAuthorClick?: (author: string) => void;
}

export const LinkedinPostModal: React.FC<LinkedinPostModalProps> = ({
  post,
  isOpen,
  onClose,
  onAuthorClick,
}) => {
  if (!isOpen) return null;

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAuthorClick = () => {
    onAuthorClick?.(post.author);
  };

  const openOriginalPost = () => {
    window.open(post.postUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            <span className="text-white font-semibold">LinkedIn Post</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openOriginalPost}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Open original post"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Author Section */}
          <div
            className="flex items-center gap-4 mb-6 cursor-pointer group"
            onClick={handleAuthorClick}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
              {post.authorImage ? (
                <img
                  src={post.authorImage}
                  alt={post.author}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <User className="w-7 h-7 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg group-hover:text-[#0A66C2] transition-colors">
                {post.author}
              </h3>
              {post.authorUrl && (
                <p className="text-gray-400 text-sm">View profile</p>
              )}
            </div>
          </div>

          {/* Title */}
          {post.title && (
            <h2 className="text-xl font-bold text-white mb-4">{post.title}</h2>
          )}

          {/* Post Content */}
          <div className="mb-6">
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt="Post image"
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.parentElement!.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Engagement Stats */}
          {post.engagement && (
            <div className="flex items-center gap-6 py-4 border-t border-b border-gray-800 mb-6">
              {post.engagement.likes !== undefined && (
                <div className="flex items-center gap-2 text-gray-400">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {formatNumber(post.engagement.likes)} likes
                  </span>
                </div>
              )}
              {post.engagement.comments !== undefined && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {formatNumber(post.engagement.comments)} comments
                  </span>
                </div>
              )}
              {post.engagement.shares !== undefined && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {formatNumber(post.engagement.shares)} shares
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Saved: {formatDate(post.savedAt)}</span>
            </div>
            {post.metadata?.timestamp && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Posted: {post.metadata.timestamp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 bg-[#1a1a1a] border-t border-gray-800">
          <button
            onClick={openOriginalPost}
            className="w-full py-3 bg-[#0A66C2] hover:bg-[#084d93] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            View on LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedinPostModal;

