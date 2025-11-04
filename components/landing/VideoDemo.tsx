/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { videoData } from "@/data/videoData";
import TranscriptView from "./TranscriptView";
import SummaryView from "./SummaryView";

// Import all data statically - no loading states, just like the old version
import video1Transcripts from "@/data/transcripts/video1";
import video2Transcripts from "@/data/transcripts/video2";
import video3Transcripts from "@/data/transcripts/video3";
import video4Transcripts from "@/data/transcripts/video4";
import video1Summary from "@/data/summaries/video1";
import video2Summary from "@/data/summaries/video2";
import video3Summary from "@/data/summaries/video3";
import video4Summary from "@/data/summaries/video4";

// Create data maps for instant access
const transcriptsMap: any = {
  video1: video1Transcripts,
  video2: video2Transcripts,
  video3: video3Transcripts,
  video4: video4Transcripts,
};

const summariesMap: any = {
  video1: video1Summary,
  video2: video2Summary,
  video3: video3Summary,
  video4: video4Summary,
};

interface VideoData {
  id: string;
  videoId: string;
  title: string;
  duration: string;
}

export default function VideoDemo() {
  const [activeContentView, setActiveContentView] = useState("summary");
  const [activeVideo, setActiveVideo] = useState("video1");
  const [videoOrder, setVideoOrder] = useState<VideoData[]>(videoData);

  // Get data instantly from the maps - no loading needed!
  const transcripts = transcriptsMap[activeVideo];
  const summary = summariesMap[activeVideo];

  const handleVideoClick = (clickedVideoId: string) => {
    const newOrder = [...videoOrder];
    const clickedVideoIndex = newOrder.findIndex(
      (v) => v.id === clickedVideoId
    );

    if (clickedVideoIndex > 0) {
      const clickedVideo = newOrder[clickedVideoIndex];
      const currentMainVideo = newOrder[0];

      newOrder[0] = clickedVideo;
      newOrder[clickedVideoIndex] = currentMainVideo;

      setVideoOrder(newOrder);
      setActiveVideo(clickedVideo.id);
    }
  };

  const mainVideo = videoOrder[0];
  const relatedVideos = videoOrder.slice(1);

  return (
    <section
      className="py-20 px-4 sm:px-6"
      style={{
        background: "var(--secondary-bg)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 knugget-gradient-text">
          See Knugget in Action
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Player */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              background: "var(--primary-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${mainVideo.videoId}`}
                title={mainVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {mainVideo.title}
              </h3>
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Duration: {mainVideo.duration}
              </span>
            </div>

            {/* Related Videos */}
            <div
              className="p-4 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <h4
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                More Examples
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {relatedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="cursor-pointer rounded overflow-hidden border transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor:
                        activeVideo === video.id
                          ? "var(--accent-primary)"
                          : "var(--border-color)",
                    }}
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div
                      className="p-2"
                      style={{ background: "rgba(0, 0, 0, 0.8)" }}
                    >
                      <div
                        className="text-xs font-medium line-clamp-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {video.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Panel */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              background: "var(--primary-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Controls/Tabs */}
            <div
              className="p-4 border-b flex items-center justify-between flex-wrap gap-4"
              style={{
                background: "var(--secondary-bg)",
                borderBottomColor: "var(--border-color)",
              }}
            >
              <div className="flex gap-2">
                {[
                  { icon: "K", view: "summary", label: "Summary" },
                  { icon: "💬", view: "transcript", label: "Transcript" },
                ].map((btn, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 flex items-center justify-center rounded border transition-all duration-300"
                    style={{
                      borderColor:
                        activeContentView === btn.view
                          ? "var(--accent-primary)"
                          : "var(--border-color)",
                      color:
                        activeContentView === btn.view
                          ? "var(--accent-primary)"
                          : "var(--text-secondary)",
                      boxShadow:
                        activeContentView === btn.view
                          ? "var(--accent-glow)"
                          : "none",
                    }}
                    onClick={() => setActiveContentView(btn.view)}
                    onMouseEnter={(e) => {
                      if (activeContentView !== btn.view) {
                        e.currentTarget.style.borderColor =
                          "var(--accent-primary)";
                        e.currentTarget.style.color = "var(--accent-primary)";
                        e.currentTarget.style.boxShadow = "var(--accent-glow)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeContentView !== btn.view) {
                        e.currentTarget.style.borderColor =
                          "var(--border-color)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {btn.view === "summary" ? (
                      <Image
                        src="/logo.png"
                        alt="Knugget Logo"
                        width={20}
                        height={20}
                        className="object-contain"
                        style={{
                          filter:
                            activeContentView === btn.view
                              ? "drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))"
                              : "none",
                        }}
                      />
                    ) : (
                      btn.icon
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area - instant load, no loading states! */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {activeContentView === "transcript" ? (
                <TranscriptView transcripts={transcripts} />
              ) : (
                <SummaryView summary={summary} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
