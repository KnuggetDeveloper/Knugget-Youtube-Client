/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/firebase-auth-context";
import { Button } from "@/components/ui/button";
import { floatingIcons } from "@/data/videoData";
import VideoDemo from "@/components/landing/VideoDemo";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                  <img
                    src="/logo.png"
                    alt="Knugget Logo"
                    width={20}
                    height={20}
                  />
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: mobileMenuOpen
                  ? "rgba(255, 107, 53, 0.1)"
                  : "transparent",
                border: mobileMenuOpen
                  ? "1px solid rgba(255, 107, 53, 0.3)"
                  : "1px solid transparent",
              }}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className="block h-0.5 w-full rounded transition-all duration-300"
                  style={{
                    backgroundColor: mobileMenuOpen
                      ? "var(--accent-primary)"
                      : "var(--text-primary)",
                    transform: mobileMenuOpen
                      ? "rotate(45deg) translateY(8px)"
                      : "rotate(0)",
                  }}
                />
                <span
                  className="block h-0.5 w-full rounded transition-all duration-300"
                  style={{
                    backgroundColor: "var(--text-primary)",
                    opacity: mobileMenuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="block h-0.5 w-full rounded transition-all duration-300"
                  style={{
                    backgroundColor: mobileMenuOpen
                      ? "var(--accent-primary)"
                      : "var(--text-primary)",
                    transform: mobileMenuOpen
                      ? "rotate(-45deg) translateY(-8px)"
                      : "rotate(0)",
                  }}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className="md:hidden py-4 space-y-3 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Link
                href="#"
                className="block px-4 py-2 rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255, 107, 53, 0.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              ></Link>
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push("/")}
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
                  onClick={handleGetStarted}
                  className="w-full px-6 py-2 rounded font-semibold"
                  style={{
                    background: "var(--accent-gradient)",
                    color: "var(--primary-bg)",
                  }}
                >
                  Get Started
                </button>
              )}
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
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-normal"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <span className="knugget-gradient-text">Get Insights</span> from any
            YouTube video in seconds
          </h1>
          <p
            className="text-lg md:text-xl mb-10 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Transform hours of content into actionable insights with AI-powered
            summarization
          </p>
          <button
            onClick={handleInstallClick}
            className="group relative px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:transform hover:scale-105"
            style={{
              background: "var(--accent-gradient)",
              color: "var(--primary-bg)",
              boxShadow: "var(--accent-glow)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--accent-glow-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "var(--accent-glow)";
            }}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            <span
              className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>

        {/* Background Icons */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {floatingIcons.map((item, index) => (
            <div
              key={item.id}
              className="absolute text-2xl float-animation"
              style={{
                top: `${15 + Math.sin(index) * 70}%`,
                left: `${10 + ((index * 11) % 85)}%`,
                animationDelay: item.delay,
                opacity: 0.15,
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Section - Video Demo */}
      <section
        className="py-16 min-h-screen"
        style={{ background: "var(--secondary-bg)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <VideoDemo />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 text-center border-t"
        style={{
          background: "var(--primary-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <p style={{ color: "var(--text-secondary)" }}>
            © {new Date().getFullYear()} Knugget. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
