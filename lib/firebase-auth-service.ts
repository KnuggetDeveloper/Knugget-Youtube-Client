/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";
import { User, ApiResponse } from "@/types/auth";

class FirebaseAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://knugget-youtube-backend.onrender.com/api";
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

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Sign out failed",
      };
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

  // Sync Firebase user with backend
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
        return data.data;
      } else {
        console.error("Backend sync failed:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Backend sync error:", error);
      return null;
    }
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

  // Listen for auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const idToken = await firebaseUser.getIdToken();
            const backendUser = await this.syncWithBackend(idToken);
            callback(backendUser);
          } catch (error) {
            console.error("Auth state change error:", error);
            callback(null);
          }
        } else {
          callback(null);
        }
      }
    );
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
