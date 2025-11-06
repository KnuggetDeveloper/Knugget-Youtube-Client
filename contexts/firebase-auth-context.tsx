"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  AuthState,
  AuthAction,
  AuthContextType,
  UpdateProfileRequest,
  User,
} from "@/types/auth";
import { firebaseAuthService } from "@/lib/firebase-auth-service";
import { formatError } from "@/lib/utils";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "AUTH_CLEAR_ERROR":
      return { ...state, error: null };
    case "AUTH_UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    dispatch({ type: "AUTH_START" });

    // Listen for Firebase auth state changes
    const unsubscribe = firebaseAuthService.onAuthStateChanged(
      (user: User | null) => {
        if (user) {
          dispatch({ type: "AUTH_SUCCESS", payload: user });
        } else {
          dispatch({ type: "AUTH_LOGOUT" });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Login with email and password
  async function login(email: string, password: string) {
    try {
      dispatch({ type: "AUTH_START" });

      const result = await firebaseAuthService.signIn(email, password);

      if (result.success && result.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: result.user });

        // Trigger profile refresh to get correct plan/credits from backend
        window.dispatchEvent(new Event('creditsUpdated'));

        // Redirect to dashboard or intended page
        const returnUrl = new URLSearchParams(window.location.search).get(
          "returnUrl"
        );
        router.push(returnUrl || "/dashboard");
      } else {
        const errorMessage = result.error || "Login failed";
        dispatch({ type: "AUTH_ERROR", payload: errorMessage });
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = formatError(error);
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw error;
    }
  }

  // Signup with email and password
  async function signup(email: string, password: string, name?: string) {
    try {
      dispatch({ type: "AUTH_START" });

      const result = await firebaseAuthService.signUp(email, password, name);

      if (result.success && result.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: result.user });
        
        // Trigger profile refresh to get correct plan/credits from backend
        window.dispatchEvent(new Event('creditsUpdated'));
        
        router.push("/dashboard");
      } else {
        const errorMessage = result.error || "Signup failed";
        dispatch({ type: "AUTH_ERROR", payload: errorMessage });
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = formatError(error);
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw error;
    }
  }

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      dispatch({ type: "AUTH_START" });

      const result = await firebaseAuthService.signInWithGoogle();

      if (result.success && result.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: result.user });
        
        // Trigger profile refresh to get correct plan/credits from backend
        window.dispatchEvent(new Event('creditsUpdated'));
        
        router.push("/dashboard");
      } else {
        const errorMessage = result.error || "Google sign in failed";
        dispatch({ type: "AUTH_ERROR", payload: errorMessage });
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = formatError(error);
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw error;
    }
  }

  // Logout
  async function logout() {
    try {
      dispatch({ type: "AUTH_START" });

      const result = await firebaseAuthService.signOut();

      if (result.success) {
        dispatch({ type: "AUTH_LOGOUT" });
        router.push("/login");
      } else {
        console.error("Logout error:", result.error);
        // Force logout locally even if backend fails
        dispatch({ type: "AUTH_LOGOUT" });
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout locally even if there's an error
      dispatch({ type: "AUTH_LOGOUT" });
      router.push("/login");
    }
  }

  // Refresh auth (Firebase handles this automatically)
  const refreshAuth = useCallback(async () => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await firebaseAuthService.getCurrentUser();

      if (response.success && response.data) {
        dispatch({ type: "AUTH_SUCCESS", payload: response.data });
        console.log("✅ Auth refresh successful");
      } else {
        await handleAuthFailure("Session expired. Please sign in again.");
      }
    } catch (error) {
      console.error("❌ Failed to refresh auth:", error);
      await handleAuthFailure("Authentication error. Please sign in again.");
    }
  }, []);

  // Profile update
  async function updateProfile(data: UpdateProfileRequest) {
    try {
      dispatch({ type: "AUTH_UPDATE_USER", payload: data });
      console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("❌ Profile update failed:", error);
      if (state.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: state.user });
      }
      const errorMessage = formatError(error);
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw error;
    }
  }

  // Send password reset email
  async function forgotPassword(email: string) {
    try {
      const result = await firebaseAuthService.sendPasswordResetEmail(email);

      if (result.success) {
        return { success: true };
      } else {
        throw new Error(result.error || "Failed to send password reset email");
      }
    } catch (error) {
      const errorMessage = formatError(error);
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw error;
    }
  }

  // Handle authentication failures
  async function handleAuthFailure(errorMessage: string): Promise<void> {
    try {
      console.log("🔄 Handling auth failure:", errorMessage);
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    } catch (error) {
      console.error("❌ Error handling auth failure:", error);
      dispatch({ type: "AUTH_LOGOUT" });
    }
  }

  function clearError() {
    dispatch({ type: "AUTH_CLEAR_ERROR" });
  }

  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    signup,
    signInWithGoogle,
    logout,
    refreshAuth,
    clearError,
    updateProfile,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
