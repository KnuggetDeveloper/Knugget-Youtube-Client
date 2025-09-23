"use client";

import { useState } from "react";
import { Crown, Check, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
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

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      await paymentService.processPayment(
        "subscription", // Only subscription type supported
        undefined, // No billing info - let DODOpayment handle it
        {
          metadata: {
            currentPlan,
            upgradeType: "subscription",
          },
          openInNewTab: false,
        }
      );
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

  const plans = {
    FREE: {
      name: "Free",
      price: "$0",
      features: [
        "10 monthly credits",
        "Basic AI summaries",
        "Standard support",
        "Limited features",
      ],
      buttonText: "Current Plan",
      disabled: true,
    },
    PREMIUM: {
      name: "Premium",
      price: "$9.99/month",
      period: "per month",
      features: [
        "1,000 monthly credits",
        "Advanced AI summaries",
        "Priority support",
        "Full feature access",
        "Export capabilities",
        "Custom templates",
        "API access",
        "Advanced analytics",
        "14-day free trial",
        "Cancel anytime",
      ],
      buttonText: "Start Free Trial",
      disabled: false,
      popular: true,
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-knugget-500" />
                <h2 className="text-xl font-bold">Upgrade to Premium</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Pricing */}
            <div className="text-center">
              <div className="text-3xl font-bold text-knugget-500 mb-1">
                $9.99
              </div>
              <p className="text-sm text-muted-foreground">
                per month • 14-day free trial
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold">What you&apos;ll get:</h3>
              <div className="space-y-2">
                {plans.PREMIUM.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Maybe Later
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-knugget-500 to-knugget-600 hover:from-knugget-600 hover:to-knugget-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Starting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Start Free Trial
                  </div>
                )}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>✓ Cancel anytime</span>
              <span>✓ Secure payment</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
