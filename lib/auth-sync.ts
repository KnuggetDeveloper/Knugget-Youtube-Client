/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth-sync.ts - Enhanced and simplified auth sync service
import { User, ExtensionAuthData, AUTH_STORAGE_KEYS } from "@/types/auth";

interface ChromeAPI {
  storage: any;
  runtime: {
    sendMessage: (extensionId: string, message: any) => Promise<any>;
    onMessage?: {
      addListener: (
        callback: (message: any, sender: any, sendResponse: any) => void
      ) => void;
    };
  };
}

// Type guard for Chrome API (only need runtime for message passing)
function getChromeAPI(): ChromeAPI | null {
  if (typeof window === "undefined") return null;
  if (typeof chrome === "undefined") return null;
  if (!chrome.runtime) return null;
  // Note: We don't need chrome.storage for web pages - only runtime for messaging
  return chrome as unknown as ChromeAPI;
}

interface WebAuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class AuthSyncService {
  private chromeAPI: ChromeAPI | null = null;
  private extensionId: string | null = null;

  constructor() {
    // Skip initialization during SSR
    if (typeof window === "undefined") {
      return;
    }

    this.chromeAPI = getChromeAPI();
    // Try to get extension ID from localStorage first, then from URL params
    this.extensionId =
      this.getStoredExtensionId() || this.getExtensionIdFromUrl();
    console.log("🔧 AuthSyncService initialized:", {
      hasChromeAPI: !!this.chromeAPI,
      extensionId: this.extensionId,
      chromeExists: typeof chrome !== "undefined",
      chromeRuntime: typeof chrome !== "undefined" && !!chrome?.runtime,
    });
    this.setupListeners();
    this.startExtensionWatcher();
  }

  /**
   * Check if Chrome extension API is available
   */
  async isExtensionAvailable(): Promise<boolean> {
    if (typeof window === "undefined" || !this.chromeAPI) {
      console.log("ℹ️ Chrome runtime API not available", {
        isServer: typeof window === "undefined",
        chromeExists: typeof chrome !== "undefined",
        chromeRuntime: typeof chrome !== "undefined" && !!chrome.runtime,
      });
      return false;
    }

    // Try to discover extension ID if not known
    if (!this.extensionId) {
      const urlExtensionId = this.getExtensionIdFromUrl();
      if (urlExtensionId) {
        this.extensionId = urlExtensionId;
        this.storeExtensionId(urlExtensionId);
      }
    }

    // Build list of extension IDs to try
    const extensionIds = [
      this.extensionId,
      this.getExtensionIdFromUrl(),
    ].filter(Boolean);

    for (const id of extensionIds) {
      try {
        console.log("🔍 Testing extension ID:", id);
        const response = await this.chromeAPI.runtime.sendMessage(id!, {
          type: "KNUGGET_CHECK_AUTH",
          timestamp: new Date().toISOString(),
        });
        console.log("✅ Extension is available with ID:", id, response);
        this.extensionId = id; // Update the working extension ID
        if (id) {
          this.storeExtensionId(id); // Store for future use
        }
        return true;
      } catch (error) {
        console.log("ℹ️ Extension ID not responding:", id, error);
      }
    }

    console.log("❌ No working extension found");
    return false;
  }

  /**
   * Sync authentication success to Chrome extension
   */
  async syncAuthSuccess(authData: WebAuthData): Promise<boolean> {
    console.log("🔄 Starting auth sync to extension...", {
      hasChromeAPI: !!this.chromeAPI,
      extensionId: this.extensionId,
      userEmail: authData.user.email,
    });

    if (typeof window === "undefined" || !this.chromeAPI) {
      console.log("ℹ️ Chrome API not available - extension not installed");
      return false;
    }

    if (!this.extensionId) {
      console.log("ℹ️ Extension ID not configured");
      return false;
    }

    try {
      const extensionAuthData: ExtensionAuthData = {
        token: authData.accessToken,
        refreshToken: authData.refreshToken,
        user: {
          id: authData.user.id,
          name: authData.user.name,
          email: authData.user.email,
          videosProcessedThisMonth: authData.user.videosProcessedThisMonth,
          plan: authData.user.plan.toLowerCase(),
        },
        expiresAt: authData.expiresAt,
        loginTime: new Date().toISOString(),
      };

      // Try to send message to extension first (this will fail if extension isn't installed)
      try {
        console.log(
          "📤 Sending auth message to extension...",
          this.extensionId
        );
        const response = await this.chromeAPI.runtime.sendMessage(
          this.extensionId,
          {
            type: "KNUGGET_AUTH_SUCCESS",
            payload: {
              accessToken: authData.accessToken,
              refreshToken: authData.refreshToken,
              user: authData.user,
              expiresAt: authData.expiresAt,
            },
            timestamp: new Date().toISOString(),
          }
        );
        console.log(
          "✅ Extension message sent successfully, response:",
          response
        );
      } catch (messageError) {
        console.log(
          "ℹ️ Extension not responding to message (may not be installed):",
          messageError
        );
        // Continue with storage sync even if message fails
      }

      // Try to store in Chrome storage (this may also fail if extension isn't installed)
      try {
        await Promise.all([
          this.chromeAPI.storage.sync.set({ knugget_auth: extensionAuthData }),
          this.chromeAPI.storage.local.set({
            knuggetUserInfo: extensionAuthData,
          }),
        ]);
        console.log("✅ Auth data stored in extension storage");
      } catch (storageError) {
        console.log(
          "ℹ️ Failed to store in extension storage (extension may not be installed):",
          storageError
        );
        return false;
      }

      console.log("✅ Auth success synced to extension");
      return true;
    } catch (error) {
      console.log(
        "ℹ️ Extension sync failed (extension may not be installed):",
        error
      );
      return false;
    }
  }

  /**
   * Sync logout to Chrome extension
   */
  async syncLogout(): Promise<boolean> {
    console.log("🔄 Attempting to sync logout to extension...");

    if (!this.chromeAPI) {
      console.log("ℹ️ Chrome runtime API not available");
      return false;
    }

    if (!this.extensionId) {
      console.log("ℹ️ Extension ID not configured");
      return false;
    }

    try {
      console.log("📤 Sending logout message to extension:", this.extensionId);

      // Send logout message to extension background script
      const response = await this.chromeAPI.runtime.sendMessage(
        this.extensionId,
        {
          type: "KNUGGET_LOGOUT",
          timestamp: new Date().toISOString(),
        }
      );

      console.log("✅ Extension responded to logout:", response);
      return true;
    } catch (error) {
      console.error("❌ Failed to sync logout to extension:", error);
      return false;
    }
  }

  /**
   * Start watching for extension availability and sync auth when found
   */
  private startExtensionWatcher(): void {
    if (typeof window === "undefined" || !this.chromeAPI) return;

    let lastExtensionAvailable = false;

    const checkAndSyncIfNeeded = async () => {
      try {
        const isAvailable = await this.isExtensionAvailable();

        // If extension just became available (newly installed)
        if (isAvailable && !lastExtensionAvailable) {
          console.log(
            "🔍 Extension detected! Checking for existing auth to sync..."
          );
          await this.doSyncExistingAuthIfNeeded();
        }

        lastExtensionAvailable = isAvailable;
      } catch (error) {
        console.log("Extension watcher error:", error);
        lastExtensionAvailable = false;
      }
    };

    // Check immediately
    checkAndSyncIfNeeded();

    // Check more frequently for the first minute (every 2 seconds)
    // then less frequently (every 10 seconds) to detect extension installation
    let checkCount = 0;
    const interval = setInterval(() => {
      checkAndSyncIfNeeded();
      checkCount++;

      // After 30 checks (60 seconds), reduce frequency
      if (checkCount === 30) {
        clearInterval(interval);
        // Continue checking every 10 seconds
        setInterval(checkAndSyncIfNeeded, 10000);
      }
    }, 2000);

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      clearInterval(interval);
    });
  }

  /**
   * Public method for extension to trigger auth sync
   */
  async syncExistingAuthIfNeeded(): Promise<void> {
    return this.doSyncExistingAuthIfNeeded();
  }

  /**
   * Check if user is already authenticated on website and sync to extension
   */
  private async doSyncExistingAuthIfNeeded(): Promise<void> {
    try {
      const localUser = this.getCurrentUser();
      const isLocalValid = localUser && this.isTokenValid();

      if (isLocalValid && localUser) {
        console.log("🔄 Found existing website auth, syncing to extension...");

        // Get the complete auth data from localStorage
        const accessToken = localStorage.getItem(
          AUTH_STORAGE_KEYS.ACCESS_TOKEN
        );
        const refreshToken = localStorage.getItem(
          AUTH_STORAGE_KEYS.REFRESH_TOKEN
        );
        const expiresAt = localStorage.getItem(AUTH_STORAGE_KEYS.EXPIRES_AT);

        console.log("🔍 Checking localStorage auth data:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasExpiresAt: !!expiresAt,
          accessToken: accessToken
            ? `${accessToken.substring(0, 10)}...`
            : null,
        });

        if (accessToken && refreshToken && expiresAt) {
          const authData: WebAuthData = {
            user: localUser,
            accessToken,
            refreshToken,
            expiresAt: parseInt(expiresAt, 10),
          };

          const success = await this.syncAuthSuccess(authData);
          if (success) {
            console.log("✅ Successfully synced existing auth to extension");

            // Dispatch event to notify other parts of the app
            window.dispatchEvent(
              new CustomEvent("extensionAuthSynced", {
                detail: { user: localUser, isAuthenticated: true },
              })
            );
          }
        } else {
          console.log(
            "❌ Missing auth tokens in localStorage, cannot sync to extension"
          );
        }
      }
    } catch (error) {
      console.error("❌ Failed to sync existing auth to extension:", error);
    }
  }

  /**
   * Initialize auth from extension on page load
   */
  async initializeFromExtension(): Promise<{
    user: User | null;
    isAuthenticated: boolean;
  }> {
    // First check localStorage (web pages can only access their own localStorage)
    const localUser = this.getCurrentUser();
    const isLocalValid = localUser && this.isTokenValid();

    if (isLocalValid) {
      return { user: localUser, isAuthenticated: true };
    }

    // If local auth is invalid, try to get auth from extension via message
    try {
      if (this.chromeAPI && this.extensionId) {
        const response = await this.chromeAPI.runtime.sendMessage(
          this.extensionId,
          {
            type: "KNUGGET_CHECK_AUTH",
            timestamp: new Date().toISOString(),
          }
        );

        if (response && response.isAuthenticated && response.user) {
          // Convert extension user format and store locally
          const user = this.convertExtensionUser(response.user);
          return { user, isAuthenticated: true };
        }
      }
    } catch (error) {
      console.log("ℹ️ Could not get auth from extension:", error);
    }

    return { user: null, isAuthenticated: false };
  }

  /**
   * Clear extension auth data (via message)
   */
  async clearExtensionAuth(): Promise<boolean> {
    if (!this.chromeAPI || !this.extensionId) return false;

    try {
      await this.chromeAPI.runtime.sendMessage(this.extensionId, {
        type: "KNUGGET_LOGOUT",
        timestamp: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("❌ Failed to clear extension auth:", error);
      return false;
    }
  }

  /**
   * Setup listeners for extension auth changes (via message events)
   */
  private setupListeners(): void {
    if (typeof window === "undefined" || !this.chromeAPI) return;

    // Listen for messages from extension (this is how extensions communicate with web pages)
    if (this.chromeAPI.runtime && this.chromeAPI.runtime.onMessage) {
      this.chromeAPI.runtime.onMessage.addListener(
        (message: any, sender: any, sendResponse: any) => {
          if (message.type === "KNUGGET_AUTH_CHANGED") {
            if (message.data?.isAuthenticated && message.data?.user) {
              // Extension logged in
              window.dispatchEvent(
                new CustomEvent("extensionAuthChange", {
                  detail: {
                    isAuthenticated: true,
                    user: this.convertExtensionUser(message.data.user),
                    timestamp: new Date().toISOString(),
                  },
                })
              );
            } else {
              // Extension logged out
              window.dispatchEvent(
                new CustomEvent("extensionAuthChange", {
                  detail: {
                    isAuthenticated: false,
                    user: null,
                    timestamp: new Date().toISOString(),
                  },
                })
              );
            }
            sendResponse({ received: true });
          }
        }
      );
    }
  }

  /**
   * Get current user from localStorage
   */
  private getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem("knugget_user_data");
    if (!userData) return null;

    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  }

  /**
   * Check if current token is valid
   */
  private isTokenValid(): boolean {
    const expiresAt = localStorage.getItem("knugget_expires_at");
    if (!expiresAt) return false;

    const expiry = parseInt(expiresAt);
    const now = Date.now();

    // Token is valid if it expires more than 5 minutes from now
    return expiry > now + 5 * 60 * 1000;
  }

  /**
   * Convert extension user format to web user format
   */
  private convertExtensionUser(extUser: any): User {
    return {
      id: extUser.id,
      email: extUser.email,
      name: extUser.name,
      avatar: null,
      plan: (extUser.plan?.toUpperCase() as "FREE" | "LITE" | "PRO") || "FREE",
      videosProcessedThisMonth: extUser.videosProcessedThisMonth || 0,
      videoResetDate: extUser.videoResetDate || null,
      inputTokensRemaining: extUser.inputTokensRemaining,
      outputTokensRemaining: extUser.outputTokensRemaining,
      tokenResetDate: extUser.tokenResetDate || null,
      subscriptionId: extUser.subscriptionId || null,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  }

  /**
   * Get extension ID from URL parameters
   */
  private getExtensionIdFromUrl(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("extensionId");
    } catch {
      return null;
    }
  }

  /**
   * Get stored extension ID from localStorage
   */
  private getStoredExtensionId(): string | null {
    if (typeof window === "undefined") return null;

    try {
      return localStorage.getItem("knugget_extension_id");
    } catch {
      return null;
    }
  }

  /**
   * Store extension ID in localStorage
   */
  private storeExtensionId(extensionId: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("knugget_extension_id", extensionId);
    } catch {
      // Ignore storage errors
    }
  }
}

// Export singleton instance
export const authSyncService = new AuthSyncService();

// Expose to window for extension communication
if (typeof window !== "undefined") {
  (window as any).authSyncService = authSyncService;
}
