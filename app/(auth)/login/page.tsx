/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/firebase-auth-context";
import { useLogin } from "@/hooks/use-auth-form";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import Image from "next/image";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { login, isLoading, error, clearError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const returnUrl = searchParams.get("returnUrl");
  const source = searchParams.get("source");
  const isFromExtension = source === "extension";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(returnUrl || "/dashboard");
    }
  }, [isAuthenticated, authLoading, router, returnUrl]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
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
              width={40}
              height={40}
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

      {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce"
          style={{ animationDelay: "0s" }}
        >
          🔬
        </div>
        <div
          className="absolute top-32 right-20 text-3xl opacity-20 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          👍
        </div>
        <div
          className="absolute top-60 left-1/4 text-5xl opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          📹
        </div>
        <div
          className="absolute bottom-40 right-10 text-4xl opacity-20 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        >
          🎤
        </div>
        <div
          className="absolute bottom-20 left-20 text-3xl opacity-20 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          🧠
        </div>
        <div
          className="absolute top-1/2 right-1/4 text-4xl opacity-20 animate-bounce"
          style={{ animationDelay: "2.5s" }}
        >
          🚀
        </div>
        <div
          className="absolute bottom-60 left-1/3 text-3xl opacity-20 animate-bounce"
          style={{ animationDelay: "3s" }}
        >
          👤
        </div>
        <div
          className="absolute top-40 right-1/3 text-4xl opacity-20 animate-bounce"
          style={{ animationDelay: "3.5s" }}
        >
          ⭐
        </div>
        <div
          className="absolute bottom-32 right-1/2 text-5xl opacity-20 animate-bounce"
          style={{ animationDelay: "4s" }}
        >
          🦄
        </div>
        <div
          className="absolute top-80 left-1/2 text-3xl opacity-20 animate-bounce"
          style={{ animationDelay: "4.5s" }}
        >
          ⚔️
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-4">
        <div
          className="flex max-w-6xl w-full bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: "#1a1a1a", borderColor: "#333333" }}
        >
          {/* Login Card */}
          <div className="flex-1 p-8 lg:p-12">
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

            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 knugget-gradient-text">
                  Welcome Back!
                </h1>
                <p style={{ color: "#cccccc" }}>
                  {isFromExtension
                    ? "Sign in to sync your account with the Chrome extension"
                    : "Sign in to continue summarizing videos"}
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Google Sign In */}
                  <GoogleSignInButton
                    text="Sign in with Google"
                    className="w-full bg-white text-black hover:opacity-90 py-3 px-4 rounded-lg font-medium transition-colors border-none"
                    disabled={isLoading}
                  />

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span
                        className="w-full border-t"
                        style={{ borderColor: "#333333" }}
                      />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span
                        className="px-4"
                        style={{ backgroundColor: "#1a1a1a", color: "#888888" }}
                      >
                        or
                      </span>
                    </div>
                  </div>

                  {/* Email Input */}
                  <FormItem>
                    <FormLabel
                      htmlFor="email"
                      className="font-medium"
                      style={{ color: "#cccccc" }}
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        style={{
                          backgroundColor: "#111111",
                          border: "1px solid #333333",
                          color: "#ffffff",
                        }}
                        {...form.register("email")}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-sm"
                      style={{ color: "#ff4444" }}
                    >
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  </FormItem>

                  {/* Password Input */}
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
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 pr-12 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          style={{
                            backgroundColor: "#111111",
                            border: "1px solid #333333",
                            color: "#ffffff",
                          }}
                          autoComplete="current-password"
                          {...form.register("password")}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-orange-500 transition-colors"
                          style={{ color: "#888888" }}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
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
                  </FormItem>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded"
                        style={{ accentColor: "#ff6b35" }}
                      />
                      <span
                        className="ml-2 text-sm"
                        style={{ color: "#cccccc" }}
                      >
                        Remember me
                      </span>
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm hover:underline transition-colors"
                      style={{ color: "#ff6b35" }}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
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
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <span style={{ color: "#cccccc" }}>
                      Don&apos;t have an account?{" "}
                    </span>
                    <Link
                      href={`/signup${isFromExtension ? "?source=extension" : ""}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                      className="font-medium hover:underline transition-colors"
                      style={{ color: "#ff6b35" }}
                    >
                      Sign up now
                    </Link>
                  </div>
                </form>
              </FormProvider>

              {/* Features List */}
              <div
                className="mt-8 space-y-4 pt-8 border-t"
                style={{ borderColor: "#333333" }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚡</span>
                  <span style={{ color: "#cccccc" }}>Instant AI Summaries</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <span style={{ color: "#cccccc" }}>Access Anywhere</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <span style={{ color: "#cccccc" }}>Save Time & Focus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div
            className="hidden lg:flex lg:flex-1 p-12 items-center"
            style={{
              backgroundColor: "#1a1a1a",
              borderLeft: "1px solid #333333",
            }}
          >
            <div className="max-w-md">
              <div className="text-6xl mb-6 text-center animate-pulse">🚀</div>
              <h2 className="text-3xl font-bold mb-4 text-white text-center">
                Start Your Journey
              </h2>
              <p
                className="mb-8 text-lg leading-relaxed text-center"
                style={{ color: "#cccccc" }}
              >
                Join{" "}
                <span className="font-bold knugget-gradient-text">
                  500,000+
                </span>{" "}
                users who are saving time and getting insights instantly from
                YouTube videos.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div
                  className="text-center p-4 rounded-lg border hover:border-orange-500 transition-colors"
                  style={{ backgroundColor: "#111111", borderColor: "#333333" }}
                >
                  <div className="text-xl font-bold knugget-gradient-text">
                    500K+
                  </div>
                  <div className="text-xs" style={{ color: "#888888" }}>
                    Active Users
                  </div>
                </div>
                <div
                  className="text-center p-4 rounded-lg border hover:border-orange-500 transition-colors"
                  style={{ backgroundColor: "#111111", borderColor: "#333333" }}
                >
                  <div className="text-xl font-bold knugget-gradient-text">
                    10M+
                  </div>
                  <div className="text-xs" style={{ color: "#888888" }}>
                    Videos Summarized
                  </div>
                </div>
                <div
                  className="text-center p-4 rounded-lg border hover:border-orange-500 transition-colors"
                  style={{ backgroundColor: "#111111", borderColor: "#333333" }}
                >
                  <div className="text-xl font-bold knugget-gradient-text">
                    4.9★
                  </div>
                  <div className="text-xs" style={{ color: "#888888" }}>
                    User Rating
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div
                className="rounded-lg p-6 border relative"
                style={{ backgroundColor: "#111111", borderColor: "#333333" }}
              >
                <div
                  className="absolute top-2 left-4 text-3xl opacity-30"
                  style={{ color: "#ff6b35" }}
                >
                  &quot;
                </div>
                <div className="mb-3 italic" style={{ color: "#cccccc" }}>
                  Knugget has transformed how I learn online. I can now consume
                  hours of content in minutes!
                </div>
                <div
                  className="text-sm text-right"
                  style={{ color: "#888888" }}
                >
                  — Sarah K., Content Creator
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
