"use client";

import { useState } from "react";

export default function ArticlesSection() {
  const [hoveredButton, setHoveredButton] = useState(false);

  return (
    <section
      className="min-h-screen flex items-center py-16 sm:py-20 relative overflow-hidden"
      style={{ background: "var(--secondary-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Mockup - First on mobile, second on desktop */}
          <div className="relative order-first lg:order-first">
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-color)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Browser Chrome */}
              <div
                className="flex items-center gap-3 p-3 border-b"
                style={{
                  background: "var(--secondary-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <div
                  className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded text-xs"
                  style={{
                    background: "var(--card-bg)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>🔒</span>
                  <span className="truncate">
                    techcrunch.com/article/ai-breakthrough
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-transform hover:scale-105"
                  style={{
                    background: "var(--accent-gradient)",
                    color: "var(--primary-bg)",
                    boxShadow: "var(--accent-glow)",
                  }}
                >
                  <span>💾</span>
                  <span>Save to Knugget</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-8">
                <h3
                  className="text-xl font-bold mb-2 leading-snug"
                  style={{ color: "var(--text-primary)" }}
                >
                  The AI Breakthrough That&apos;s Changing Everything
                </h3>
                <div
                  className="text-xs mb-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  By Alex Rivera • 5 min read
                </div>
                <div className="flex flex-col gap-3">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    In a stunning development, researchers have announced a
                    breakthrough in artificial intelligence that could
                    revolutionize how we interact with technology...
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    The implications are far-reaching, affecting industries from
                    healthcare to education...
                  </p>
                </div>
              </div>

              {/* Floating Save Popup */}
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-lg border"
                style={{
                  background: "var(--secondary-bg)",
                  borderColor: "var(--accent-primary)",
                  boxShadow: "var(--accent-glow-strong)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{
                    background: "var(--accent-gradient)",
                    color: "var(--primary-bg)",
                  }}
                >
                  ✓
                </div>
                <div className="flex flex-col">
                  <div
                    className="font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Article Saved!
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Added to your reading list
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6 order-last lg:order-last">
            <div
              className="inline-block w-fit px-4 py-2 rounded-full text-sm font-semibold tracking-wide"
              style={{
                background: "rgba(255, 107, 53, 0.1)",
                border: "1px solid rgba(255, 107, 53, 0.3)",
                color: "var(--accent-primary)",
              }}
            >
              📰 Smart Reading
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Save Web Articles Instantly
            </h2>
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Build your personal knowledge base from across the web. Save
              articles from any website with one click and never lose track of
              important reads.
            </p>
            <ul className="flex flex-col gap-4">
              {[
                "One-click save from any website",
                "Auto-extract key insights with AI",
                "Offline reading mode",
                "Organize with tags and collections",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: "var(--accent-gradient)",
                      color: "var(--primary-bg)",
                      boxShadow: "var(--accent-glow)",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="w-fit flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:transform hover:translate-y-[-3px]"
              style={{
                background: "var(--accent-gradient)",
                color: "var(--primary-bg)",
                boxShadow: hoveredButton
                  ? "var(--accent-glow-strong)"
                  : "var(--accent-glow)",
              }}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              <span>Start Saving Articles</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

