"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { refreshAuth } = useAuth();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const payment_id = searchParams.get("payment_id");
    const payment_status = searchParams.get("status");

    setPaymentId(payment_id);
    setStatus(payment_status);

    // Refresh user auth to get updated subscription status
    // This ensures the user's profile reflects their new premium status
    const refreshUserData = async () => {
      if (payment_id && payment_status === "active") {
        setIsRefreshing(true);
        try {
          await refreshAuth();
          console.log(
            "✅ User profile refreshed after successful subscription"
          );
        } catch (error) {
          console.error("❌ Failed to refresh user profile:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    refreshUserData();
  }, [searchParams, refreshAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Subscription Started!
          </h1>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
            <p className="text-green-700 dark:text-green-300 font-semibold">
              Your 14-day free trial has begun!
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
              You won&apos;t be charged until the trial period ends.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for subscribing to our service.
          </p>
        </div>

        {paymentId && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Payment ID:</strong> {paymentId}
            </p>
          </div>
        )}

        {status && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Status:</strong> {status}
            </p>
          </div>
        )}

        <Link href="/dashboard">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isRefreshing}
          >
            <Home className="h-4 w-4 mr-2" />
            {isRefreshing ? "Updating profile..." : "Go to Dashboard"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
