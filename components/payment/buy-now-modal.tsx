"use client";

import { useState } from "react";
import { Crown, Check, X, CreditCard, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
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
        </div>

        <div className="p-6 space-y-6">
          {/* Subscription Information */}
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Monthly Subscription
              </h3>
              <div className="text-3xl font-bold text-blue-600">
                {plans.PREMIUM.price}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                14-day free trial • Cancel anytime
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What You&apos;ll Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.PREMIUM.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current vs Premium Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Plan Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Plan */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-600">
                    <Shield className="h-5 w-5" />
                    Your Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xl font-bold">{plans.FREE.name}</div>
                  <div className="text-2xl font-bold text-gray-500">
                    {plans.FREE.price}
                  </div>
                  <div className="space-y-2">
                    {plans.FREE.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <Check className="h-3 w-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Crown className="h-5 w-5" />
                    Premium Plan
                    {plans.PREMIUM.popular && (
                      <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xl font-bold">{plans.PREMIUM.name}</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {plans.PREMIUM.price}
                  </div>
                  <div className="space-y-2">
                    {plans.PREMIUM.features
                      .slice(0, 4)
                      .map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-3 w-3 text-green-500" />
                          {feature}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Creating Checkout...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {plans.PREMIUM.buttonText}
                </div>
              )}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure Payment
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Cancel Anytime
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              14-Day Free Trial
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
