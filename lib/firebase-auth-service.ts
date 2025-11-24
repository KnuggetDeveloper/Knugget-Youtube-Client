/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";
import { User, ApiResponse } from "@/types/auth";

class FirebaseAuthService {
  private baseUrl: string;
  private connectorReady: boolean = false;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://knugget-youtube-backend.onrender.com/api";

    // Listen for connector ready message
    if (typeof window !== "undefined") {
      this.setupConnectorListener();
    }
  }

  // Setup listener for extension connector
  private setupConnectorListener(): void {
    window.addEventListener("message", (event) => {
      if (
        event.data?.target === "KNUGGET_WEBPAGE" &&
        event.data?.type === "CONNECTOR_READY"
      ) {
        this.connectorReady = true;
        const extensionId = event.data.extensionId;
        if (extensionId) {
          localStorage.setItem("knugget_extension_id", extensionId);
          console.log("✅ Extension connector ready, ID stored:", extensionId);
        }
      }
    });
  }

  // Sign in with email and password
  async signIn(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Get ID token and sync with backend
      const idToken = await firebaseUser.getIdToken();
      const backendUser = await this.syncWithBackend(idToken);

      if (backendUser) {
        return { success: true, user: backendUser };
      } else {
        throw new Error("Failed to sync with backend");
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Sign in failed",
      };
    }
  }

  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    name?: string
  ): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Update display name if provided
      if (name) {
        await updateProfile(firebaseUser, { displayName: name });
      }

      // Get ID token and sync with backend
      const idToken = await firebaseUser.getIdToken();
      const backendUser = await this.syncWithBackend(idToken);

      if (backendUser) {
        return { success: true, user: backendUser };
      } else {
        throw new Error("Failed to sync with backend");
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Sign up failed",
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Get ID token and sync with backend with retry logic
      const idToken = await firebaseUser.getIdToken();
      let backendUser = await this.syncWithBackend(idToken);

      // If first sync fails, retry once after a short delay
      if (!backendUser) {
        console.log("First backend sync failed, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        backendUser = await this.syncWithBackend(idToken);
      }

      if (backendUser) {
        return { success: true, user: backendUser };
      } else {
        // Even if backend sync fails, Firebase auth succeeded
        // Return a basic user object from Firebase data
        const basicUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          avatar: firebaseUser.photoURL || "",
          plan: "FREE",
          subscriptionId: null,
          emailVerified: firebaseUser.emailVerified,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          videosProcessedThisMonth: 0,
          videoResetDate: null,
          inputTokensRemaining: 150000, // FREE plan defaults
          outputTokensRemaining: 10000,
          tokenResetDate: null,
        };

        console.warn("Backend sync failed, using Firebase user data");
        return { success: true, user: basicUser };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Google sign in failed",
      };
    }
  }

  // Sign out
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Notify backend about logout (optional, non-blocking)
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          await fetch(`${this.baseUrl}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          });
        }
      } catch (error) {
        console.warn("Backend logout failed:", error);
      }

      // Notify extension about logout
      await this.notifyExtensionLogout();

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Sign out failed",
      };
    }
  }

  // Notify extension about logout
  private async notifyExtensionLogout(): Promise<void> {
    try {
      if (typeof window === "undefined") {
        return;
      }

      console.log("🚪 Notifying extension about logout...");

      // Method 1: Try direct Chrome API
      if (typeof chrome !== "undefined" && chrome.runtime) {
        const extensionId = localStorage.getItem("knugget_extension_id");
        if (extensionId) {
          try {
            await chrome.runtime.sendMessage(extensionId, {
              type: "KNUGGET_LOGOUT",
              timestamp: new Date().toISOString(),
            });
            console.log("✅ Logout notified via Chrome API");
            return;
          } catch {
            console.log("ℹ️ Chrome API failed, trying postMessage...");
          }
        }
      }

      // Method 2: Use postMessage to content script
      window.postMessage(
        {
          target: "KNUGGET_EXTENSION",
          type: "LOGOUT",
        },
        "*"
      );
      console.log("✅ Logout notification posted to content script");
    } catch (error) {
      console.error("❌ Failed to notify extension about logout:", error);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to send password reset email",
      };
    }
  }

  // Sync Firebase user with backend AND extension
  private async syncWithBackend(idToken: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.data;

        // Sync with extension after backend sync succeeds
        if (user && idToken) {
          await this.syncWithExtension(idToken, user);
        }

        return user;
      } else {
        console.error("Backend sync failed:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Backend sync error:", error);
      return null;
    }
  }

  // Sync Firebase ID token with Chrome extension
  private async syncWithExtension(idToken: string, user: User): Promise<void> {
    try {
      // Check if Chrome extension API is available
      if (typeof window === "undefined") {
        console.log("ℹ️ Window not available (SSR)");
        return;
      }

      // Get Firebase user for token expiration
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        console.log("❌ No Firebase user available");
        return;
      }

      // Firebase ID tokens expire after 1 hour
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

      const authData = {
        accessToken: idToken, // Use Firebase ID token as access token
        refreshToken: idToken, // Extension will refresh by calling Firebase getIdToken(true)
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          credits: user.inputTokensRemaining || 0,
          plan: user.plan,
        },
        expiresAt,
      };

      console.log("🔄 Syncing auth to extension...", {
        userEmail: user.email,
        expiresAt: new Date(expiresAt).toISOString(),
      });

      // Method 1: Try direct Chrome API (if available)
      if (typeof chrome !== "undefined" && chrome.runtime) {
        const extensionId = localStorage.getItem("knugget_extension_id");
        if (extensionId) {
          try {
            await chrome.runtime.sendMessage(extensionId, {
              type: "KNUGGET_AUTH_SUCCESS",
              payload: authData,
            });
            console.log("✅ Auth synced via Chrome API");
            return; // Success, no need to try other methods
          } catch (error) {
            console.log("ℹ️ Chrome API failed, trying postMessage...", error);
          }
        }
      }

      // Method 2: Use postMessage to content script (more reliable)
      window.postMessage(
        {
          target: "KNUGGET_EXTENSION",
          type: "SYNC_AUTH",
          payload: authData,
        },
        "*"
      );
      console.log("✅ Auth sync message posted to content script");

      // Wait for confirmation (with timeout)
      const syncConfirmed = await this.waitForSyncConfirmation();
      if (syncConfirmed) {
        console.log("✅ Auth sync confirmed by extension");
      } else {
        console.log(
          "⚠️ Auth sync not confirmed (extension may not be installed)"
        );
      }
    } catch (error) {
      console.error("❌ Failed to sync with extension:", error);
    }
  }

  // Wait for sync confirmation from content script
  private async waitForSyncConfirmation(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        window.removeEventListener("message", handler);
        resolve(false);
      }, 2000); // 2 second timeout

      const handler = (event: MessageEvent) => {
        if (
          event.data?.target === "KNUGGET_WEBPAGE" &&
          event.data?.type === "AUTH_SYNC_COMPLETE"
        ) {
          clearTimeout(timeout);
          window.removeEventListener("message", handler);
          resolve(true);
        }
      };

      window.addEventListener("message", handler);
    });
  }

  // Get current user from backend
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: "No authenticated user" };
      }

      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data.data };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || "Failed to get current user",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Network error",
      };
    }
  }

  // Make authenticated API requests
  async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: "User not authenticated" };
      }

      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data.data || data };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error:
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Network error",
      };
    }
  }

  // Listen for auth state changes and setup token refresh
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Use Firebase user data directly instead of backend sync
            // Backend sync already happened during login, no need to do it again
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "",
              avatar: firebaseUser.photoURL || "",
              plan: "FREE", // Will be updated by backend sync if premium
              subscriptionId: null,
              emailVerified: firebaseUser.emailVerified,
              createdAt:
                firebaseUser.metadata.creationTime || new Date().toISOString(),
              lastLoginAt:
                firebaseUser.metadata.lastSignInTime ||
                new Date().toISOString(),
              videosProcessedThisMonth: 0,
              videoResetDate: null,
              inputTokensRemaining: 150000, // FREE plan defaults
              outputTokensRemaining: 10000,
              tokenResetDate: null,
            };

            console.log(
              "✅ Auth state changed - Using Firebase user data (no backend sync)"
            );

            // Start periodic token refresh to extension
            this.startTokenRefreshInterval(firebaseUser, user);

            callback(user);
          } catch (error) {
            console.error("Auth state change error:", error);
            callback(null);
          }
        } else {
          // Stop token refresh when user logs out
          this.stopTokenRefreshInterval();
          callback(null);
        }
      }
    );
  }

  private tokenRefreshInterval: NodeJS.Timeout | null = null;

  // Periodically refresh and sync Firebase ID token to extension
  private startTokenRefreshInterval(firebaseUser: FirebaseUser, user: User) {
    // Clear any existing interval
    this.stopTokenRefreshInterval();

    // Sync immediately
    this.refreshAndSyncToken(firebaseUser, user);

    // Then sync every 45 minutes (before 1-hour expiration)
    this.tokenRefreshInterval = setInterval(
      () => {
        this.refreshAndSyncToken(firebaseUser, user);
      },
      45 * 60 * 1000
    ); // 45 minutes

    console.log("🔄 Started token refresh interval (every 45 minutes)");
  }

  private stopTokenRefreshInterval() {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
      console.log("⏹️ Stopped token refresh interval");
    }
  }

  // Get fresh Firebase ID token and sync to extension
  private async refreshAndSyncToken(firebaseUser: FirebaseUser, user: User) {
    try {
      console.log("🔄 Refreshing Firebase ID token...");

      // Force refresh to get a new token
      const freshToken = await firebaseUser.getIdToken(true);

      console.log("✅ Got fresh Firebase ID token");

      // Sync to extension
      await this.syncWithExtension(freshToken, user);

      console.log("✅ Fresh token synced to extension successfully");
    } catch (error) {
      console.error("❌ Failed to refresh and sync token:", error);
    }
  }

  // Get current Firebase user
  getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }
}

export default FirebaseAuthService;
export const firebaseAuthService = new FirebaseAuthService();
