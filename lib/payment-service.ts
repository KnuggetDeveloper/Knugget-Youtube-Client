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
   * Cancel subscription
   */
  async cancelSubscription(): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/payment/cancel-subscription`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
        }
      );

      const result = await this.handleResponse<{ message: string }>(response);
      console.log("Subscription cancelled:", result);
      toast.success("Subscription cancelled successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to cancel subscription";
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
