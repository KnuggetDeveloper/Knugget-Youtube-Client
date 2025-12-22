"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Linkedin,
  User,
  ThumbsUp,
  MessageSquare,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLinkedinPost } from "@/hooks/use-linkedin-posts";

export default function LinkedinPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const { post, isLoading, error } = useLinkedinPost(postId);

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

  const handleBack = () => {
    router.back();
  };

  const openOriginalPost = () => {
    if (post?.postUrl) {
      window.open(post.postUrl, "_blank", "noopener,noreferrer");
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A66C2]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
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
            <p className="text-red-400">Failed to load LinkedIn post</p>
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
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              <span className="text-white font-medium">LinkedIn</span>
            </div>
            <div className="text-gray-400 text-sm">
              {formatDate(post.savedAt)}
            </div>
          </div>

          {/* Author Section */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
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
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">{post.author}</h3>
              {post.metadata?.timestamp && (
                <p className="text-gray-400 text-sm">
                  {post.metadata.timestamp}
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          {post.title && (
            <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
              {post.title}
            </h1>
          )}

          {/* LinkedIn Link */}
          <div className="mb-6">
            <button
              onClick={openOriginalPost}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="text-sm">LinkedIn Link</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-[#313130] rounded-lg p-6">
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
              <div className="flex items-center gap-8 pt-6 border-t border-gray-600">
                {post.engagement.likes !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ThumbsUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {formatNumber(post.engagement.likes)}
                      </p>
                      <p className="text-gray-500 text-xs">Likes</p>
                    </div>
                  </div>
                )}
                {post.engagement.comments !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {formatNumber(post.engagement.comments)}
                      </p>
                      <p className="text-gray-500 text-xs">Comments</p>
                    </div>
                  </div>
                )}
                {post.engagement.shares !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Share2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {formatNumber(post.engagement.shares)}
                      </p>
                      <p className="text-gray-500 text-xs">Shares</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
