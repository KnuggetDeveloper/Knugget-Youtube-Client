"use client";

import { useState } from "react";

export default function LinkedInSection() {
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
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Save LinkedIn Posts in One Click
            </h2>
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Never lose valuable insights from your LinkedIn feed again. Save
              posts, articles, and thought leadership content directly from
              LinkedIn with a single click.
            </p>
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
            </button>
          </div>

          {/* Visual Mockup */}
          <div className="relative">
            <div
              className="rounded-2xl border overflow-hidden p-6"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-color)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div className="flex flex-col gap-4">
                {/* LinkedIn Post 1 */}
                <div
                  className="rounded-lg p-4 border transition-all duration-300 hover:border-orange-500"
                  style={{
                    background: "var(--secondary-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--accent-gradient)" }}
                    >
                      👤
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div
                        className="font-semibold text-sm truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Sarah Johnson
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Product Manager @ Tech Co
                      </div>
                    </div>
                  </div>
                  <div
                    className="mb-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Just shipped our biggest feature yet! Here&apos;s what I
                    learned about product-market fit... 🚀
                  </div>
                  <div
                    className="flex gap-4 pt-2 border-t"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <span
                      className="text-xs cursor-pointer transition-colors"
                      style={{ color: "var(--text-muted)" }}
                    >
                      👍 Like
                    </span>
                    <span
                      className="text-xs cursor-pointer transition-colors"
                      style={{ color: "var(--text-muted)" }}
                    >
                      💬 Comment
                    </span>
                    <span
                      className="text-xs font-semibold cursor-pointer"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      💾 Save to TorchKB
                    </span>
                  </div>
                </div>

                {/* LinkedIn Post 2 */}
                <div
                  className="rounded-lg p-4 border transition-all duration-300 hover:border-orange-500"
                  style={{
                    background: "var(--secondary-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "var(--accent-gradient)" }}
                    >
                      🎯
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div
                        className="font-semibold text-sm truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Michael Chen
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Growth Expert
                      </div>
                    </div>
                  </div>
                  <div
                    className="mb-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    5 unconventional growth tactics that 10x&apos;d our user
                    base...
                  </div>
                  <div
                    className="flex gap-4 pt-2 border-t"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <span
                      className="text-xs cursor-pointer transition-colors"
                      style={{ color: "var(--text-muted)" }}
                    >
                      👍 Like
                    </span>
                    <span
                      className="text-xs cursor-pointer transition-colors"
                      style={{ color: "var(--text-muted)" }}
                    >
                      💬 Comment
                    </span>
                    <span
                      className="text-xs font-semibold cursor-pointer"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      💾 Save to TorchKB
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Indicator */}
              <div
                className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm"
                style={{
                  background: "var(--accent-gradient)",
                  color: "var(--primary-bg)",
                  boxShadow: "var(--accent-glow-strong)",
                }}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-black text-orange-500 flex-shrink-0">
                  ✓
                </span>
                <span>Saved to your library!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
