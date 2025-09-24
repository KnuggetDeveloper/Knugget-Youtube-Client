"use client";

import { useState } from "react";
import { Crown, X, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { paymentService } from "@/lib/payment-service";
import { toast } from "sonner";

interface PremiumStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    plan: string;
    credits: number;
    email: string;
    name: string | null;
    subscriptionId?: string | null;
  };
}

export function PremiumStatusModal({
  isOpen,
  onClose,
  user,
}: PremiumStatusModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  const handleCancelSubscription = async () => {
    setIsLoading(true);

    try {
      await paymentService.cancelSubscription();
      toast.success("Subscription cancelled successfully");
      onClose();

      // Refresh the page to update the user's plan status
      window.location.reload();
    } catch (error) {
      console.error("Cancel subscription failed:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to cancel subscription. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card">
        <CardContent className="p-6">
          {!showCancelConfirm ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-knugget-500" />
                  <h2 className="text-xl font-bold">Premium</h2>
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

              {/* Status */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-600">Active</span>
                </div>
                <p className="text-sm text-muted-foreground">$9.99/month</p>
              </div>

              {/* User Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Credits:</span>
                  <span>{user.credits}</span>
                </div>
                {user.subscriptionId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subscription ID:
                    </span>
                    <span className="font-mono text-xs break-all">
                      {user.subscriptionId}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button
                  onClick={() => setShowCancelConfirm(true)}
                  variant="destructive"
                  className="flex-1"
                >
                  Cancel Plan
                </Button>
              </div>
            </div>
          ) : (
            /* Cancel Confirmation */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Cancel Subscription</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Are you sure you want to cancel?
                </p>
                <p className="text-xs text-red-600">
                  You&apos;ll lose all Premium features immediately
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Keep Premium
                </Button>
                <Button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      Cancelling...
                    </div>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
