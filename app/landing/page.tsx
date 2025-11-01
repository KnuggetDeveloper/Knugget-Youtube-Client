/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/firebase-auth-context";
import { Button } from "@/components/ui/button";

// Floating icons for the background
const floatingIcons = [
  { icon: "🔬", id: "icon-1", delay: "0s" },
  { icon: "👍", id: "icon-2", delay: "1s" },
  { icon: "📹", id: "icon-3", delay: "2s" },
  { icon: "🎤", id: "icon-4", delay: "3s" },
  { icon: "🧠", id: "icon-5", delay: "4s" },
  { icon: "🚀", id: "icon-6", delay: "5s" },
  { icon: "👤", id: "icon-7", delay: "0.5s" },
  { icon: "⭐", id: "icon-8", delay: "1.5s" },
  { icon: "🦄", id: "icon-9", delay: "2.5s" },
  { icon: "⚔️", id: "icon-10", delay: "3.5s" },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeContentView, setActiveContentView] = useState("summary"); // "transcript" or "summary"
  const [activeVideo, setActiveVideo] = useState("video1"); // "video1", "video2", "video3", or "video4"
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState("lXUZvyajciY"); // Currently playing video ID
  
  // Video data array for dynamic rotation
  const [videoOrder, setVideoOrder] = useState([
    {
      id: "video1",
      videoId: "lXUZvyajciY",
      title: "Andrej Karpathy — \"We're summoning ghosts, not building animals\"",
      duration: "1:32:15"
    },
    {
      id: "video2", 
      videoId: "DcWqzZ3I2cY",
      title: "Jeff Bezos - Space & Innovation",
      duration: "1:45:30"
    },
    {
      id: "video3",
      videoId: "g-WeCOUYBrk", 
      title: "Marc Andreessen & Amjad Masad - AI & Coding",
      duration: "2:15:45"
    },
    {
      id: "video4",
      videoId: "D7_ipDqhtwk",
      title: "Barry Zhang - Building Effective Agents", 
      duration: "45:20"
    }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/");
    } else {
      router.push("/signup");
    }
  };

  const handleInstallClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add ripple effect
    const button = e.currentTarget;
    const ripple = document.createElement("div");
    ripple.className = "absolute rounded-full bg-orange-300/30 animate-ping";
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.left = "50%";
    ripple.style.top = "50%";
    ripple.style.transform = "translate(-50%, -50%)";

    button.style.position = "relative";
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

    // Handle actual install logic here
    handleGetStarted();
  };

  // Function to handle video rotation when clicking related videos
  const handleVideoRotation = (clickedVideoIndex: number) => {
    const newOrder = [...videoOrder];
    const clickedVideo = newOrder[clickedVideoIndex + 1]; // +1 because index 0 is main video
    const currentMainVideo = newOrder[0];
    
    // Swap the clicked video with the main video
    newOrder[0] = clickedVideo;
    newOrder[clickedVideoIndex + 1] = currentMainVideo;
    
    setVideoOrder(newOrder);
    setActiveVideo(clickedVideo.id);
    setCurrentPlayingVideo(clickedVideo.videoId);
  };

  const getVideoInfo = (videoId: string) => {
    const videoMap = {
      lXUZvyajciY: {
        title:
          'Andrej Karpathy — "We\'re summoning ghosts, not building animals"',
        description:
          "YouTube Video: Andrej Karpathy discusses AI agents, education, and the future",
        duration: "1:32:15",
      },
      DcWqzZ3I2cY: {
        title: "Jeff Bezos - Space & Innovation",
        description:
          "YouTube Video: Jeff Bezos discusses space exploration, Blue Origin, and innovation",
        duration: "1:45:30",
      },
      "g-WeCOUYBrk": {
        title: "Marc Andreessen & Amjad Masad - AI & Coding",
        description:
          "YouTube Video: Marc Andreessen & Amjad Masad discuss AI agents and the future of coding",
        duration: "2:15:45",
      },
      D7_ipDqhtwk: {
        title: "Barry Zhang - Building Effective Agents",
        description:
          "YouTube Video: Barry Zhang from Anthropic discusses how to build effective AI agents",
        duration: "45:20",
      },
    };
    return (
      videoMap[videoId as keyof typeof videoMap] || videoMap["lXUZvyajciY"]
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--primary-bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-primary)",
      }}
    >
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-md border-b" : ""
        }`}
        style={{
          background: scrolled ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.9)",
          borderBottomColor: scrolled
            ? "rgba(255, 107, 53, 0.3)"
            : "var(--border-color)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div
                className="h-8 w-8 rounded flex items-center justify-center"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))",
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  K
                </span>
              </div>
              <span
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Knugget
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#"
                className="transition-colors"
                style={{
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              ></Link>
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push("/")}
                  className="px-6 py-2 rounded font-semibold transition-all duration-300 hover:transform hover:translate-y-[-2px]"
                  style={{
                    background: "var(--accent-gradient)",
                    color: "var(--primary-bg)",
                    boxShadow: "0 0 0 rgba(255, 107, 53, 0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "var(--accent-glow-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 rgba(255, 107, 53, 0)";
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="px-6 py-2 rounded font-semibold transition-all duration-300 hover:transform hover:translate-y-[-2px]"
                  style={{
                    background: "var(--accent-gradient)",
                    color: "var(--primary-bg)",
                    boxShadow: "0 0 0 rgba(255, 107, 53, 0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "var(--accent-glow-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 rgba(255, 107, 53, 0)";
                  }}
                >
                  G Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div
              className="md:hidden py-4 border-t"
              style={{ borderTopColor: "var(--border-color)" }}
            >
              <div className="space-y-4">
                <Link
                  href="#"
                  className="block transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-secondary)")
                  }
                >
                  EN
                </Link>
                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      router.push("/");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-2 rounded font-semibold"
                    style={{
                      background: "var(--accent-gradient)",
                      color: "var(--primary-bg)",
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <button
                    onClick={() => {
                      handleGetStarted();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-2 rounded font-semibold"
                    style={{
                      background: "var(--accent-gradient)",
                      color: "var(--primary-bg)",
                    }}
                  >
                    G Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden"
        style={{
          background: "var(--primary-bg)",
          paddingTop: "70px",
        }}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Main Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 leading-tight fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div style={{ color: "var(--text-primary)" }} className="mb-4">
              Summarize Videos Within YouTube
            </div>
            <div className="knugget-gradient-text">
              Save Time, Get Insights Instantly!
            </div>
          </h1>

          {/* CTA Button */}
          <div className="mb-8 fade-in" style={{ animationDelay: "0.3s" }}>
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 relative overflow-hidden hover:transform hover:translate-y-[-3px]"
              style={{
                background: "var(--accent-gradient)",
                color: "var(--primary-bg)",
                boxShadow: "0 0 0 rgba(255, 107, 53, 0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--accent-glow-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 rgba(255, 107, 53, 0)";
              }}
            >
              <span className="mr-3 text-xl">🌐</span>
              <span>Install on Chrome</span>
            </button>
          </div>
        </div>

        {/* Background Icons */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {floatingIcons.map((item, index) => (
            <div
              key={item.id}
              className="absolute text-2xl float-animation"
              style={{
                color: "rgba(255, 107, 53, 0.1)",
                animationDelay: item.delay,
                top: `${10 + index * 7}%`,
                left: index % 2 === 0 ? `${10 + index * 2}%` : "auto",
                right: index % 2 === 1 ? `${10 + index * 2}%` : "auto",
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Section */}
      <section
        className="py-16 min-h-screen"
        style={{ background: "var(--secondary-bg)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left Column - Video Player */}
            <div className="space-y-6">
              {/* Featured Video */}
              <div
                className="rounded-xl border overflow-hidden transition-all duration-300 hover:transform hover:translate-y-[-5px]"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  boxShadow: "var(--shadow-lg)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--accent-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
              >
                <div className="relative h-[300px] overflow-hidden rounded-t-xl">
                  {/* YouTube Embedded Player */}
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoOrder[0].videoId}?rel=0&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-2 leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {videoOrder[0].title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {getVideoInfo(videoOrder[0].videoId).description}
                  </p>
                </div>
              </div>

              {/* Related Videos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {videoOrder.slice(1).map((video, index) => (
                  <div
                    key={index}
                    className="rounded-lg border overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:translate-y-[-3px]"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: "var(--border-color)",
                    }}
                    onClick={() => {
                      if (video.videoId) {
                        handleVideoRotation(index);
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--accent-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                    }}
                  >
                    <div
                      className="h-[120px] flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: video.videoId
                          ? "transparent"
                          : "linear-gradient(135deg, #444 0%, #666 100%)",
                      }}
                    >
                      {video.videoId ? (
                        <>
                          {/* YouTube Thumbnail for Video 2 */}
                          <Image
                            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                            alt={video.title}
                            fill
                            className="object-cover"
                            unoptimized={true}
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300">
                            <div
                              className="text-2xl transition-transform duration-300 hover:scale-110"
                              style={{
                                color: "var(--accent-primary)",
                                textShadow: "var(--accent-glow)",
                                filter:
                                  "drop-shadow(0 0 5px rgba(0, 0, 0, 0.8))",
                              }}
                            >
                              ▶
                            </div>
                          </div>
                        </>
                      ) : (
                      <div
                        className="px-3 py-2 rounded text-xs font-medium text-center"
                        style={{
                          background: "rgba(0, 0, 0, 0.8)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {video.title}
                      </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Summary Panel */}
            <div
              className="rounded-xl border overflow-hidden h-fit"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-color)",
                boxShadow: "var(--shadow-lg)",
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
                    { icon: "K", view: "transcript", label: "Transcript" },
                    { icon: "💬", view: "summary", label: "Summary" },
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
                          e.currentTarget.style.boxShadow =
                            "var(--accent-glow)";
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
                      {btn.view === "transcript" ? (
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

              {/* Content Area - Transcript or Summary */}
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {activeContentView === "transcript" ? (
                  /* Transcript View */
                  <div className="space-y-2">
                    {(() => {
                      let transcriptData: Array<{
                        time: string;
                        text: string;
                      }> = [];

                      if (activeVideo === "video1") {
                        transcriptData = [
                      {
                        time: "0:00",
                            text: "General stance on reinforcement learning (RL) and optimism: He begins by calling RL 'terrible' in the abstract but insists that prior approaches were worse and that progress is tractable and optimistic.",
                      },
                      {
                            time: "2:30",
                            text: "The chatter on social media (fundraising, hype) clouds practical progress; his focus is on building useful systems, not ghostly demos.",
                      },
                      {
                            time: "5:15",
                            text: "The decade vs. year framing for agents: The phrase 'the decade of agents' is a reaction to the claim that we're in the year of agents due to LLMs; he believes the trend will unfold over a decade with gradual improvements.",
                      },
                      {
                            time: "8:45",
                            text: "Early agents (Cloud, CodeEx, etc.) are impressive and used daily, but significant work remains: multimodality, continual learning, robust memory, and real-world interaction.",
                      },
                      {
                            time: "12:20",
                            text: "How to think about a real agent: An agent is like an employee or intern: a tool that should be deployed when it can actually do the work. Current agents fail because they are not intelligent enough, multimodal, or capable of continual learning.",
                      },
                      {
                            time: "16:10",
                            text: "The bottlenecks: lack of intelligence, multimodality, ability to use computers, continual lifelong learning, and robust representations.",
                      },
                      {
                            time: "20:30",
                            text: "History and breakthroughs in AI as context: He contextualizes major shifts: deep learning near Hinton's era; AlexNet's reorientation toward neural nets; Atari/RL shift in 2013 as an early attempt at agents but ultimately a misstep because games don't necessarily lead to general intelligence.",
                      },
                      {
                            time: "25:15",
                            text: "He argues for a progression: per-task neural nets, then pretraining representations (the LLM stage), then agents built on top of strong representations, rather than attempting to leap straight to agents.",
                      },
                      {
                            time: "28:40",
                            text: "Representations vs. evolution in brains: He cautions against over-anthropomorphizing AI by drawing too close parallels to animal brains: evolution shapes brains with hardwired hardware, while AI builds 'ghosts' by imitating humans and data on the internet.",
                      },
                      {
                            time: "32:25",
                            text: "Pre-training is framed as a 'crappy evolution' that provides a starting point, not the full animal. He sees a path to more animal-like properties by improving representations and architectural stacks on top of LLMs, but it's not strictly about mimicking evolution.",
                      },
                      {
                            time: "36:50",
                            text: "The role of pre-training and the cognitive core: Pre-training encodes knowledge and fosters in-context learning, but the knowledge can become a crutch; a cognitive core—an intelligent, algorithmic essence stripped of excess knowledge—could be more powerful for general problem solving.",
                      },
                      {
                            time: "40:15",
                            text: "He emphasizes the need to reduce memory reliance in the weights and to use external or working memory to expand horizon length without bloat.",
                      },
                      {
                            time: "43:30",
                            text: "In-context learning vs. pre-training: In-context learning is pattern completion within a token window that leverages a vast internet with internalized patterns; it potentially uses a small internal gradient-like process.",
                      },
                      {
                            time: "46:45",
                            text: "Some papers show that linear regression can be performed inside the context, suggesting some internal optimization-like phenomenon. The difference between the two: in-context learning uses an active working memory vs. pre-training; weights store a compressed memory of the internet, not raw data.",
                      },
                      {
                            time: "50:20",
                            text: "Memory, working memory, and long contexts: Weights contain a hazy memory of training data; context windows (KV cache) act as working memory that is directly accessible to the model.",
                      },
                      {
                            time: "53:10",
                            text: "They highlight long-context capabilities via sparse attention and memory architectures; future AI likely needs both strong working memory and compact cognitive cores.",
                      },
                      {
                            time: "56:30",
                            text: "Architecture and scaling trajectory: He predicts that in 10 years, major architectural ideas will persist: giant neural nets trained with gradient descent, but with advances across data, hardware, kernels, and algorithms.",
                      },
                      {
                            time: "59:45",
                            text: "He emphasizes that progress requires improvements across multiple dimensions (architecture, optimizer, loss functions) in tandem.",
                          },
                          {
                            time: "62:15",
                            text: "Nanochat and code tooling: Nanochat is a minimal, end-to-end repository for building a ChatGPT-like assistant; it's intentionally simple to teach the pipeline but is not boilerplate code.",
                          },
                          {
                            time: "65:30",
                            text: "He notes limitations in LLMs for code: LLMs can be good for boilerplate or boilerplate-like tasks but struggle with uniquely structured, non-boilerplate, deeply technical code; specific integration decisions by the user are essential.",
                          },
                          {
                            time: "68:45",
                            text: "LLMs as a continuum with computing: He views AI as an extension of computing—progress resembles a continuum from compilers to runtime optimizations to AI-assisted coding and beyond.",
                          },
                          {
                            time: "71:20",
                            text: "The 'autonomy slider' concept is introduced: increasing automation of tasks that can be automated, while leaving humans to supervise higher-level processes.",
                          },
                          {
                            time: "74:10",
                            text: "Role of AI in coding vs. other domains: AI has been highly effective in coding and text-heavy domains due to structured, textual patterns and well-established tooling (IDEs, diffs, version control).",
                          },
                          {
                            time: "77:25",
                            text: "Other domains (slides, non-text visuals) are harder due to lack of robust diffs and standard infrastructure. Even so, there is a gap in applying AI effectively to non-code, non-text tasks, due to the lack of consistent representations and evaluation methods.",
                          },
                          {
                            time: "80:40",
                            text: "The nature of education in the AI era: Eureka and Starfleet Academy aim to create elite educational institutions and scalable digital courses, with a focus on 'ramps to knowledge' and Eurekas per second.",
                          },
                          {
                            time: "83:15",
                            text: "The goal is not only to teach but to empower and safeguard humanity by equipping people to understand and guide AI, preventing a dystopian outcome.",
                          },
                          {
                            time: "86:30",
                            text: "The near-term plan: hire faculty to build state-of-the-art courses; later, AI assistants may act as TAs; in the long term, AI could take over more design and instruction tasks.",
                          },
                          {
                            time: "89:45",
                            text: "The concept of culture and multi-agent systems: He believes a true AI culture among LLMs would require agents that can create, read, and respond to each other's content, akin to cultural transmission and self-play.",
                          },
                          {
                            time: "92:20",
                            text: "He expects a gradual emergence of culture and collaboration rather than a sudden, singular 'AGI moment.'",
                          },
                          {
                            time: "95:10",
                            text: "Self-driving as a comparison: He uses self-driving as a benchmark and argues it's not a complete analogy to AI education or coding agents. The self-driving domain is safety-critical and requires robust perception and generalization.",
                          },
                          {
                            time: "98:25",
                            text: "He notes that self-driving progress is slow due to safety, regulatory, and deployment constraints; the AI coding domain may progress differently due to lower physical risk costs.",
                          },
                          {
                            time: "101:40",
                            text: "AGI, growth, and economic impact: He distinguishes two camps: one that expects an economic explosion (a discrete leap, a singular breakthrough) and one that expects gradual diffusion of AI capabilities across industries.",
                          },
                          {
                            time: "104:15",
                            text: "He is skeptical of a sudden, singular AGI leap but acknowledges that AI will diffuse across the economy, with productivity gains accruing to both coders and non-coders as automation expands.",
                          },
                          {
                            time: "107:30",
                            text: "He emphasizes that the growth rate of the economy has been accelerating slowly due to automation for centuries and expects AI to follow a similar trajectory—more gradual, not a sudden jump.",
                          },
                          {
                            time: "110:45",
                            text: "Safety, governance, and societal impact: He expresses concern about humanity's ability to manage increasingly autonomous AI systems and emphasizes the importance of education to keep humans in control.",
                          },
                          {
                            time: "113:20",
                            text: "He acknowledges geopolitical and regulatory considerations and urges grounding expectations in reality and caution to avoid missteps.",
                          },
                          {
                            time: "116:35",
                            text: "Final notes on personal journey and philosophy: He discusses his roles, the evolution from Tesla to OpenAI-style environments, and his personal belief that 'the geniuses of today are barely scratching the surface' of human potential.",
                          },
                          {
                            time: "119:50",
                            text: "He reiterates that he remains optimistic about the potential of AI, provided that education, governance, and responsible deployment keep pace with technical advances.",
                          },
                        ];
                      } else if (activeVideo === "video2") {
                        transcriptData = [
                          {
                            time: "0:00",
                            text: "Impossible with great caution - referring to the Apollo era mindset and how pushing through the impossible requires careful, disciplined thinking",
                          },
                          {
                            time: "3:20",
                            text: "The only way to get to that vision is with giant space stations",
                          },
                          {
                            time: "7:15",
                            text: "We will take materials from the Moon and near-Earth objects and the asteroid belt",
                          },
                          {
                            time: "12:30",
                            text: "Day one thinking is how you start fresh every day... unless you know a better way",
                          },
                          {
                            time: "18:45",
                            text: "Blue Ring provides thermal management, power, compute, and communications—essentially APIs for space payloads",
                          },
                          {
                            time: "25:10",
                            text: "New Glenn rocket uses seven BE-4 engines on the first stage with liquid hydrogen and liquid oxygen",
                          },
                          {
                            time: "32:20",
                            text: "The 10,000-year Clock project encourages future-oriented decision making and sustainability",
                          },
                          {
                            time: "38:15",
                            text: "Manufacturing is the hard part - pushing production capability to rate determines whether cost reductions materialize",
                          },
                          {
                            time: "45:30",
                            text: "One-way vs two-way doors: Two-way decisions allow reversal, one-way doors require deliberate thinking",
                          },
                          {
                            time: "52:45",
                            text: "Disagree and commit: Even when disagreeing, teams should commit to the decision to move forward",
                          },
                          {
                            time: "58:20",
                            text: "Six-page narrative memos read in silence followed by discussion force clarity and prevent overreliance on slides",
                          },
                          {
                            time: "65:10",
                            text: "Customer obsession: The customer is central to decision-making with metrics reflecting actual customer happiness",
                          },
                          {
                            time: "72:30",
                            text: "AI as discovery vs. invention: Large language models are more like discoveries than engineered inventions",
                          },
                          {
                            time: "78:45",
                            text: "Competitive but collaborative space industry with multiple winners pushing the broader frontier forward",
                          },
                        ];
                      } else if (activeVideo === "video3") {
                        // Video 3: Marc Andreessen & Amjad Masad
                        transcriptData = [
                          {
                            time: "0:00",
                            text: "Instead of typing syntax, you're actually typing thoughts, which is what we ultimately want. And the machine writes the code.",
                          },
                          {
                            time: "4:15",
                            text: "The agent is a programmer that has tools and interface. It's a bot… a multi-agent system that can test, debug, and iterate just like a human.",
                          },
                          {
                            time: "8:30",
                            text: "Worse is better. We're in a local maximum trap where it's good enough for so much economically productive work",
                          },
                          {
                            time: "12:45",
                            text: "End-to-end product building in 20–30 minutes: the agent reads a user's English description and builds the complete app",
                          },
                          {
                            time: "18:20",
                            text: "Multi-agent collaboration: multiple agents work in parallel on features and merge their outputs into a cohesive product",
                          },
                          {
                            time: "24:10",
                            text: "Verification-driven improvement: adding a verifier in the loop to run and validate actions, enabling longer-running agent sessions",
                          },
                          {
                            time: "30:35",
                            text: "Language as programming language: English can be the primary programming language with AI understanding translating natural language prompts",
                          },
                          {
                            time: "36:50",
                            text: "Grace Hopper's vision of moving from machine code toward English-like programming is being realized",
                          },
                          {
                            time: "42:15",
                            text: "Long context is crucial. Techniques include context memory management and compression of logs and data",
                          },
                          {
                            time: "48:30",
                            text: "Reinforcement learning with code execution feedback enables the model to roll out multiple trajectories",
                          },
                          {
                            time: "54:45",
                            text: "Meter and SOBench benchmarks track how long models can reason coherently in useful tasks",
                          },
                          {
                            time: "60:20",
                            text: "Transfer learning across domains remains hard; expertise in one domain doesn't automatically transfer to another",
                          },
                          {
                            time: "66:10",
                            text: "The combination of neural models with discrete, deterministic search methods mirrors AlphaGo's hybrid approach",
                          },
                          {
                            time: "72:25",
                            text: "By next year, developers will manage multiple agents in parallel to plan and implement features, refactor databases",
                          },
                        ];
                      } else {
                        // Video 4: Barry Zhang - Building Effective Agents
                        transcriptData = [
                          {
                            time: "0:00",
                            text: "Don't build agents for everything.",
                          },
                          {
                            time: "2:30",
                            text: "Keep it as simple as possible.",
                          },
                          {
                            time: "5:15",
                            text: "Think like your agents. Gain their perspective, and help them do their job.",
                          },
                          {
                            time: "8:45",
                            text: "Early stage: simple features like summarization, classification, extraction became table stakes.",
                          },
                          {
                            time: "12:20",
                            text: "Agents can decide their trajectory and operate with environment feedback, enabling more autonomy.",
                          },
                          {
                            time: "16:10",
                            text: "Agents scale complex, valuable tasks but are not a universal replacement for all use cases.",
                          },
                          {
                            time: "20:30",
                            text: "Task complexity: Agents shine in ambiguous problems; if you can map every node in a decision tree, explicit builds are cost-effective.",
                          },
                          {
                            time: "25:15",
                            text: "Real-world example: coding as a great agent use-case due to its ambiguity from design doc to PR.",
                          },
                          {
                            time: "28:40",
                            text: "An agent is a loop with three defining components: environment, tools, and system prompt.",
                          },
                          {
                            time: "32:25",
                            text: "Upfront complexity kills iteration speed; focusing on these three components yields the highest ROI.",
                          },
                          {
                            time: "36:50",
                            text: "Agents can appear highly sophisticated, but each step is limited inference over a small context window.",
                          },
                          {
                            time: "40:15",
                            text: "If you were a computer-using agent with simple tools, your actions would be reactive to tool outputs.",
                          },
                          {
                            time: "43:30",
                            text: "Budgeting agents: Agents lack strong built-in budget control; defining budgets in time, money, or tokens is an open area.",
                          },
                          {
                            time: "45:00",
                            text: "Multi-agent collaboration: Expect more multi-agent collaborations in production with sub-agents protecting context.",
                          },
                        ];
                      }

                      return transcriptData.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-start py-2 px-3 rounded transition-all duration-300 cursor-pointer hover:bg-opacity-50"
                        style={{
                          borderLeft: "3px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 107, 53, 0.05)";
                          e.currentTarget.style.borderLeftColor =
                            "var(--accent-primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderLeftColor =
                              "transparent";
                        }}
                      >
                        <span
                          className="text-xs font-mono px-2 py-1 rounded flex-shrink-0"
                          style={{
                            background: "var(--accent-primary)",
                            color: "var(--primary-bg)",
                            minWidth: "45px",
                            textAlign: "center",
                          }}
                        >
                          {item.time}
                        </span>
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.text}
                        </span>
                      </div>
                      ));
                    })()}
                  </div>
                ) : (
                  /* Summary View */
                  <div className="space-y-8">
                    {(() => {
                      if (activeVideo === "video1") {
                        return (
                          /* Andre Karpathy Content */
                          <>
                            {/* Top 3 Key Takeaways */}
                    <div>
                      <h4
                        className="text-xl font-semibold mb-4 relative"
                        style={{ color: "var(--text-primary)" }}
                      >
                                Top 3 Key Takeaways
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "🤖",
                                    text: "The decade of agents vs. year of agents: Andre Karpathy argues that progress will come from progressively capable, multimodal agents that can operate with real-world tasks over a decade, rather than expecting a single 'year of AGI.' This framing emphasizes a staged, additive progression across representations, memory, and interaction with the world.",
                                  },
                                  {
                                    icon: "🧠",
                                    text: "Pre-training vs. context learning; cognitive core concept: He distinguishes between pre-training (large token-based knowledge encoding with heavy compression) and in-context learning (dynamic working memory, near-term adaptation). He envisions a cognitive core—a lean, memory-light core containing algorithms and problem-solving strategies—surrounded by knowledge that could be distilled or reduced to avoid collapse and improve long-horizon reasoning.",
                                  },
                                  {
                                    icon: "🎓",
                                    text: "Education as a crucial frontier and societal anchor: Beyond engineering progress, Karpathy is pursuing Eureka and Starfleet Academy as ways to reshape education with AI tutors, ramps to knowledge, and scalable training for millions. He envisions a future where AI-enabled education empowers humans to stay in control and flourish, not replace them.",
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top 3 Memorable Quotes */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Memorable Quotes
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "👻",
                                    text: "\"We're not actually building animals. We're building ghosts.\"",
                                  },
                                  {
                                    icon: "🥤",
                                    text: '"Sucking supervision through a straw."',
                                  },
                                  {
                                    icon: "📚",
                                    text: '"Education will pretty fundamentally change with AI on the side… not just as prompting, but as a tutor that understands you and adapts."',
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed italic"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top 3 Examples */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Examples
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "💻",
                                    text: "Nanochat project and the discussion of how to build and learn from code: Andre describes Nanohat as a minimal, end-to-end repo with around 8,000 lines, aimed at teaching people to build a complete coding agent; the emphasis on not copy-pasting code to force genuine understanding is a concrete example of his learning philosophy.",
                                  },
                                  {
                                    icon: "🎯",
                                    text: 'The "Sucking supervision through a straw" analogy for RL: He contrasts RL\'s high-variance, final-reward-upweighting with how humans learn, highlighting the inefficiency and register of supervision in RL. This concrete analogy helps illustrate why model-based, process-based supervision is challenging.',
                                  },
                                  {
                                    icon: "🏫",
                                    text: "Eureka and Starfleet Academy concept: A concrete plan to revolutionize education—combining AI-assisted instruction with a premier, up-to-date institution to teach frontier technology, plus a scalable digital tier to reach billions. This example grounds his broader vision for AI in societal impact.",
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Detailed Note of All Key Points */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Detailed Note of All Key Points
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-6">
                                {[
                                  {
                                    title:
                                      "General stance on reinforcement learning (RL) and optimism",
                                    content:
                                      'He begins by calling RL "terrible" in the abstract but insists that prior approaches were worse and that progress is tractable and optimistic. The chatter on social media (fundraising, hype) clouds practical progress; his focus is on building useful systems, not ghostly demos.',
                                  },
                                  {
                                    title:
                                      "The decade vs. year framing for agents",
                                    content:
                                      'The phrase "the decade of agents" is a reaction to the claim that we\'re in the year of agents due to LLMs; he believes the trend will unfold over a decade with gradual improvements. Early agents (Cloud, CodeEx, etc.) are impressive and used daily, but significant work remains: multimodality, continual learning, robust memory, and real-world interaction.',
                                  },
                                  {
                                    title: "How to think about a real agent",
                                    content:
                                      "An agent is like an employee or intern: a tool that should be deployed when it can actually do the work. Current agents fail because they are not intelligent enough, multimodal, or capable of continual learning. The bottlenecks: lack of intelligence, multimodality, ability to use computers, continual lifelong learning, and robust representations.",
                                  },
                                  {
                                    title:
                                      "History and breakthroughs in AI as context",
                                    content:
                                      "He contextualizes major shifts: deep learning near Hinton's era; AlexNet's reorientation toward neural nets; Atari/RL shift in 2013 as an early attempt at agents but ultimately a misstep because games don't necessarily lead to general intelligence. He argues for a progression: per-task neural nets, then pretraining representations (the LLM stage), then agents built on top of strong representations, rather than attempting to leap straight to agents.",
                                  },
                                  {
                                    title:
                                      "Representations vs. evolution in brains",
                                    content:
                                      'He cautions against over-anthropomorphizing AI by drawing too close parallels to animal brains: evolution shapes brains with hardwired hardware, while AI builds "ghosts" by imitating humans and data on the internet. Pre-training is framed as a "crappy evolution" that provides a starting point, not the full animal. He sees a path to more animal-like properties by improving representations and architectural stacks on top of LLMs, but it\'s not strictly about mimicking evolution.',
                                  },
                                  {
                                    title:
                                      "The role of pre-training and the cognitive core",
                                    content:
                                      "Pre-training encodes knowledge and fosters in-context learning, but the knowledge can become a crutch; a cognitive core—an intelligent, algorithmic essence stripped of excess knowledge—could be more powerful for general problem solving. He emphasizes the need to reduce memory reliance in the weights and to use external or working memory to expand horizon length without bloat.",
                                  },
                                  {
                                    title:
                                      "In-context learning vs. pre-training",
                                    content:
                                      "In-context learning is pattern completion within a token window that leverages a vast internet with internalized patterns; it potentially uses a small internal gradient-like process. Some papers show that linear regression can be performed inside the context, suggesting some internal optimization-like phenomenon. The difference between the two: in-context learning uses an active working memory vs. pre-training; weights store a compressed memory of the internet, not raw data.",
                                  },
                                  {
                                    title:
                                      "Memory, working memory, and long contexts",
                                    content:
                                      "Weights contain a hazy memory of training data; context windows (KV cache) act as working memory that is directly accessible to the model. They highlight long-context capabilities via sparse attention and memory architectures; future AI likely needs both strong working memory and compact cognitive cores.",
                                  },
                                  {
                                    title:
                                      "Architecture and scaling trajectory",
                                    content:
                                      "He predicts that in 10 years, major architectural ideas will persist: giant neural nets trained with gradient descent, but with advances across data, hardware, kernels, and algorithms. He emphasizes that progress requires improvements across multiple dimensions (architecture, optimizer, loss functions) in tandem.",
                                  },
                                  {
                                    title: "Nanochat and code tooling",
                                    content:
                                      "Nanochat is a minimal, end-to-end repository for building a ChatGPT-like assistant; it's intentionally simple to teach the pipeline but is not boilerplate code. He notes limitations in LLMs for code: LLMs can be good for boilerplate or boilerplate-like tasks but struggle with uniquely structured, non-boilerplate, deeply technical code; specific integration decisions by the user are essential.",
                                  },
                                  {
                                    title: "LLMs as a continuum with computing",
                                    content:
                                      'He views AI as an extension of computing—progress resembles a continuum from compilers to runtime optimizations to AI-assisted coding and beyond. The "autonomy slider" concept is introduced: increasing automation of tasks that can be automated, while leaving humans to supervise higher-level processes.',
                                  },
                                  {
                                    title:
                                      "Role of AI in coding vs. other domains",
                                    content:
                                      "AI has been highly effective in coding and text-heavy domains due to structured, textual patterns and well-established tooling (IDEs, diffs, version control). Other domains (slides, non-text visuals) are harder due to lack of robust diffs and standard infrastructure. Even so, there is a gap in applying AI effectively to non-code, non-text tasks, due to the lack of consistent representations and evaluation methods.",
                                  },
                                  {
                                    title:
                                      "The nature of education in the AI era",
                                    content:
                                      'Eureka and Starfleet Academy aim to create elite educational institutions and scalable digital courses, with a focus on "ramps to knowledge" and Eurekas per second. The goal is not only to teach but to empower and safeguard humanity by equipping people to understand and guide AI, preventing a dystopian outcome. The near-term plan: hire faculty to build state-of-the-art courses; later, AI assistants may act as TAs; in the long term, AI could take over more design and instruction tasks.',
                                  },
                                  {
                                    title:
                                      "The concept of culture and multi-agent systems",
                                    content:
                                      'He believes a true AI culture among LLMs would require agents that can create, read, and respond to each other\'s content, akin to cultural transmission and self-play. He expects a gradual emergence of culture and collaboration rather than a sudden, singular "AGI moment."',
                                  },
                                  {
                                    title: "Self-driving as a comparison",
                                    content:
                                      "He uses self-driving as a benchmark and argues it's not a complete analogy to AI education or coding agents. The self-driving domain is safety-critical and requires robust perception and generalization, which is analogous to real-world deployment constraints for AI agents. He notes that self-driving progress is slow due to safety, regulatory, and deployment constraints; the AI coding domain may progress differently due to lower physical risk costs.",
                                  },
                                  {
                                    title: "AGI, growth, and economic impact",
                                    content:
                                      "He distinguishes two camps: one that expects an economic explosion (a discrete leap, a singular breakthrough) and one that expects gradual diffusion of AI capabilities across industries. He is skeptical of a sudden, singular AGI leap but acknowledges that AI will diffuse across the economy, with productivity gains accruing to both coders and non-coders as automation expands. He emphasizes that the growth rate of the economy has been accelerating slowly due to automation for centuries and expects AI to follow a similar trajectory—more gradual, not a sudden jump.",
                                  },
                                  {
                                    title:
                                      "Safety, governance, and societal impact",
                                    content:
                                      "He expresses concern about humanity's ability to manage increasingly autonomous AI systems and emphasizes the importance of education to keep humans in control. He acknowledges geopolitical and regulatory considerations and urges grounding expectations in reality and caution to avoid missteps.",
                                  },
                                  {
                                    title:
                                      "Final notes on personal journey and philosophy",
                                    content:
                                      'He discusses his roles, the evolution from Tesla to OpenAI-style environments, and his personal belief that "the geniuses of today are barely scratching the surface" of human potential. He reiterates that he remains optimistic about the potential of AI, provided that education, governance, and responsible deployment keep pace with technical advances.',
                                  },
                                ].map((section, index) => (
                                  <div
                                    key={index}
                                    className="p-4 rounded-lg transition-all duration-300"
                                    style={{
                                      background: "rgba(255, 107, 53, 0.02)",
                                      border:
                                        "1px solid rgba(255, 107, 53, 0.1)",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.borderColor =
                                        "rgba(255, 107, 53, 0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.02)";
                                      e.currentTarget.style.borderColor =
                                        "rgba(255, 107, 53, 0.1)";
                                    }}
                                  >
                                    <h5
                                      className="text-lg font-medium mb-2"
                                      style={{ color: "var(--accent-primary)" }}
                                    >
                                      {section.title}
                                    </h5>
                                    <p
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {section.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      } else if (activeVideo === "video2") {
                        return (
                          /* Jeff Bezos Content */
                          <>
                            {/* Top 3 Key Takeaways */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Key Takeaways
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "🚀",
                                    text: "The core driver of Jeff Bezos's endeavors is long-term thinking and high-velocity decision-making combined with rigorous truth-seeking. He emphasizes Day 1 mentality, the value of rapid, decisive action for big breakthroughs, and mechanisms (like one-way vs two-way doors, disagree-and-commit, and six-page memos) that keep decisions fast yet well-vetted.",
                                  },
                                  {
                                    icon: "🌌",
                                    text: "Space infrastructure as a growth platform: Bezos envisions lowering the cost of access to orbit to unleash a renaissance of space activity. Central ideas include reusable first stages, rate manufacturing, heavy infrastructure (Blue Ring, Lunar Lander, Mark 1/2), and leveraging lunar and asteroid resources to enable sustainable human presence beyond Earth.",
                                  },
                                  {
                                    icon: "🌍",
                                    text: "The importance of staying customer-obsessed on Earth while pushing humanity outward: Bezos connects Amazon's focus on customer experience and 'paper cuts' improvement with Blue Origin's mission to expand human civilization into the solar system. He argues that space exploration can protect and extend life on Earth by enabling abundant energy/resource use beyond a finite planet.",
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top 3 Memorable Quotes */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Memorable Quotes
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "⚠️",
                                    text: '"Impossible with great caution." (Referring to the Apollo era mindset and how pushing through the impossible requires careful, disciplined thinking.)',
                                  },
                                  {
                                    icon: "🏗️",
                                    text: '"The only way to get to that vision is with giant space stations." / "We will take materials from the Moon and near-Earth objects and the asteroid belt..."',
                                  },
                                  {
                                    icon: "🌅",
                                    text: '"Day one thinking is how you start fresh every day... unless you know a better way." (On continuous reinvention and avoiding dogma.)',
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed italic"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top 3 Examples */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Examples
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "🛰️",
                                    text: "Blue Ring and space payload services: A cargo-facing in-space service that provides thermal management, power, compute, and communications—essentially APIs for space payloads akin to AWS, enabling easier in-space operations without every customer building all subsystems themselves.",
                                  },
                                  {
                                    icon: "🚀",
                                    text: "New Glenn rocket and its two-stage design: A large heavy-lift vehicle with a reusable first stage and an expendable second stage using liquid hydrogen and liquid oxygen, plus discussions of engine types (seven BE-4 engines on the first stage; two BE-3U-like upper-stage engines) and manufacturing-rate challenges.",
                                  },
                                  {
                                    icon: "⏰",
                                    text: "10,000-year Clock project: A long-term thinking symbol designed to encourage future-oriented decision making, cognitive reframing toward sustainability, and the broad theme of thinking beyond immediate incentives to influence generations.",
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Detailed Note of All Key Points */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Detailed Note of All Key Points
                        <div
                          className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                          style={{ background: "var(--accent-gradient)" }}
                        />
                      </h4>
                              <div className="space-y-6">
                                {[
                                  {
                                    title: "Personal background and influences",
                                    content: "Bezos spent summers on his Texas ranch with his grandfather, who was resourceful, self-reliant, and taught him problem-solving, improvisation, and persistence. The duo fixed and improvised ranch machinery (fences, pipelines, veterinary tools) and even rebuilt a broken D6 bulldozer, which exemplified a practical, do-it-yourself engineering mindset. Grandfather's routine included watching Days of Our Lives, symbolizing a balance of hard work and downtime. Early exposure to space came from five-year-old interactions with space exploration and the broader Space Race, which Bezos discusses later as a foundational inspiration."
                                  },
                                  {
                                    title: "Space exploration context and inspirations",
                                    content: "Apollo era lessons: \"impossible\" is a label that can be overcome with sustained effort and national resources; the Space Race pulled forward capabilities and achievements that were once deemed impossible. The Venus-like awe of spaceflight is tied to risk-taking and the human desire to extend life beyond Earth. John Glenn and Alan Shepard: Shepard's suborbital flight carried high perceived risk; Glenn's orbital flight is highlighted as a pivotal achievement; Bezos has a framed letter from Glenn expressing gratitude about New Glenn naming, reflecting humility and historical continuity."
                                  },
                                  {
                                    title: "Vision for humanity's future in space",
                                    content: "Bezos imagines a trillion humans in the solar system with a thousand Mozarts and a thousand Einsteins, living in giant space stations (O'Neill-style habitats) that allow normal gravity and location flexibility. Space-based industry would use materials from the Moon and near-Earth objects, enabling orbital infrastructure (space stations) and reducing pressure on Earth's finite resources. Emphasis on energy per capita as a fundamental driver: to sustain higher energy consumption and better living standards, space-based expansion is necessary to avoid degrading Earth's pristine natural environment."
                                  },
                                  {
                                    title: "Blue Origin's architecture and projects",
                                    content: "Blue Ring: A spacecraft designed to transport up to 3,000 kg to GEO or lunar vicinity, with dual propulsion (chemical and electric), enabling either rapid orbital transfer or slow orbit adjustment. It provides payload services (power, compute, communications, thermal management) and uses radiation-tolerant compute. Human transport vs. payload: Blue Ring is designed for payloads, not humans, while a separate lunar lander (new lunar programs) handles crewed missions. Lunar Lander family: Mark 1 (expendable) and Mark 2 (reusable) for lunar surface missions. Mark 2 aims to support sustainable, reusable lunar landings by providing a single-stage surface-to-orbit approach with in-situ resource utilization (ISRU) integrations."
                                  },
                                  {
                                    title: "ISRU and lunar sustainability",
                                    content: "Working on lunar solar cells made from lunar regolith simulant (targeting 7% efficiency for near-term practicality) and oxygen extraction from regolith, enabling sustainable life support and propellant production. Ice in permanently shadowed craters could yield water via electrolysis for hydrogen and oxygen. Moon-to-Earth and Moon-to-surface logistics: New Glenn can carry Mark landers to the Moon, enabling integrated surface operations, resource utilization, and long-term presence."
                                  },
                                  {
                                    title: "New Glenn rocket specifics",
                                    content: "Size and thrust: A heavy-lift rocket able to lift around 45 metric tons to LEO, with a liftoff thrust around 3.9 million pounds. First stage uses seven engines; each engine ~550,000 pounds of thrust. Propellants and cycles: First stage uses LNG as fuel with LOX as oxidizer, operating on an oxidizer-rich staged combustion cycle (a cycle pioneered by Russians). Upper stage uses liquid hydrogen with BE-3U engines (two engines totaling ~320,000 pounds of thrust). Stage design considerations: Hydrogen's high specific impulse is beneficial for upper stages due to lower mass, but less practical for boosters due to large, bulky tanks. Delta IV is cited as a comparison (all hydrogen, expensive and not cost-effective)."
                                  },
                                  {
                                    title: "Large-scale manufacturing challenges",
                                    content: "Parasitic mass (avionics, control systems) grows with size; large turbo pumps become more efficient with scale; manufacturing large structures is exceptionally challenging; therefore, achieving rate manufacturing is as hard as the initial design. Reusability vs. expendability: First stage is reusable; second stage is expendable with the possibility of reusability in the long term, depending on cost-benefit analysis; the choice is about lowering the cost of access to orbit and enabling widespread space activity."
                                  },
                                  {
                                    title: "Manufacturing and cost considerations",
                                    content: "The aim is to lower the cost of access to orbit by inventing better ways, similar to the plow example (invention drives societal wealth). The rate manufacturing challenge is critical: first launch is a test, but the real barrier is the ability to produce upper stages, engines, and related infrastructure at required rates (e.g., 24 launches/year, 2 upper stages per launch cycle, etc.). Emphasis on the notion that \"manufacturing is the hard part,\" as pushing production capability to rate can determine whether cost reductions actually materialize."
                                  },
                                  {
                                    title: "Bezos's philosophy on innovation and decision-making",
                                    content: "Day One mindset: Start fresh daily, avoid stagnation, and continuously seek invention and customer value. Tenants for programs include openness to better approaches (unless you know a better way). One-way vs two-way doors: Two-way decisions allow reversal with time; one-way doors require deliberate thinking and escalation to senior leadership due to irreversibility. Disagree and commit: Even when disagreeing, teams should commit to the decision to move forward, then work to make it work without second-guessing."
                                  },
                                  {
                                    title: "Truth-seeking culture and memo culture",
                                    content: "Truth-seeking culture: Avoid compromising to reach quick resolution; escalate disputes to higher authority when necessary and prefer data-backed decisions; junior voices should be heard to ensure truth-telling and innovation. Memorable memo culture: Meetings are anchored by six-page narrative memos read in silence (study hall), followed by discussion; memos force clarity and prevent overreliance on slides to persuade. Meetings with memos replace PowerPoint-driven persuasion with truth-seeking discourse."
                                  },
                                  {
                                    title: "Paper cuts vs big bets and customer obsession",
                                    content: "Paper cuts vs big bets: Distinguish between large, long-lived challenges (big bets) and smaller, persistent inefficiencies (paper cuts); dedicated teams fix paper cuts to improve the customer experience and operational efficiency. Customer obsession: The customer is central to decision-making; metrics must reflect actual customer happiness, not proxies that drift with time away from truth. Listening to data and anecdotes: When anecdotes contradict data, investigate; data might not capture the right metric, and human stories can reveal underlying truths the data alone misses."
                                  },
                                  {
                                    title: "Humility and leadership",
                                    content: "Bezos emphasizes the value of junior staff contributions, the importance of listening, and the humility to change one's mind in light of new evidence."
                                  },
                                  {
                                    title: "Personal development and life",
                                    content: "Bezos describes a balanced, practical daily routine: early rising, light exercise, focused engineering work, and long strategy sessions. Focus on health and longevity: He emphasizes health span and staying physically active as a driver of energy for long-term work and leadership. Mortality and legacy: While he reflects on mortality and the desire to remain engaged with family and future generations, he remains optimistic about humanity's capacity to solve long-term challenges with new tools and technologies."
                                  },
                                  {
                                    title: "AI and the future",
                                    content: "AI as discovery vs. invention: Large language models (LLMs) are more like discoveries than engineered inventions; we should expect surprising capabilities and potential benefits for medicine, automation, and productivity, while acknowledging risks (misinformation, weaponization). Human-AI collaboration: Despite advances in AI, human judgment, ethical considerations, and governance remain essential; there is potential for AI to augment humanity while also presenting governance and safety challenges. Applications: AI is expected to power products like smarter Alexa and enterprise tools (Bedrock, Titan) for private-data usage in enterprises, with strong emphasis on security, privacy, and controlled data usage."
                                  },
                                  {
                                    title: "10,000-year clock",
                                    content: "A symbolic monument to long-term thinking, intended to cultivate patience and long-range planning; its existence encourages future generations to consider larger time horizons in decision-making."
                                  },
                                  {
                                    title: "Final reflections",
                                    content: "Bezos expresses optimism about a future in which humanity becomes multi-planetary but remains grounded in Earth's stewardship. He envisions a competitive but collaborative space industry with multiple winners; SpaceX and Blue Origin can both thrive and push the broader frontier forward. He reiterates that cumulative, rate-scale progress in space requires infrastructure that future generations can leverage, much like how the internet leveraged pre-existing infrastructure to enable rapid startup growth."
                                  }
                                ].map((section, index) => (
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
                                      style={{ color: "var(--accent-primary)" }}
                                    >
                                      {section.title}
                                    </h5>
                                    <p
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {section.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      } else if (activeVideo === "video3") {
                        return (
                          /* Marc Andreessen & Amjad Masad Content */
                          <>
                            {/* Top 3 Key Takeaways */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Key Takeaways
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                      <div className="space-y-4">
                        {[
                          {
                                    icon: "🤖",
                                    text: "Replit and AI agents are transforming software creation: you describe a shift from manual, environment-heavy coding to English-driven prompts, automated design, code generation, testing, deployment, and even multi-agent collaboration that can produce production-ready apps in a fraction of the time.",
                                  },
                                  {
                                    icon: "🧠",
                                    text: "Long-horizon reasoning and verification are central breakthroughs: achieving coherent, multi-step problem solving with AI requires long context, memory compression, and a verification loop (in-loop checking and testing). RLHF/RLHF+trajectory-based training enables sustained reasoning, with real-world benchmarks showing dramatic gains in lasting coherence and practical task completion.",
                          },
                          {
                            icon: "🎯",
                                    text: "The trajectory toward AGI is mixed and debated: coding and concrete, verifiable domains are advancing fastest, while more abstract domains (law, medicine, social science) lag behind due to verifiability challenges. There's a tension between 'good enough' progress in a local maximum and the broader quest for true, transferable AGI.",
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top 3 Memorable Quotes */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Memorable Quotes
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "💭",
                                    text: '"Instead of typing syntax, you\'re actually typing thoughts, which is what we ultimately want. And the machine writes the code."',
                                  },
                                  {
                                    icon: "🤖",
                                    text: '"The agent is a programmer that has tools and interface. It\'s a bot… a multi-agent system that can test, debug, and iterate just like a human."',
                                  },
                                  {
                                    icon: "📈",
                                    text: "\"Worse is better. We're in a local maximum trap where it's good enough for so much economically productive work, and that relieves the pressure to solve generalized intelligence.\"",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255, 107, 53, 0.05)";
                              e.currentTarget.style.margin = "0 -8px";
                              e.currentTarget.style.padding = "8px";
                            }}
                            onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed italic"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top 3 Examples */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Examples
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "⚡",
                                    text: "End-to-end product building in 20–30 minutes: the agent reads a user's English description (e.g., 'I want to sell crepes online'), proposes tasks (database setup, payments, design), builds the app, tests it in a browser, and publishes to the cloud with a production database.",
                                  },
                                  {
                                    icon: "🔄",
                                    text: "Multi-agent collaboration and orchestration: multiple agents work in parallel on features (design, refactoring, database changes) and then merge their outputs into a cohesive product, with each step feeding the next through summarized prompts.",
                                  },
                                  {
                                    icon: "✅",
                                    text: "Verification-driven improvement: adding a verifier in the loop (inspired by Nvidia's approach to kernel optimization) to run and validate actions, enabling longer-running, more reliable agent sessions (e.g., 10–20–200 minutes) by checking outcomes and restarting trajectories when issues arise.",
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                              e.currentTarget.style.margin = "0";
                              e.currentTarget.style.padding = "8px 0";
                            }}
                          >
                            <span className="text-lg flex-shrink-0 mt-0.5">
                              {item.icon}
                            </span>
                            <span
                              className="text-sm leading-relaxed"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                            {/* Detailed Note of All Key Points */}
                    <div>
                      <h4
                        className="text-xl font-semibold mb-4 relative"
                        style={{ color: "var(--text-primary)" }}
                      >
                                Detailed Note of All Key Points
                        <div
                          className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                          style={{ background: "var(--accent-gradient)" }}
                        />
                      </h4>
                              <div className="space-y-6">
                                {[
                                  {
                                    title: "General context of speed and potential",
                                    content: "The conversation frames AI/ML progress as incredibly rapid and magical compared with traditional computer speed, suggesting a mix of awe and disappointment about pace and practical limits."
                                  },
                                  {
                                    title: "Target audience and onboarding with Replit AI",
                                    content: "Replit aims to simplify setup, letting users focus on what they want to build (product, data visualization, startup idea). Users input in plain English; the system classifies the best technology stack (e.g., Python for data apps, JavaScript + PostgreSQL for web apps) and supports many languages; users can choose specific languages if they want, but the platform will select the most suitable default."
                                  },
                                  {
                                    title: "Language as programming language",
                                    content: "The pipeline argues that English can be the primary programming language, with AI understanding translating natural language prompts into executable software. Grace Hopper's vision of moving from machine code toward English-like programming is cited as a historical anchor, with the speaker suggesting we're at the next step: thinking in English while the machine writes the code."
                                  },
                                  {
                                    title: "Language support and historical perspective",
                                    content: "While English is primary, other languages (e.g., Japanese) are supported; AI tends to perform well on mainstream languages. The discussion references the evolution from low-level assembly to high-level languages and the democratization of programming via higher-level abstractions."
                                  },
                                  {
                                    title: "User experience flow",
                                    content: "The agent shows what it understood by listing tasks (set up database, payments, etc.) and offers a design-first or full-build option. If a full build is chosen, the agent handles database migrations, code generation, testing in a browser, and iterative fixes based on feedback from testing or user reports."
                                  },
                                  {
                                    title: "Capabilities of agent 3",
                                    content: "Recent improvements include writing software and then spinning up a browser to test it; it can iterate and fix issues, and notify when the app is ready for testing on different devices. This makes a 20–30 minute build feasible for common ideas."
                                  },
                                  {
                                    title: "Real-world deployment and abstraction layers",
                                    content: "Replit abstracts complexity (dev environments, cloud provisioning) but preserves layers for users who want to inspect code, push to GitHub, or edit in their editor—combining ease of use with transparency."
                                  },
                                  {
                                    title: "The role of the agent and user",
                                    content: "The agent acts as the programmer, listing and executing tasks; the user shifts toward high-level direction while the agent's outputs become the implementation. The speaker notes this can cause the \"agent programmer\" to become the primary driver of the workflow."
                                  },
                                  {
                                    title: "Coherence and long-horizon reasoning",
                                    content: "Long context is crucial. Techniques include context memory management and compression of logs and data to maintain coherence over extended reasoning. The context box now includes user input, environment input, and the AI's internal reasoning."
                                  },
                                  {
                                    title: "RL and trajectory-based training",
                                    content: "Reinforcement learning, especially with code execution feedback, enables the model to roll out multiple trajectories and learn effective problem-solving strategies. A human-provided ground truth (e.g., a PR with tests) helps shape rewards and correct trajectories."
                                  },
                                  {
                                    title: "Benchmarks and real-world validation",
                                    content: "Meter and SOBench benchmarks track how long models can reason coherently in useful tasks (programming, math, etc.). Real-user AB testing shows practical success; agents reaching longer time horizons (minutes to hours) correlate with real app publishing and economic usefulness."
                                  },
                                  {
                                    title: "Verification loop and testing",
                                    content: "The use of a verifier in the loop helps ensure the agent's outputs are correct and optimizes performance. This approach is influenced by Nvidia's work on kernel optimization with verification, enabling longer-running and more reliable agent activity."
                                  },
                                  {
                                    title: "Context length and memory management",
                                    content: "Since LLMs have finite context length, memory compression is used to summarize longer memories (e.g., log paragraphs) to keep the agent coherent over long tasks."
                                  },
                                  {
                                    title: "RL breakthroughs and the role of alpha-go-like reasoning",
                                    content: "The combination of neural models with discrete, deterministic search methods (tree search, verification) mirrors AlphaGo's hybrid approach: generate candidates with a neural network, then prune with a discrete algorithm to select optimal moves."
                                  },
                                  {
                                    title: "Domains and verifiability",
                                    content: "For RL to work effectively, problems must have defined, verifiable outcomes (e.g., coding tasks, math proofs). More subjective domains like law, medicine still struggle due to the need for verifiable ground truths or human adjudication."
                                  },
                                  {
                                    title: "Synthetic data and human-generated data",
                                    content: "Foundations models leverage synthetic training data generation, human experts to craft training data with verifiable results, and systems that generate tests and validation results themselves. This helps scale training for software tasks but not to the same extent for more soft domains."
                                  },
                                  {
                                    title: "Concrete vs. transfer learning",
                                    content: "The speaker emphasizes that transfer learning across domains remains hard; expertise in one domain doesn't automatically transfer to another. This challenges the notion of universal AGI and aligns with debates about true cross-domain generalization."
                                  },
                                  {
                                    title: "AGI debate and perspectives",
                                    content: "The conversation covers Rogers/Sutton's \"bitter lesson\" and arguments about whether progress should rely on more data and compute (toward AGI) vs. seeking domain-general, transferable intelligence. The speakers acknowledge this is a contentious area with no consensus."
                                  },
                                  {
                                    title: "Local maxima vs. breakthrough",
                                    content: "The idea that the industry may be climbing a local maximum due to \"good enough\" progress in concrete problems (e.g., coding) while grand, generalized breakthroughs lag behind. This is framed against the possibility of true AGI, which may or may not be within reach in the near term."
                                  },
                                  {
                                    title: "Practical outlook and future of software development",
                                    content: "The expectation is that by next year, developers will manage multiple agents in parallel to plan and implement features, refactor databases, and coordinate across teams, with multimodal interfaces enhancing interaction."
                                  },
                                  {
                                    title: "Personal backstory",
                                    content: "The speaker shares a personal journey from Jordan to Silicon Valley, early exposure to computing, entrepreneurship in high school, and pivotal moments (e.g., hacking the university system, building web-based programming environments, involvement with Code Academy) that shaped his path and led to founding Replit. Key anecdotes include: Early computer experiences in DOS and batch scripting, and Visual Basic for real software development. A teen entrepreneur building a logging software for a gaming café, learning about business viability. A rebellious stint hacking the university system to adjust grades and the subsequent lessons about responsibility. The pivotal moment when an opportunity to join a major company (Code Academy and later Replit's origin) arose, and the decision to pursue building a platform that runs code in the browser."
                                  },
                                  {
                                    title: "Philosophical reflections",
                                    content: "The speaker contemplates what AGI means, the difference between a \"perfect driver\" vs. a \"better driver,\" and questions about consciousness, transferability, and the ultimate trajectory of AI. There's also humor and candidness about public perception, and a candid view that true AGI may not be realized within our lifetimes, or may require redefining what \"AGI\" means."
                                  }
                                ].map((section, index) => (
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
                                      style={{ color: "var(--accent-primary)" }}
                                    >
                                      {section.title}
                                    </h5>
                                    <p
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {section.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      } else if (activeVideo === "video4") {
                        return (
                          /* Barry Zhang Content */
                          <>
                            {/* Top 3 Key Takeaways */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Key Takeaways
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                      <div className="space-y-4">
                                {[
                                  {
                                    icon: "🎯",
                                    text: "Don't build agents for everything; use agents only for tasks where they add real value and keep the scope simple for as long as possible.",
                                  },
                                  {
                                    icon: "🔧",
                                    text: "Start simple and iterate on the three core components of an agent—environment, tools, and system prompt—before optimizing later for cost and performance.",
                                  },
                                  {
                                    icon: "🤔",
                                    text: "Think like your agent; put yourself in the agent's context to understand its decisions, limitations, and how to improve trust and effectiveness.",
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                          className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 107, 53, 0.05)";
                            e.currentTarget.style.margin = "0 -8px";
                            e.currentTarget.style.padding = "8px";
                          }}
                          onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                            e.currentTarget.style.margin = "0";
                            e.currentTarget.style.padding = "8px 0";
                          }}
                        >
                          <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                          </span>
                          <span
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                                      {item.text}
                          </span>
                        </div>
                                ))}
                      </div>
                    </div>

                            {/* Top 3 Memorable Quotes */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Memorable Quotes
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "🚫",
                                    text: '"Don\'t build agents for everything."',
                                  },
                                  {
                                    icon: "✨",
                                    text: '"Keep it as simple as possible."',
                                  },
                                  {
                                    icon: "🧠",
                                    text: '"Think like your agents. Gain their perspective, and help them do their job."',
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed italic"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top 3 Examples */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Top 3 Examples
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{
                                    background: "var(--accent-gradient)",
                                  }}
                                />
                              </h4>
                              <div className="space-y-4">
                                {[
                                  {
                                    icon: "💻",
                                    text: "Coding agents: Used to go from design doc to PR, with reliability in coding workflows and verifiable outputs via unit tests and CI.",
                                  },
                                  {
                                    icon: "🔄",
                                    text: "Three basic agent components in practice: environment, tools, and system prompt, all within a loop of model calls.",
                                  },
                                  {
                                    icon: "🤖",
                                    text: "Personal musings on future of multi-agent systems: predictions about budget controls, self-evolving tools, and growing multi-agent collaboration in production.",
                                  },
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        "rgba(255, 107, 53, 0.05)";
                                      e.currentTarget.style.margin = "0 -8px";
                                      e.currentTarget.style.padding = "8px";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        "transparent";
                                      e.currentTarget.style.margin = "0";
                                      e.currentTarget.style.padding = "8px 0";
                                    }}
                                  >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                      {item.icon}
                                    </span>
                                    <span
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Detailed Note of All Key Points */}
                            <div>
                              <h4
                                className="text-xl font-semibold mb-4 relative"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Detailed Note of All Key Points
                                <div
                                  className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                                  style={{ background: "var(--accent-gradient)" }}
                                />
                              </h4>
                              <div className="space-y-6">
                                {[
                                  {
                                    title: "Introduction and framing",
                                    content: "Barry introduces the topic of building effective agents and references a prior blog post with Eric: Building Effective Agents. The talk centers on three core ideas: 1) don't build agents for everything, 2) keep it simple, and 3) think like your agents, with personal musings at the end."
                                  },
                                  {
                                    title: "Recap of evolution toward agentic systems",
                                    content: "Early stage: simple features (summarization, classification, extraction) became table stakes. Mid stage: single model calls evolved into workflows with predefined control flows to trade off latency and performance. Emergence of agentic systems: agents can decide their trajectory and operate with environment feedback, enabling more autonomy. Production trends: growth of domain-specific agents; potential future developments include general-purpose single agents and multi-agent collaboration/delegation. Costs and risks rise with increased agent agency (cost, latency, errors)."
                                  },
                                  {
                                    title: "First core idea: Don't build agents for everything",
                                    content: "Agents scale complex, valuable tasks but are not a universal replacement for all use cases. Favor workflows for many common scenarios; they remain valuable today. A practical agent-building checklist includes task complexity (agents shine in ambiguous problems), value of the task (token usage and exploration costs matter), budget considerations, de-risking critical capabilities, and cost of error and discovery. Real-world example: coding as a great agent use-case due to its ambiguity from design doc to PR, value of good code, heavy use of cloud for coding, and verifiable outputs through tests/CI."
                                  },
                                  {
                                    title: "Task complexity and value assessment",
                                    content: "Task complexity: Agents shine in ambiguous problems; if you can map and optimize every node in a decision tree, explicit builds are cost-effective and controllable. Value of the task: Token usage and exploration costs matter; higher tokens per task require justification. Example: 10-cent budget per task implies 30,000–50,000 tokens; use workflows for common scenarios to capture most value. Budget-minded vs. cost-agnostic: If the priority is simply 'get the task done' regardless of tokens, explore alternatives; this is a cue for the GTM team to engage."
                                  },
                                  {
                                    title: "Risk management and critical capabilities",
                                    content: "De-risk critical capabilities: Ensure key capabilities (e.g., coding agents writing, debugging, recovering from errors) function well; bottlenecks increase cost and latency, so reduce scope if needed. Cost of error and discovery: High-stakes or hard-to-detect errors require limiting scope, read-only access, or more human-in-the-loop, which can slow scaling."
                                  },
                                  {
                                    title: "Second core idea: Keep it simple",
                                    content: "Conceptual model: An agent is a loop with three defining components: environment, tools, and system prompt. Environment: The system the agent operates in. Tools: Interfaces the agent uses to perform actions and receive feedback. System prompt: Goals, constraints, and expected behavior guiding the agent. Principle: Upfront complexity kills iteration speed; focusing on these three components yields the highest ROI and fastest learning. Practical takeaway: After establishing these basics, more optimization can follow."
                                  },
                                  {
                                    title: "Demonstrations and practical examples",
                                    content: "Demonstrations: Three example agent use cases show diverse product surfaces but share the same backbone and nearly identical code; environment depends on use case, while the two core design decisions are tools and the prompt. Suggestions for tooling and learning: A plug for a Model Context Protocol (MCP) workshop by Mahes to deepen understanding of tools and contexts."
                                  },
                                  {
                                    title: "Optimization guidance",
                                    content: "Optimization guidance: For coding and computer use cases, optimize trajectory to reduce cost; for search, parallelize tool calls to reduce latency; for most cases, present progress to build user trust."
                                  },
                                  {
                                    title: "Third core idea: Think like your agents",
                                    content: "Encourage empathy with the agent by placing yourself in the agent's context window. Agents can appear highly sophisticated, but each step is a limited inference over a small context window (10–20k tokens). Limiting context helps reveal true agent behavior and gaps."
                                  },
                                  {
                                    title: "Agent perspective and thought experiments",
                                    content: "A thought experiment: If you were a computer-using agent with a simple set of tools and a task, your actions would be reactive to tool outputs rather than internal contemplation. The 'eyes closed' analogy: acting without seeing the outcome can lead to unknown results; a full task-from-agent perspective reveals what the agent would have needed (e.g., screen resolution, recommended actions, limitations)."
                                  },
                                  {
                                    title: "Practical exercises and validation",
                                    content: "Practical exercise: Run a full task from the agent's perspective to understand what context and guardrails are needed; use this to avoid unnecessary exploration and guide tool usage. Cloud-based validation: Use cloud to run the agent's entire trajectory, then question the agent about its decisions to gain perspective on decision-making and improve it. Overall guidance: Think like the agent during iteration, and you'll better understand limitations and improvement paths."
                                  },
                                  {
                                    title: "Personal musings and open questions",
                                    content: "Budgeting agents: Agents lack strong built-in budget control; defining and enforcing budgets in time, money, or tokens is an open area to enable broader production use cases. Self-evolving tools: Meta-tools where agents can design and improve their own tooling ergonomics to generalize across use cases. Multi-agent collaboration: Expect more multi-agent collaborations in production, with sub-agents protecting the main agent's context window; key open questions center on how agents communicate, especially moving from synchronous to asynchronous interactions and enabling cross-agent roles and recognition."
                                  },
                                  {
                                    title: "Future directions and collaboration",
                                    content: "Invitation for engagement: The speaker invites others to discuss these ideas, including sharing contact information."
                                  },
                                  {
                                    title: "Conclusion and practical takeaways",
                                    content: "Reiterated three takeaways: don't build agents for everything; keep them simple; think like your agent to understand and improve its performance. Encouragement to stay connected and continue building. Personal anecdote: The speaker's transformative experience of becoming an AI engineer, inspired by the blog post, and a commitment to making AI practical and useful."
                                  }
                                ].map((section, index) => (
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
                                      style={{ color: "var(--accent-primary)" }}
                                    >
                                      {section.title}
                                    </h5>
                                    <p
                                      className="text-sm leading-relaxed"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {section.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      } else {
                        return (
                          /* Fallback - should not happen */
                          <div>No content available</div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
