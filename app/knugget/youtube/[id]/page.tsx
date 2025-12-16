/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Youtube,
  Play,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { useSummary } from "@/hooks/use-summaries";
import { Button } from "@/components/ui/button";
import { generateInfographic } from "@/lib/infographic-service";

interface YouTubeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function YouTubeDetailPage({ params }: YouTubeDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("summary");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState(false);
  const [infographicError, setInfographicError] = useState<string | null>(null);
  const [infographicUrl, setInfographicUrl] = useState<string | null>(null);

  // This hook fetches real data from your backend API
  const { summary, isLoading, error } = useSummary(
    resolvedParams ? resolvedParams.id : ""
  );

  // Resolve the params Promise
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Debug: Log the real data being fetched
  useEffect(() => {
    if (summary) {
      console.log("✅ Real summary data loaded:", summary);
      // Set infographic URL if it exists
      if (summary.infographicUrl) {
        // Convert relative path to full URL
        if (summary.infographicUrl.startsWith("/uploads")) {
          const apiBaseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
          const baseUrl = apiBaseUrl.replace("/api", "");
          const fullUrl = `${baseUrl}${summary.infographicUrl}`;
          console.log("🖼️ Infographic URL:", fullUrl);
          setInfographicUrl(fullUrl);
        } else {
          // Already a full URL or data URL
          console.log("🖼️ Infographic URL (direct):", summary.infographicUrl);
          setInfographicUrl(summary.infographicUrl);
        }
      }

    }
    if (error) {
      console.error("❌ Error fetching summary:", error);
    }
  }, [summary, error]);

  // Check for autoplay parameter and auto-start video
  useEffect(() => {
    const autoplay = searchParams.get("autoplay");
    if (autoplay === "true" && summary) {
      setIsVideoPlaying(true);
    }
  }, [searchParams, summary]);

  const handleBack = () => {
    router.back();
  };

  const handleOpenVideo = () => {
    if (summary?.videoUrl) {
      window.open(summary.videoUrl, "_blank");
    }
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const getYouTubeEmbedUrl = (videoId: string): string => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleGenerateInfographic = async () => {
    if (!summary || !summary.id) {
      setInfographicError("Summary not available");
      return;
    }

    setIsGeneratingInfographic(true);
    setInfographicError(null);

    try {
      const result = await generateInfographic({
        summaryId: summary.id,
        transcriptText: summary.transcriptText,
      });

      // Construct full URL if it's a relative path
      if (result.imageUrl.startsWith("/uploads")) {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
        const baseUrl = apiBaseUrl.replace("/api", "");
        const fullUrl = `${baseUrl}${result.imageUrl}`;
        console.log("🖼️ Generated infographic URL:", fullUrl);
        setInfographicUrl(fullUrl);
      } else {
        // Already a full URL or data URL
        console.log("🖼️ Generated infographic URL (direct):", result.imageUrl);
        setInfographicUrl(result.imageUrl);
      }
      setInfographicError(null);
    } catch (error) {
      console.error("Failed to generate infographic:", error);
      setInfographicError(
        error instanceof Error
          ? error.message
          : "Failed to generate infographic"
      );
    } finally {
      setIsGeneratingInfographic(false);
    }
  };

  // Loading state - shows while fetching real data
  if (isLoading || !resolvedParams) {
    return (
      <div className="min-h-screen bg-black text-white">
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - shows if API call fails
  if (error || !summary) {
    return (
      <div className="min-h-screen bg-black text-white">
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
            <p className="text-red-400">
              Failed to load video summary from API
            </p>
            <p className="text-gray-400 text-sm mt-2">{error}</p>
            <p className="text-gray-500 text-xs mt-2">
              API Endpoint: {process.env.NEXT_PUBLIC_API_BASE_URL}/summary/
              {resolvedParams?.id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state - renders real data from API
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
              <Youtube className="w-5 h-5 text-red-500" />
              <span className="text-white font-medium">YouTube</span>
            </div>
            <div className="text-gray-400 text-sm">
              {formatDate(summary.createdAt)}
            </div>
          </div>

          {/* Video Player / Thumbnail */}
          <div className="relative mb-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
              {isVideoPlaying && summary.videoUrl ? (
                // YouTube Embedded Player
                <iframe
                  src={getYouTubeEmbedUrl(
                    extractYouTubeVideoId(summary.videoUrl) || summary.videoId
                  )}
                  title={summary.videoTitle}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // Thumbnail with Play Button
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={handlePlayVideo}
                >
                  {summary.thumbnailUrl ? (
                    <>
                      <img
                        src={summary.thumbnailUrl}
                        alt={summary.videoTitle}
                        className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                        onError={(e) => {
                          console.log(
                            "❌ Thumbnail failed to load:",
                            summary.thumbnailUrl
                          );
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
                        <div className="bg-red-600 rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-colors">
                      <div className="text-center">
                        <Youtube className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 mb-2">
                          No thumbnail available
                        </p>
                        <div className="bg-red-600 rounded-full p-3 mx-auto w-fit">
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Duration Badge */}
                  {summary.videoDuration && !isVideoPlaying && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white text-sm px-2 py-1 rounded">
                      {summary.videoDuration}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
            {summary.videoTitle}
          </h1>

          {/* Channel */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {summary.channelName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-300">{summary.channelName}</span>
          </div>

          {/* Tags */}
          {/* {summary.tags && summary.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {summary.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-yellow-500 text-yellow-500 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )} */}

          {/* YouTube Link */}
          <div className="mb-6">
            <button
              onClick={handleOpenVideo}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="text-sm">YouTube Link</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-8 border-b border-gray-700">
              <button
                onClick={() => setActiveTab("transcript")}
                className={`pb-3 text-sm font-semibold transition-colors relative ${
                  activeTab === "transcript"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Transcript
                {activeTab === "transcript" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`pb-3 text-sm font-semibold transition-colors relative ${
                  activeTab === "summary"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Summary
                {activeTab === "summary" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("infographic")}
                className={`pb-3 text-sm font-semibold transition-colors relative ${
                  activeTab === "infographic"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Infographic
                {activeTab === "infographic" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-[#313130] rounded-lg p-6">
            {activeTab === "summary" ? (
              <SummarySection summary={summary} />
            ) : activeTab === "infographic" ? (
              <InfographicSection
                infographicUrl={infographicUrl}
                isGenerating={isGeneratingInfographic}
                error={infographicError}
                onGenerate={handleGenerateInfographic}
              />
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">
                  Transcript
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {summary.transcript && summary.transcript.length > 0 ? (
                    summary.transcript.map((segment, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-600 pl-4"
                      >
                        <div className="text-xs text-orange-400 mb-1">
                          {segment.timestamp}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {segment.text}
                        </p>
                      </div>
                    ))
                  ) : summary.transcriptText ? (
                    <div className="border-l-2 border-gray-600 pl-4">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {summary.transcriptText}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No transcript available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary Section Component with 4-part structure
interface SummarySectionProps {
  summary: {
    keyPoints?: string[];
    fullSummary?: string;
  };
}

function SummarySection({ summary }: SummarySectionProps) {
  const sections = parseSummaryIntoSections(summary.fullSummary || "");

  // Check if we have structured content
  const hasStructuredContent =
    sections.keyTakeaways.length > 0 ||
    sections.quotes.length > 0 ||
    sections.examples.length > 0 ||
    sections.detailedNotes.length > 0;

  // Fallback to simple display if no structured content
  if (!hasStructuredContent) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Summary</h2>
        <div className="space-y-4">
          {summary.keyPoints && summary.keyPoints.length > 0 ? (
            summary.keyPoints.map((point: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-0.5">📝</span>
                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
              </div>
            ))
          ) : summary.fullSummary ? (
            <div className="flex items-start space-x-3">
              <span className="text-lg flex-shrink-0 mt-0.5">📝</span>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {summary.fullSummary}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No summary available for this video.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Display structured summary
  return (
    <div className="space-y-8">
      {/* Top 3 Key Takeaways */}
      {sections.keyTakeaways.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-4 relative text-white">
            Top 3 Key Takeaways
            <div
              className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
              style={{
                background:
                  "linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%)",
              }}
            />
          </h4>
          <div className="space-y-4">
            {sections.keyTakeaways.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-start p-2 rounded transition-all duration-300 hover:bg-[rgba(255,107,53,0.05)]"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getKeyTakeawayIcon(index)}
                </span>
                <span className="text-sm leading-relaxed text-gray-300">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Memorable Quotes */}
      {sections.quotes.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-4 relative text-white">
            Top 3 Memorable Quotes
            <div
              className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
              style={{
                background:
                  "linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%)",
              }}
            />
          </h4>
          <div className="space-y-4">
            {sections.quotes.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-start p-2 rounded transition-all duration-300 hover:bg-[rgba(255,107,53,0.05)]"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getQuoteIcon(index)}
                </span>
                <span className="text-sm leading-relaxed italic text-gray-300">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Examples */}
      {sections.examples.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-4 relative text-white">
            Top 3 Examples
            <div
              className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
              style={{
                background:
                  "linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%)",
              }}
            />
          </h4>
          <div className="space-y-4">
            {sections.examples.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-start p-2 rounded transition-all duration-300 hover:bg-[rgba(255,107,53,0.05)]"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getExampleIcon(index)}
                </span>
                <span className="text-sm leading-relaxed text-gray-300">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Note of All Key Points */}
      {sections.detailedNotes.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-4 relative text-white">
            Detailed Note of All Key Points
            <div
              className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
              style={{
                background:
                  "linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%)",
              }}
            />
          </h4>
          <div className="space-y-6">
            {sections.detailedNotes.map((section, index) => (
              <div
                key={index}
                className="p-4 rounded-lg transition-all duration-300"
                style={{
                  background: "rgba(255, 107, 53, 0.02)",
                  border: "1px solid rgba(255, 107, 53, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 107, 53, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 107, 53, 0.02)";
                  e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.1)";
                }}
              >
                <h5
                  className="text-lg font-medium mb-2"
                  style={{ color: "#ff6b35" }}
                >
                  {section.title}
                </h5>
                <p className="text-sm leading-relaxed text-gray-300">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Parse AI response into structured sections
function parseSummaryIntoSections(fullSummary: string): {
  keyTakeaways: string[];
  quotes: string[];
  examples: string[];
  detailedNotes: Array<{ title: string; content: string }>;
} {
  const result: {
    keyTakeaways: string[];
    quotes: string[];
    examples: string[];
    detailedNotes: Array<{ title: string; content: string }>;
  } = {
    keyTakeaways: [],
    quotes: [],
    examples: [],
    detailedNotes: [],
  };

  const lines = fullSummary
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);
  let currentSection = "";
  let currentItems: string[] = [];
  let detailedNotesStarted = false;
  let currentNoteTitle = "";
  let currentNoteContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section headers
    if (line.match(/top\s*3\s*key\s*takeaways/i)) {
      saveCurrentSection();
      currentSection = "takeaways";
      detailedNotesStarted = false;
    } else if (line.match(/top\s*3\s*memorable\s*quotes/i)) {
      saveCurrentSection();
      currentSection = "quotes";
      detailedNotesStarted = false;
    } else if (line.match(/top\s*3\s*examples/i)) {
      saveCurrentSection();
      currentSection = "examples";
      detailedNotesStarted = false;
    } else if (line.match(/detailed\s*note/i)) {
      saveCurrentSection();
      currentSection = "detailed";
      detailedNotesStarted = true;
    } else {
      // Process content based on current section
      if (detailedNotesStarted) {
        // Detailed notes section - look for subsections
        if (line.startsWith("-") || line.match(/^\d+\./)) {
          // This is a bullet point - format: "- Title: Content" or "- Title"
          const cleaned = line.replace(/^[-\d.]\s*/, "").trim();
          if (cleaned) {
            // Check if there's a colon separating title and content
            const colonIndex = cleaned.indexOf(":");
            if (colonIndex > 0) {
              // Format: "Title: Content"
              const title = cleaned.substring(0, colonIndex).trim();
              const content = cleaned.substring(colonIndex + 1).trim();
              result.detailedNotes.push({
                title: title,
                content: content,
              });
            } else {
              // No colon - save previous note if exists
              if (currentNoteTitle && currentNoteContent.length > 0) {
                result.detailedNotes.push({
                  title: currentNoteTitle,
                  content: currentNoteContent.join(" "),
                });
                currentNoteContent = [];
              }
              currentNoteTitle = cleaned;
            }
          }
        } else if (line.length > 0) {
          // Regular content line (for multi-line notes)
          currentNoteContent.push(line);
        }
      } else if (
        currentSection &&
        (line.startsWith("-") || line.match(/^\d+\./) || line.match(/^[•●]/))
      ) {
        // Bullet point for takeaways/quotes/examples
        const cleaned = line.replace(/^[-\d.•●]\s*/, "").trim();
        if (cleaned) {
          currentItems.push(cleaned);
        }
      }
    }
  }

  // Save last section
  saveCurrentSection();
  if (currentNoteTitle && currentNoteContent.length > 0) {
    result.detailedNotes.push({
      title: currentNoteTitle,
      content: currentNoteContent.join(" "),
    });
  }

  function saveCurrentSection() {
    if (currentSection === "takeaways") {
      result.keyTakeaways = currentItems.slice(0, 3);
    } else if (currentSection === "quotes") {
      result.quotes = currentItems.slice(0, 3);
    } else if (currentSection === "examples") {
      result.examples = currentItems.slice(0, 3);
    }
    currentItems = [];
  }

  return result;
}

// Icons for each category
function getKeyTakeawayIcon(index: number): string {
  const icons = ["🎯", "💡", "⚡"];
  return icons[index] || "🎯";
}

function getQuoteIcon(index: number): string {
  const icons = ["💬", "📖", "✨"];
  return icons[index] || "💬";
}

function getExampleIcon(index: number): string {
  const icons = ["🔍", "📌", "🎓"];
  return icons[index] || "🔍";
}

// Infographic Section Component
interface InfographicSectionProps {
  infographicUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  onGenerate: () => void;
}

function InfographicSection({
  infographicUrl,
  isGenerating,
  error,
  onGenerate,
}: InfographicSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Infographic</h2>

      {/* Generate Button - Only shown when no infographic exists */}
      {!infographicUrl && !isGenerating && (
        <div className="text-center py-12">
          <div className="mb-6">
            <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-6">
              Generate a visual infographic from this video&apos;s transcript
            </p>
          </div>
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Generate Infographic
          </Button>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-300 mb-2">Generating your infographic...</p>
          <p className="text-gray-500 text-sm">This may take up to 2 minutes</p>
        </div>
      )}

      {/* Display Generated Infographic - No buttons, just the image */}
      {infographicUrl && !isGenerating && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 overflow-auto max-h-[600px]">
            <img
              src={infographicUrl}
              alt="Generated Infographic"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                console.error("Failed to load infographic:", infographicUrl);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
