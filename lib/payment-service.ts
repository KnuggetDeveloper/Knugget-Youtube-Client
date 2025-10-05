/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { AUTH_STORAGE_KEYS } from "@/types/auth";

export interface CreateSubscriptionRequest {
  metadata?: Record<string, string | number | boolean>;
}

export interface SubscriptionResponse {
  sessionId?: string;
  paymentLink?: string;
  productType: "subscription";
}

class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://knugget-youtube-backend.onrender.com/api";
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    // FIXED: Use correct storage key that matches auth service
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    const expiresAt = localStorage.getItem(AUTH_STORAGE_KEYS.EXPIRES_AT);

    if (!token) {
      throw new Error("Please log in to continue with payment");
    }

    // Check if token is expired
    if (expiresAt && Date.now() > parseInt(expiresAt)) {
      throw new Error("Your session has expired. Please log in again.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || `HTTP error! status: ${response.status}`;

      // Log detailed error for debugging
      console.error("Payment API Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData,
      });

      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.success) {
      console.error("Payment API Response Error:", data);
      throw new Error(data.error || "Unknown error occurred");
    }

    return data.data;
  }

  /**
   * Create a subscription checkout session
   */
  async createSubscriptionCheckoutSession(
    metadata?: Record<string, string | number | boolean>
  ): Promise<SubscriptionResponse> {
    try {
      const request: CreateSubscriptionRequest = {
        metadata: {
          plan: "PREMIUM",
          source: "web_subscription",
          ...metadata,
        },
      };

      const response = await fetch(`${this.baseUrl}/payment/create-payment`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const result = await this.handleResponse<SubscriptionResponse>(response);

      console.log("Subscription checkout session created:", result);
      toast.success("Subscription checkout session created successfully");
      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create subscription checkout session";
      toast.error(message);
      throw error;
    }
  }

  /**
   * Redirect to checkout URL
   */
  redirectToCheckout(checkoutUrl: string, openInNewTab = false): void {
    try {
      if (openInNewTab) {
        const newWindow = window.open(
          checkoutUrl,
          "_blank",
          "noopener,noreferrer"
        );
        if (!newWindow) {
          throw new Error("Popup blocked. Please allow popups for this site.");
        }
      } else {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to redirect to checkout";
      toast.error(message);
      throw error;
    }
  }

  /**
   * Request subscription cancellation (sends email to admin)
   */
  async requestCancellation(): Promise<{
    message: string;
    nextBillingDate?: string;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/payment/request-cancellation`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
        }
      );

      const result = await this.handleResponse<{
        message: string;
        nextBillingDate?: string;
      }>(response);

      console.log("Cancellation request submitted:", result);
      toast.success("Cancellation request submitted successfully");
      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to request cancellation";
      toast.error(message);
      throw error;
    }
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(): Promise<{
    isPremium: boolean;
    status: string;
    message: string;
    nextBillingDate?: string;
    cancelAtBillingDate?: boolean;
    subscriptionId?: string;
    subscription?: any;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/payment/subscription-status`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      const result = await this.handleResponse<{
        subscription?: any;
        isPremium?: boolean;
        status?: string;
        message?: string;
        nextBillingDate?: string;
        cancelAtBillingDate?: boolean;
        subscriptionId?: string;
        synced?: boolean;
      }>(response);

      console.log("Subscription status:", result);

      // Handle both formats - direct subscription object or wrapped data
      if (result.subscription) {
        const subscription = result.subscription;
        return {
          isPremium: subscription.status === "active",
          status: subscription.status,
          message: result.message || `Status: ${subscription.status}`,
          nextBillingDate: subscription.next_billing_date,
          cancelAtBillingDate: subscription.cancel_at_next_billing_date,
          subscriptionId: subscription.subscription_id,
          subscription: subscription,
        };
      } else {
        // Handle direct data format
        return {
          isPremium: result.isPremium || false,
          status: result.status || "free",
          message: result.message || "No active subscription",
          nextBillingDate: result.nextBillingDate,
          cancelAtBillingDate: result.cancelAtBillingDate,
          subscriptionId: result.subscriptionId,
        };
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to get subscription status";
      toast.error(message);
      throw error;
    }
  }

  /**
   * Process subscription payment
   */
  async processPayment(
    type: "subscription", // Only subscription type is supported
    billing?: undefined, // Not used anymore, always undefined
    options?: {
      metadata?: Record<string, string | number | boolean>;
      openInNewTab?: boolean;
    }
  ): Promise<void> {
    try {
      const result = await this.createSubscriptionCheckoutSession(
        options?.metadata
      );

      const checkoutUrl = result.paymentLink;
      if (!checkoutUrl) {
        console.error("Invalid subscription response:", result);
        throw new Error(
          "No checkout URL received from payment service. Please try again."
        );
      }

      console.log("Redirecting to subscription checkout:", checkoutUrl);
      this.redirectToCheckout(checkoutUrl, options?.openInNewTab);
    } catch (error) {
      // Error is already handled in individual methods
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
