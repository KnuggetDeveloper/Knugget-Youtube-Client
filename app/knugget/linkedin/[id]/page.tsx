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
  Calendar,
  Clock,
  Trash2,
  Loader2,
} from "lucide-react";
import { useLinkedinPost, useLinkedinPostActions } from "@/hooks/use-linkedin-posts";

export default function LinkedinPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const { post, isLoading, error } = useLinkedinPost(postId);
  const { deletePost, isLoading: isDeleting } = useLinkedinPostActions();

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

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      const success = await deletePost(postId);
      if (success) {
        router.push("/dashboard");
      }
    }
  };

  const openOriginalPost = () => {
    if (post?.postUrl) {
      window.open(post.postUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Post not found</h2>
          <p className="text-gray-400 mb-4">{error || "The post you're looking for doesn't exist."}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#084d93] transition-colors"
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
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            <span className="text-white font-semibold">LinkedIn Post</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openOriginalPost}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Open original post"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              title="Delete post"
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
          <div className="p-6 sm:p-8">
            {/* Author Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
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
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl">{post.author}</h3>
                <p className="text-gray-400 text-sm">
                  Saved {formatDate(post.savedAt)}
                </p>
              </div>
            </div>

            {/* Title */}
            {post.title && (
              <h1 className="text-2xl font-bold text-white mb-6">{post.title}</h1>
            )}

            {/* Post Content */}
            <div className="mb-8">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
                {post.content}
              </p>
            </div>

            {/* Post Image */}
            {post.imageUrl && (
              <div className="mb-8 rounded-xl overflow-hidden">
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
              <div className="flex items-center gap-8 py-6 border-t border-b border-gray-800 mb-6">
                {post.engagement.likes !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ThumbsUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {formatNumber(post.engagement.likes)}
                      </p>
                      <p className="text-gray-500 text-xs">Likes</p>
                    </div>
                  </div>
                )}
                {post.engagement.comments !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {formatNumber(post.engagement.comments)}
                      </p>
                      <p className="text-gray-500 text-xs">Comments</p>
                    </div>
                  </div>
                )}
                {post.engagement.shares !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Share2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {formatNumber(post.engagement.shares)}
                      </p>
                      <p className="text-gray-500 text-xs">Shares</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Saved: {formatDate(post.savedAt)}</span>
              </div>
              {post.metadata?.timestamp && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Posted: {post.metadata.timestamp}</span>
                </div>
              )}
            </div>

            {/* View on LinkedIn Button */}
            <button
              onClick={openOriginalPost}
              className="w-full py-4 bg-[#0A66C2] hover:bg-[#084d93] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              View on LinkedIn
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

