"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  const [selectedFormat, setSelectedFormat] = useState("Insightful");
  const [selectedView, setSelectedView] = useState("List");
  const [selectedLength, setSelectedLength] = useState("Auto");

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

  const handleVideoClick = () => {
    // Simulate video play/pause
    console.log("Video clicked");
  };

  const handleControlClick = (control: string) => {
    console.log(`Control clicked: ${control}`);
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
              >
              </Link>
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
                background: "var(--text-primary)",
                color: "var(--primary-bg)",
                boxShadow: "0 0 0 rgba(255, 107, 53, 0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 15px 35px rgba(255, 107, 53, 0.4)";
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
                  className="relative h-[300px] flex items-center justify-center cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #333 0%, #555 100%)",
                  }}
                  onClick={handleVideoClick}
                >
                  <div
                    className="text-4xl transition-transform duration-300 hover:scale-110"
                    style={{
                      color: "var(--accent-primary)",
                      textShadow: "var(--accent-glow)",
                    }}
                  >
                    ▶
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div
                      className="px-3 py-1 rounded text-sm font-medium"
                      style={{
                        background: "rgba(0, 0, 0, 0.8)",
                        color: "var(--text-primary)",
                      }}
                    >
                      2:26:45
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-2 leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    30 Years of Business Knowledge in 2hrs 26mins
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    © Simon Squibb
                  </p>
                </div>
              </div>

              {/* Related Videos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "$0 → $1m" },
                  { title: "Lex Fridman #438" },
                  { title: "HOW TO STUDY & LEARN" },
                ].map((video, index) => (
                  <div
                    key={index}
                    className="rounded-lg border overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:translate-y-[-3px]"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: "var(--border-color)",
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
                      className="h-[120px] flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #444 0%, #666 100%)",
                      }}
                    >
                      <div
                        className="px-3 py-2 rounded text-xs font-medium text-center"
                        style={{
                          background: "rgba(0, 0, 0, 0.8)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {video.title}
                      </div>
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
                    { icon: "💎", active: true },
                    { icon: "📋", active: false },
                    { icon: "💬", active: false },
                    { icon: "📝", active: false },
                  ].map((btn, index) => (
                    <button
                      key={index}
                      className="w-10 h-10 flex items-center justify-center rounded border transition-all duration-300"
                      style={{
                        borderColor: btn.active
                          ? "var(--accent-primary)"
                          : "var(--border-color)",
                        color: btn.active
                          ? "var(--accent-primary)"
                          : "var(--text-secondary)",
                        boxShadow: btn.active ? "var(--accent-glow)" : "none",
                      }}
                      onClick={() => handleControlClick(btn.icon)}
                      onMouseEnter={(e) => {
                        if (!btn.active) {
                          e.currentTarget.style.borderColor =
                            "var(--accent-primary)";
                          e.currentTarget.style.color = "var(--accent-primary)";
                          e.currentTarget.style.boxShadow =
                            "var(--accent-glow)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!btn.active) {
                          e.currentTarget.style.borderColor =
                            "var(--border-color)";
                          e.currentTarget.style.color = "var(--text-secondary)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      {btn.icon}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded border transition-all duration-300"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                    onClick={() => handleControlClick("share")}
                  >
                    📤
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded border transition-all duration-300"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                    onClick={() => handleControlClick("settings")}
                  >
                    ⚙️
                  </button>
                </div>

                <div className="flex gap-2">
                  {[
                    {
                      value: selectedFormat,
                      options: ["Insightful", "Detailed", "Brief"],
                    },
                    {
                      value: selectedView,
                      options: ["List", "Cards", "Timeline"],
                    },
                    {
                      value: selectedLength,
                      options: ["Auto", "Short", "Long"],
                    },
                  ].map((dropdown, index) => (
                    <select
                      key={index}
                      value={dropdown.value}
                      onChange={(e) => {
                        if (index === 0) setSelectedFormat(e.target.value);
                        if (index === 1) setSelectedView(e.target.value);
                        if (index === 2) setSelectedLength(e.target.value);
                      }}
                      className="px-3 py-2 rounded border text-sm cursor-pointer transition-colors"
                      style={{
                        background: "var(--card-bg)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {dropdown.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>

              {/* Summary Content */}
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-8">
                  {/* Business Fundamentals Section */}
                  <div>
                    <h4
                      className="text-xl font-semibold mb-4 relative"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Business Fundamentals
                      <div
                        className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                        style={{ background: "var(--accent-gradient)" }}
                      />
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          icon: "🔥",
                          text: "Start a business with passion, not an idea: combine forces with others to execute on what you love, like marketing and graphic illustrations, rather than starting with an original idea and trying to do it alone.",
                        },
                        {
                          icon: "🎯",
                          text: "Install a purpose bigger than yourself in your business to manage people and reduce stress, as managing people is one of the biggest stresses of building a company.",
                        },
                        {
                          icon: "💰",
                          text: "Delay gratification and focus on building value for users: build a brand, not a business, and wait to monetize until you have a massive user base, like Facebook and Instagram did.",
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
                            e.currentTarget.style.background = "transparent";
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

                  {/* Strategy and Growth Section */}
                  <div>
                    <h4
                      className="text-xl font-semibold mb-4 relative"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Strategy and Growth
                      <div
                        className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
                        style={{ background: "var(--accent-gradient)" }}
                      />
                    </h4>
                    <div className="space-y-4">
                      <div
                        className="flex gap-4 items-start p-2 rounded transition-all duration-300"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 107, 53, 0.05)";
                          e.currentTarget.style.margin = "0 -8px";
                          e.currentTarget.style.padding = "8px";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.margin = "0";
                          e.currentTarget.style.padding = "8px 0";
                        }}
                      >
                        <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Use mind maps instead of business plans: start in the
                          middle with your hobby or passion, then add the
                          business, allowing for infinite thinking and mapping
                          out different directions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
