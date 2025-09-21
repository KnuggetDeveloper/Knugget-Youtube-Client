"use client";

import { useState } from "react";
import { Crown, Star, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/additional";
import { BuyNowModal } from "./buy-now-modal";
import { useAuth } from "@/contexts/auth-context";

interface BuyNowButtonProps {
  variant?: "card" | "button";
  size?: "sm" | "lg" | "default";
  className?: string;
}

export function BuyNowButton({
  variant = "card",
  size = "default",
  className = "",
}: BuyNowButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Don't show if user is not authenticated or already premium
  if (!isAuthenticated || !user || user?.plan === "PREMIUM") {
    return null;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (variant === "button") {
    return (
      <>
        <Button
          onClick={handleOpenModal}
          className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${className}`}
          size={size}
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>

        <BuyNowModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          currentPlan={user?.plan || "FREE"}
        />
      </>
    );
  }

  return (
    <>
      <Card
        className={`relative overflow-hidden border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${className}`}
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-bl-full opacity-20"></div>
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-30"></div>

        <CardContent className="p-6 relative z-10" onClick={handleOpenModal}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock unlimited AI summaries
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Unlimited AI summaries</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Advanced summarization</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Export to multiple formats</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Early access to features</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Bulk processing</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">One-time</div>
                <div className="text-xl font-bold text-green-600">$29.99</div>
                <div className="text-xs text-muted-foreground">Lifetime</div>
              </div>
              <div className="text-center relative">
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1">
                  7-day trial
                </Badge>
                <div className="text-xs text-muted-foreground mt-2">
                  Monthly
                </div>
                <div className="text-xl font-bold text-blue-600">$9.99</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
            </div>

            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={handleOpenModal}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <BuyNowModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentPlan={user?.plan || "FREE"}
      />
    </>
  );
}
