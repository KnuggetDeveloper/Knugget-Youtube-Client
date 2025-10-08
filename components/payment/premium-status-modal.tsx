"use client";

import React, { useEffect, useState } from "react";
import { Crown, X, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { paymentService } from "@/lib/payment-service";

interface PremiumStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    plan: string;
    credits: number;
    email: string;
    name: string | null;
    subscriptionId?: string | null;
    inputTokensRemaining?: number;
    outputTokensRemaining?: number;
    tokenResetDate?: string | null;
  };
}

export function PremiumStatusModal({
  isOpen,
  onClose,
  user,
}: PremiumStatusModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isPremium: boolean;
    status: string;
    message: string;
    nextBillingDate?: string;
    cancelAtBillingDate?: boolean;
    subscriptionId?: string;
  } | null>(null);

  // Fetch subscription status when modal opens
  useEffect(() => {
    if (isOpen && user?.plan === "PREMIUM") {
      fetchSubscriptionStatus();
    }
  }, [isOpen, user?.plan]);

  const fetchSubscriptionStatus = async () => {
    try {
      const status = await paymentService.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    }
  };

  if (!isOpen) return null;

  const handleCancelSubscription = async () => {
    setIsLoading(true);

    try {
      await paymentService.requestCancellation();
      toast.success("Cancellation request submitted successfully");
      onClose();

      // Refresh subscription status
      await fetchSubscriptionStatus();

      // Refresh the page to update the user's plan status
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Cancel subscription request failed:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to request cancellation. Please try again.");
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
                  <span className="font-semibold text-green-600">
                    {subscriptionStatus?.cancelAtBillingDate
                      ? "Cancelling"
                      : "Active"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">$9.99/month</p>
                {subscriptionStatus?.message && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {subscriptionStatus.message}
                  </p>
                )}
              </div>

              {/* Subscription Status Details */}
              {subscriptionStatus && (
                <div className="bg-muted p-3 rounded-lg">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{subscriptionStatus.status}</span>
                    </div>
                    {subscriptionStatus.nextBillingDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Next Billing:
                        </span>
                        <span>
                          {new Date(
                            subscriptionStatus.nextBillingDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {subscriptionStatus.subscriptionId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Subscription ID:
                        </span>
                        <span className="font-mono break-all">
                          {subscriptionStatus.subscriptionId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user.email}</span>
                </div>
                {user.plan === "FREE" ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits:</span>
                    <span>{user.credits}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Input Tokens:
                      </span>
                      <span className="font-mono">
                        {user.inputTokensRemaining?.toLocaleString() || "0"} /
                        9,000,000
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Output Tokens:
                      </span>
                      <span className="font-mono">
                        {user.outputTokensRemaining?.toLocaleString() || "0"} /
                        600,000
                      </span>
                    </div>
                    {user.tokenResetDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Token Reset:
                        </span>
                        <span>
                          {new Date(user.tokenResetDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                {subscriptionStatus?.cancelAtBillingDate ? (
                  <div className="flex-1 bg-yellow-50 border border-yellow-200 p-2 rounded-lg text-center">
                    <p className="text-xs text-yellow-800">
                      Cancellation requested
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowCancelConfirm(true)}
                    variant="destructive"
                    className="flex-1"
                  >
                    Request Cancellation
                  </Button>
                )}
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
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Request subscription cancellation?
                </p>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
                  <p className="text-xs text-blue-800">
                    ✅ You&apos;ll keep premium access until your next billing
                    date
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    📧 We&apos;ll process your request within 24 hours
                  </p>
                </div>

                {/* Email Information */}
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-left">
                  <p className="text-xs text-gray-700 mb-1">
                    <strong>What happens next:</strong>
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    • Request logged for admin review
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    • Manual cancellation in DodoPayments dashboard
                  </p>
                  <p className="text-xs text-gray-600">
                    • Premium access continues until billing date
                  </p>
                </div>
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
                      Requesting...
                    </div>
                  ) : (
                    "Request Cancellation"
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
