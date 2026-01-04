"use client";

import {
  Search,
  Calendar,
  Clock,
  User,
  Youtube,
  Linkedin,
  Globe,
  BarChart3,
} from "lucide-react";

export default function SearchSection() {
  return (
    <section
      className="min-h-screen flex items-center py-16 sm:py-20 relative overflow-hidden"
      style={{ background: "var(--primary-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Search Your Personal Knowledge Base
            </h2>
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Instantly search through all your youtube summaries, linkedin
              posts and web articles anytime
            </p>
          </div>

          {/* Visual Mockup */}
          <div className="relative">
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-color)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Search Header */}
              <div
                className="p-6 border-b"
                style={{
                  background: "var(--secondary-bg)",
                  borderBottomColor: "var(--border-color)",
                }}
              >
                <div
                  className="flex items-center gap-3 rounded-lg border-2 p-3 transition-all duration-300 focus-within:border-orange-500"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <Search
                    className="w-5 h-5"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-base"
                    placeholder="Search your saved content..."
                    defaultValue="product launch strategies"
                    style={{ color: "var(--text-primary)" }}
                  />
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-gray-700"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="p-6 max-h-[500px] overflow-y-auto">
                {/* Results Header */}
                <div
                  className="mb-6 pb-3 border-b"
                  style={{ borderBottomColor: "var(--border-color)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    3 results found
                  </span>
                </div>

                {/* Result Items */}
                <div className="space-y-4">
                  {/* Video Result - Highlighted */}
                  <div
                    className="rounded-lg p-4 border transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:translate-x-1"
                    style={{
                      background: "rgba(255, 107, 53, 0.05)",
                      borderColor: "rgba(255, 107, 53, 0.5)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background: "rgba(255, 107, 53, 0.1)",
                          color: "var(--accent-primary)",
                          border: "1px solid rgba(255, 107, 53, 0.3)",
                        }}
                      >
                        <Youtube className="w-3 h-3" />
                        Video
                      </span>
                    </div>
                    <h5
                      className="text-base font-semibold mb-2 leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      30 Years of Business Knowledge in 2hrs 26mins
                    </h5>
                    <p
                      className="text-sm mb-3 leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      ...focus on building value for users: build a brand, not a
                      business. Key{" "}
                      <mark
                        className="font-semibold bg-transparent"
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        product launch
                      </mark>{" "}
                      insights include starting with passion and{" "}
                      <mark
                        className="font-semibold bg-transparent"
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        strategy
                      </mark>
                      ...
                    </p>
                    <div className="flex items-center gap-4 flex-wrap text-xs">
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>2 days ago</span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>2h 26m</span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Simon Squibb</span>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Result */}
                  <div
                    className="rounded-lg p-4 border transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:translate-x-1"
                    style={{
                      background: "var(--secondary-bg)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background: "rgba(0, 119, 181, 0.1)",
                          color: "#0077b5",
                          border: "1px solid rgba(0, 119, 181, 0.3)",
                        }}
                      >
                        <Linkedin className="w-3 h-3" />
                        LinkedIn Post
                      </span>
                    </div>
                    <h5
                      className="text-base font-semibold mb-2 leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Just shipped our biggest feature yet!
                    </h5>
                    <p
                      className="text-sm mb-3 leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      ...learned about{" "}
                      <mark
                        className="font-semibold bg-transparent"
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        product-market
                      </mark>{" "}
                      fit and{" "}
                      <mark
                        className="font-semibold bg-transparent"
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        launch
                      </mark>{" "}
                      timing. The key to successful{" "}
                      <mark
                        className="font-semibold bg-transparent"
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        product strategies
                      </mark>{" "}
                      is understanding your users deeply...
                    </p>
                    <div className="flex items-center gap-4 flex-wrap text-xs">
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>1 week ago</span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Sarah Johnson</span>
                      </div>
                    </div>
                  </div>

                  {/* Article Result */}
                  <div
                    className="rounded-lg p-4 border transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:translate-x-1"
                    style={{
                      background: "var(--secondary-bg)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background: "rgba(66, 153, 225, 0.1)",
                          color: "#4299e1",
                          border: "1px solid rgba(66, 153, 225, 0.3)",
                        }}
                      >
                        <Globe className="w-3 h-3" />
                        Article
                      </span>
                    </div>
                    <h5
                      className="text-base font-semibold mb-2 leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      The AI Breakthrough That&apos;s Changing Everything
                    </h5>
                    <p
                      className="text-sm mb-3 leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      ...implications for{" "}
                      <mark
                        className="font-semibold bg-transparent"
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        product development
                      </mark>{" "}
                      and{" "}
                      <mark
                        className="font-semibold bg-transparent"
                        style={{
                          background: "var(--accent-gradient)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        launch strategies
                      </mark>{" "}
                      in the tech industry. New AI tools are transforming how
                      teams work...
                    </p>
                    <div className="flex items-center gap-4 flex-wrap text-xs">
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>3 days ago</span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>5 min read</span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Alex Rivera</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Badge */}
            <div
              className="absolute -bottom-5 right-6 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg"
              style={{
                background: "var(--accent-gradient)",
                color: "var(--primary-bg)",
              }}
            >
              <BarChart3 className="w-5 h-5" />
              <div>
                <div className="font-semibold text-sm">
                  127 items in your library
                </div>
                <div className="text-xs opacity-90">
                  Ready to search anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
