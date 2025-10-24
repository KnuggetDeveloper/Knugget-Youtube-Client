"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { paymentService } from "@/lib/payment-service";
import { toast } from "sonner";

interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: "FREE" | "PREMIUM";
}

export function BuyNowModal({
  isOpen,
  onClose,
  currentPlan,
}: BuyNowModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async (planType: "lite" | "pro") => {
    setIsLoading(true);

    try {
      await paymentService.processPayment("subscription", undefined, {
        metadata: {
          currentPlan,
          upgradeType: "subscription",
          selectedPlan: planType,
        },
        openInNewTab: false,
      });
    } catch (error) {
      console.error("Subscription payment failed:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("log in") ||
          error.message.includes("session has expired")
        ) {
          toast.error("Your session has expired. Please log in again.");
          window.location.href = "/login";
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Subscription payment failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl overflow-hidden"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 z-10"
          style={{
            background: "var(--secondary-bg)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-color)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-primary)";
            e.currentTarget.style.color = "var(--primary-bg)";
            e.currentTarget.style.borderColor = "var(--accent-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--secondary-bg)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--border-color)";
          }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div
          className="p-6 text-center border-b"
          style={{
            background: "var(--secondary-bg)",
            borderBottomColor: "var(--border-color)",
          }}
        >
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Upgrade to Premium
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Unlock unlimited summaries and get more done faster
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lite Plan */}
            <div
              className="rounded-lg border overflow-hidden transition-all duration-300 hover:transform hover:translate-y-[-2px]"
              style={{
                background: "var(--secondary-bg)",
                borderColor: "var(--border-color)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-primary)";
                e.currentTarget.style.boxShadow = "var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Badge */}
              <div
                className="px-4 py-2 text-center text-sm font-medium"
                style={{
                  background: "var(--accent-primary)",
                  color: "var(--primary-bg)",
                }}
              >
                Lite
              </div>

              <div className="p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      $
                    </span>
                    <span
                      className="text-4xl font-bold mx-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      5
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      /month
                    </span>
                  </div>
                </div>

                {/* Main Feature */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-2xl">📹</span>
                  <div className="text-center">
                    <div
                      className="text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      100 Videos
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      per month
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {["AI-powered summaries", "Key insights extraction"].map(
                    (feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span
                          className="text-sm font-bold"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          ✓
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={() => handlePayment("lite")}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:transform hover:translate-y-[-1px]"
                  style={{
                    background: "var(--accent-gradient)",
                    color: "var(--primary-bg)",
                    boxShadow: "0 0 0 rgba(255, 107, 53, 0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--accent-glow)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 rgba(255, 107, 53, 0)";
                  }}
                >
                  {isLoading ? "Processing..." : "Get Started"}
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div
              className="rounded-lg border overflow-hidden transition-all duration-300 hover:transform hover:translate-y-[-2px] relative"
              style={{
                background: "var(--secondary-bg)",
                borderColor: "var(--accent-primary)",
                boxShadow: "var(--accent-glow)",
              }}
            >
              {/* Featured Badge */}
              <div
                className="px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2"
                style={{
                  background: "var(--accent-gradient)",
                  color: "var(--primary-bg)",
                }}
              >
                <span>💎</span>
                <span>Most Popular</span>
              </div>

              <div className="p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      $
                    </span>
                    <span
                      className="text-4xl font-bold mx-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      15
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      /month
                    </span>
                  </div>
                </div>

                {/* Main Feature */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-2xl">🚀</span>
                  <div className="text-center">
                    <div
                      className="text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      300 Videos
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      per month
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {["AI-powered summaries", "Key insights extraction"].map(
                    (feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span
                          className="text-sm font-bold"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          ✓
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={() => handlePayment("pro")}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:transform hover:translate-y-[-1px]"
                  style={{
                    background: "var(--accent-gradient)",
                    color: "var(--primary-bg)",
                    boxShadow: "var(--accent-glow)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "var(--accent-glow-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--accent-glow)";
                  }}
                >
                  {isLoading ? "Processing..." : "Get Started"}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p
              className="text-sm flex items-center justify-center gap-2"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>🔒</span>
              <span>
                Secure payment • Cancel anytime • 30-day money-back guarantee
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
