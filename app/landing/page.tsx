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
  const [youtubePopupOpen, setYoutubePopupOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [activeVideo, setActiveVideo] = useState("video1"); // "video1", "video2", or "video3"

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

  const openYoutubePopup = (videoId: string) => {
    setCurrentVideoId(videoId);
    setYoutubePopupOpen(true);
  };

  const closeYoutubePopup = () => {
    setYoutubePopupOpen(false);
    setCurrentVideoId("");
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
                <div
                  className="relative h-[300px] cursor-pointer overflow-hidden"
                  onClick={() => {
                    setActiveVideo("video1");
                    openYoutubePopup("lXUZvyajciY");
                  }}
                >
                  {/* YouTube Thumbnail */}
                  <Image
                    src="https://img.youtube.com/vi/lXUZvyajciY/maxresdefault.jpg"
                    alt="Andre Karpathy - The Decade of Agents"
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300">
                    <div
                      className="text-6xl transition-transform duration-300 hover:scale-110"
                      style={{
                        color: "var(--accent-primary)",
                        textShadow: "var(--accent-glow)",
                        filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.8))",
                      }}
                    >
                      ▶
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4">
                    <div
                      className="px-3 py-1 rounded text-sm font-medium"
                      style={{
                        background: "rgba(0, 0, 0, 0.8)",
                        color: "var(--text-primary)",
                      }}
                    >
                      1:32:15
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-2 leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Video 1: Andre Karpathy - The Decade of Agents
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    YouTube Video: Andre Karpathy discusses AI agents,
                    education, and the future
                  </p>
                </div>
              </div>

              {/* Related Videos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "$0 → $1m", videoId: null },
                  {
                    title: "Video 2: Jeff Bezos - Space & Innovation",
                    videoId: "DcWqzZ3I2cY",
                  },
                  {
                    title:
                      "Video 3: Marc Andreessen & Amjad Masad - AI & Coding",
                    videoId: "g-WeCOUYBrk",
                  },
                ].map((video, index) => (
                  <div
                    key={index}
                    className="rounded-lg border overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:translate-y-[-3px]"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: "var(--border-color)",
                    }}
                    onClick={() => {
                      if (video.videoId) {
                        setActiveVideo(
                          index === 1
                            ? "video2"
                            : index === 2
                              ? "video3"
                              : "video1"
                        );
                        openYoutubePopup(video.videoId);
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
                            text: "We're not actually building animals. We're building ghosts.",
                          },
                          {
                            time: "2:15",
                            text: "The phrase 'the decade of agents' is a reaction to the claim that we're in the year of agents due to LLMs",
                          },
                          {
                            time: "5:30",
                            text: "An agent is like an employee or intern: a tool that should be deployed when it can actually do the work",
                          },
                          {
                            time: "8:45",
                            text: "Current agents fail because they are not intelligent enough, multimodal, or capable of continual learning",
                          },
                          {
                            time: "12:20",
                            text: "Pre-training encodes knowledge and fosters in-context learning, but the knowledge can become a crutch",
                          },
                          {
                            time: "15:10",
                            text: "A cognitive core—an intelligent, algorithmic essence stripped of excess knowledge—could be more powerful",
                          },
                          {
                            time: "18:30",
                            text: "Sucking supervision through a straw - contrasting RL's high-variance with how humans learn",
                          },
                          {
                            time: "22:45",
                            text: "In-context learning uses an active working memory vs. pre-training weights store compressed internet memory",
                          },
                          {
                            time: "26:15",
                            text: "Nanochat is a minimal, end-to-end repository for building a ChatGPT-like assistant",
                          },
                          {
                            time: "30:20",
                            text: "LLMs can be good for boilerplate but struggle with uniquely structured, deeply technical code",
                          },
                          {
                            time: "34:10",
                            text: "AI has been highly effective in coding due to structured, textual patterns and well-established tooling",
                          },
                          {
                            time: "38:45",
                            text: "The autonomy slider concept: increasing automation while leaving humans to supervise higher-level processes",
                          },
                          {
                            time: "42:30",
                            text: "Eureka and Starfleet Academy aim to create elite educational institutions with AI tutors",
                          },
                          {
                            time: "46:15",
                            text: "Education will pretty fundamentally change with AI... not just as prompting, but as a tutor that understands you",
                          },
                          {
                            time: "50:20",
                            text: "The goal is to empower and safeguard humanity by equipping people to understand and guide AI",
                          },
                          {
                            time: "54:10",
                            text: "A true AI culture among LLMs would require agents that can create, read, and respond to each other's content",
                          },
                          {
                            time: "58:30",
                            text: "Self-driving progress is slow due to safety, regulatory, and deployment constraints",
                          },
                          {
                            time: "62:45",
                            text: "He distinguishes two camps: economic explosion vs gradual diffusion of AI capabilities across industries",
                          },
                          {
                            time: "66:20",
                            text: "The growth rate of the economy has been accelerating slowly due to automation for centuries",
                          },
                          {
                            time: "70:15",
                            text: "Concern about humanity's ability to manage increasingly autonomous AI systems",
                          },
                          {
                            time: "74:30",
                            text: "The geniuses of today are barely scratching the surface of human potential",
                          },
                          {
                            time: "78:45",
                            text: "Remains optimistic about AI potential, provided education and governance keep pace with technical advances",
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
                      } else {
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
                    {activeVideo === "video1" ? (
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
                              style={{ background: "var(--accent-gradient)" }}
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
                              style={{ background: "var(--accent-gradient)" }}
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
                              style={{ background: "var(--accent-gradient)" }}
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
                      </>
                    ) : activeVideo === "video2" ? (
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
                              style={{ background: "var(--accent-gradient)" }}
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
                              style={{ background: "var(--accent-gradient)" }}
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
                              style={{ background: "var(--accent-gradient)" }}
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
                      </>
                    ) : (
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
                              style={{ background: "var(--accent-gradient)" }}
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
                              style={{ background: "var(--accent-gradient)" }}
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
                              style={{ background: "var(--accent-gradient)" }}
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
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Popup Modal */}
      {youtubePopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(10px)",
          }}
          onClick={closeYoutubePopup}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden"
            style={{
              background: "var(--card-bg)",
              boxShadow: "var(--accent-glow-strong)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                color: "var(--text-primary)",
                border: "2px solid var(--accent-primary)",
              }}
              onClick={closeYoutubePopup}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-primary)";
                e.currentTarget.style.color = "var(--primary-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
            >
              ✕
            </button>

            {/* YouTube Iframe */}
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
