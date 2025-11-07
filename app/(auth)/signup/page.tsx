"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/firebase-auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignup } from "@/hooks/use-auth-form";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { Suspense } from "react";
import Image from "next/image";

// Form validation schema
const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { signup, isLoading, error, clearError } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get return URL and source from query params
  const returnUrl = searchParams.get("returnUrl");
  const source = searchParams.get("source");
  const isFromExtension = source === "extension";

  // Form setup
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password for strength indicator
  const password = form.watch("password");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(returnUrl || "/dashboard");
    }
  }, [isAuthenticated, authLoading, router, returnUrl]);

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error, clearError]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.email, data.password, data.name);
      // Navigation is handled by the auth context
    } catch (err) {
      // Error is handled by the useSignup hook
      console.error("Signup error:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach((check) => {
      if (check) strength++;
    });

    return { strength, checks };
  };

  const passwordStrength = getPasswordStrength(password || "");

  // Show loading spinner if checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Knugget Logo"
              width={20}
              height={20}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-white">Knugget</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="#"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              EN
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-4">
        <div className="w-full max-w-md mx-auto">
          <div
            className="rounded-2xl shadow-2xl p-8 lg:p-12"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333" }}
          >
            {/* Signup Card */}
            <div className="w-full">
              {/* Back to website link for extension users */}
              {isFromExtension && (
                <Link
                  href="/"
                  className="inline-flex items-center text-sm hover:text-white transition-colors mb-6"
                  style={{ color: "#cccccc" }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to website
                </Link>
              )}

              <div>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2 knugget-gradient-text">
                    Create your Knugget account
                  </h1>
                  <p style={{ color: "#cccccc" }}>
                    {isFromExtension ? (
                      <>
                        Sign up to sync your account with the Chrome extension
                        <div
                          className="flex items-center justify-center mt-2"
                          style={{ color: "#ff6b35" }}
                        >
                          <Chrome className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">
                            Chrome Extension Signup
                          </span>
                        </div>
                      </>
                    ) : (
                      "Start generating AI-powered summaries in seconds"
                    )}
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Signup Form */}
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Name Field */}
                    <FormItem>
                      <FormLabel
                        htmlFor="name"
                        className="font-medium"
                        style={{ color: "#cccccc" }}
                      >
                        Full name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                            style={{ color: "#888888" }}
                          />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            style={{
                              backgroundColor: "#111111",
                              border: "1px solid #333333",
                              color: "#ffffff",
                            }}
                            {...form.register("name")}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-sm"
                        style={{ color: "#ff4444" }}
                      >
                        {form.formState.errors.name?.message}
                      </FormMessage>
                    </FormItem>

                    {/* Email Field */}
                    <FormItem>
                      <FormLabel
                        htmlFor="email"
                        className="font-medium"
                        style={{ color: "#cccccc" }}
                      >
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                            style={{ color: "#888888" }}
                          />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            style={{
                              backgroundColor: "#111111",
                              border: "1px solid #333333",
                              color: "#ffffff",
                            }}
                            {...form.register("email")}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-sm"
                        style={{ color: "#ff4444" }}
                      >
                        {form.formState.errors.email?.message}
                      </FormMessage>
                    </FormItem>

                    {/* Password Field */}
                    <FormItem>
                      <FormLabel
                        htmlFor="password"
                        className="font-medium"
                        style={{ color: "#cccccc" }}
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                            style={{ color: "#888888" }}
                          />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            style={{
                              backgroundColor: "#111111",
                              border: "1px solid #333333",
                              color: "#ffffff",
                            }}
                            {...form.register("password")}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-orange-500 transition-colors"
                            style={{ color: "#888888" }}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-sm"
                        style={{ color: "#ff4444" }}
                      >
                        {form.formState.errors.password?.message}
                      </FormMessage>

                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="mt-2 space-y-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  passwordStrength.strength >= level
                                    ? passwordStrength.strength < 3
                                      ? "bg-red-500"
                                      : passwordStrength.strength < 4
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    : "bg-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center space-x-2">
                              <CheckCircle
                                className={`h-3 w-3 ${passwordStrength.checks.length ? "text-green-400" : "text-gray-500"}`}
                              />
                              <span
                                className={
                                  passwordStrength.checks.length
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                At least 8 characters
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle
                                className={`h-3 w-3 ${passwordStrength.checks.lowercase ? "text-green-400" : "text-gray-500"}`}
                              />
                              <span
                                className={
                                  passwordStrength.checks.lowercase
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                One lowercase letter
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle
                                className={`h-3 w-3 ${passwordStrength.checks.uppercase ? "text-green-400" : "text-gray-500"}`}
                              />
                              <span
                                className={
                                  passwordStrength.checks.uppercase
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                One uppercase letter
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle
                                className={`h-3 w-3 ${passwordStrength.checks.number ? "text-green-400" : "text-gray-500"}`}
                              />
                              <span
                                className={
                                  passwordStrength.checks.number
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }
                              >
                                One number
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </FormItem>

                    {/* Confirm Password Field */}
                    <FormItem>
                      <FormLabel
                        htmlFor="confirmPassword"
                        className="font-medium"
                        style={{ color: "#cccccc" }}
                      >
                        Confirm password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                            style={{ color: "#888888" }}
                          />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            style={{
                              backgroundColor: "#111111",
                              border: "1px solid #333333",
                              color: "#ffffff",
                            }}
                            {...form.register("confirmPassword")}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-orange-500 transition-colors"
                            style={{ color: "#888888" }}
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-sm"
                        style={{ color: "#ff4444" }}
                      >
                        {form.formState.errors.confirmPassword?.message}
                      </FormMessage>
                    </FormItem>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:opacity-90"
                      style={{
                        background:
                          "linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%)",
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span
                          className="w-full border-t"
                          style={{ borderColor: "#333333" }}
                        />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span
                          className="px-2"
                          style={{
                            backgroundColor: "#1a1a1a",
                            color: "#888888",
                          }}
                        >
                          Or
                        </span>
                      </div>
                    </div>

                    {/* Google Sign-In */}
                    <GoogleSignInButton
                      text="Sign up with Google"
                      className="w-full bg-white text-black hover:opacity-90 py-3 px-4 rounded-lg font-medium transition-colors border-none"
                      disabled={isLoading}
                    />
                  </form>
                </FormProvider>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <span style={{ color: "#cccccc" }}>
                    Already have an account?{" "}
                  </span>
                  <Link
                    href={`/login${isFromExtension ? "?source=extension" : ""}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                    className="font-medium hover:underline transition-colors"
                    style={{ color: "#ff6b35" }}
                  >
                    Sign in here
                  </Link>
                </div>

                {/* Extension Benefits */}
                {isFromExtension && (
                  <div
                    className="mt-4 p-4 rounded-lg border"
                    style={{
                      backgroundColor: "rgba(255, 107, 53, 0.1)",
                      borderColor: "rgba(255, 107, 53, 0.2)",
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <Chrome
                        className="h-5 w-5 mt-0.5 flex-shrink-0"
                        style={{ color: "#ff6b35" }}
                      />
                      <div className="space-y-2">
                        <h4
                          className="text-sm font-medium"
                          style={{ color: "#ff6b35" }}
                        >
                          Chrome Extension Benefits
                        </h4>
                        <ul
                          className="text-xs space-y-1"
                          style={{ color: "#cccccc" }}
                        >
                          <li>• Generate summaries directly on YouTube</li>
                          <li>• Sync across all your devices</li>
                          <li>• Access your saved summaries anywhere</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="mt-8 text-center text-xs"
            style={{ color: "#888888" }}
          >
            <p>
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="underline hover:text-white transition-colors"
                style={{ color: "#ff6b35" }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-white transition-colors"
                style={{ color: "#ff6b35" }}
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}
