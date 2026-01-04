"use client";

import { useState } from "react";

const newsletterItems = [
  {
    badge: "📹 Video",
    color: "rgba(255, 107, 53, 0.1)",
    borderColor: "rgba(255, 107, 53, 0.3)",
    textColor: "var(--accent-primary)",
    title: "30 Years of Business Knowledge",
    summary:
      "Key insights on starting with passion, managing people, and building lasting value...",
  },
  {
    badge: "📰 Article",
    color: "rgba(66, 153, 225, 0.1)",
    borderColor: "rgba(66, 153, 225, 0.3)",
    textColor: "#4299e1",
    title: "AI Breakthrough That's Changing Everything",
    summary:
      "New developments in AI technology affecting healthcare, education, and more...",
  },
  {
    badge: "💼 LinkedIn",
    color: "rgba(0, 119, 181, 0.1)",
    borderColor: "rgba(0, 119, 181, 0.3)",
    textColor: "#0077b5",
    title: "5 Growth Tactics by Michael Chen",
    summary:
      "Unconventional strategies that 10x'd user base through creative approaches...",
  },
];

export default function NewsletterSection() {
  const [hoveredButton, setHoveredButton] = useState(false);

  return (
    <section
      className="min-h-screen flex items-center py-16 sm:py-20 relative overflow-hidden"
      style={{ background: "var(--primary-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <div
              className="inline-block w-fit px-4 py-2 rounded-full text-sm font-semibold tracking-wide"
              style={{
                background: "rgba(255, 107, 53, 0.1)",
                border: "1px solid rgba(255, 107, 53, 0.3)",
                color: "var(--accent-primary)",
              }}
            >
              📧 Smart Digest
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Your Personalized Newsletter Recap
            </h2>
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Get a beautifully formatted newsletter recapping everything you
              saved. AI-powered summaries delivered straight to your inbox daily
              or weekly.
            </p>
            <ul className="flex flex-col gap-4">
              {[
                "AI-summarized recap of all saved content",
                "Choose daily or weekly delivery",
                "Organized by topic and priority",
                "Quick links back to original content",
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
              <span>Subscribe to Digest</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* Visual Mockup */}
          <div className="relative">
            <div
              className="rounded-2xl border overflow-hidden transition-all duration-300 hover:border-orange-500"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-color)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Email Header */}
              <div
                className="p-6 border-b"
                style={{
                  background: "var(--secondary-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex gap-2 mb-4">
                  <span className="text-base opacity-60 cursor-pointer hover:opacity-100 transition-opacity">
                    📥
                  </span>
                  <span className="text-base opacity-60 cursor-pointer hover:opacity-100 transition-opacity">
                    🗑️
                  </span>
                  <span className="text-base opacity-60 cursor-pointer hover:opacity-100 transition-opacity">
                    📁
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    📧
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div
                      className="font-semibold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Your TorchKB Digest
                    </div>
                    <div
                      className="text-xs truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      digest@TorchKB.ai
                    </div>
                  </div>
                </div>
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <h3
                    className="text-base font-bold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Your Weekly Recap - 7 Saved Items
                  </h3>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Today, 8:00 AM
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="mb-6">
                  <h4
                    className="text-sm font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Hi there! 👋
                  </h4>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Here&apos;s your personalized recap of everything you saved
                    this week.
                  </p>
                </div>

                {/* Newsletter Items */}
                <div className="flex flex-col gap-4 mb-6">
                  {newsletterItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg p-3 border transition-all duration-300 hover:border-orange-500 hover:translate-y-[-2px]"
                      style={{
                        background: "var(--secondary-bg)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div
                        className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2"
                        style={{
                          background: item.color,
                          border: `1px solid ${item.borderColor}`,
                          color: item.textColor,
                        }}
                      >
                        {item.badge}
                      </div>
                      <h5
                        className="text-sm font-semibold mb-1 leading-snug"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </h5>
                      <p
                        className="text-xs leading-relaxed mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.summary}
                      </p>
                      <a
                        href="#"
                        className="text-xs font-semibold inline-flex items-center gap-1 transition-all duration-300 hover:gap-2"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        Read Summary →
                      </a>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div
                  className="pt-4 border-t flex justify-center gap-2"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <button
                    className="px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 hover:bg-opacity-20"
                    style={{
                      background: "rgba(255, 107, 53, 0.1)",
                      border: "1px solid rgba(255, 107, 53, 0.3)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    ⚙️ Preferences
                  </button>
                  <button
                    className="px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 hover:bg-opacity-20"
                    style={{
                      background: "rgba(255, 107, 53, 0.1)",
                      border: "1px solid rgba(255, 107, 53, 0.3)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    📊 Stats
                  </button>
                </div>
              </div>
            </div>

            {/* Inbox Indicator */}
            <div
              className="absolute -bottom-5 right-6 flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{
                background: "var(--accent-gradient)",
                color: "var(--primary-bg)",
                boxShadow: "var(--accent-glow-strong)",
              }}
            >
              <span className="text-2xl flex-shrink-0">📬</span>
              <div className="flex flex-col">
                <div className="font-bold text-sm leading-tight">
                  Delivered to your inbox!
                </div>
                <div className="text-xs opacity-90">Every Monday at 8 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
