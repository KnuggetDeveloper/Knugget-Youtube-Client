"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Clock, Zap } from "lucide-react";
import { tokenService, TokenStatus } from "@/lib/token-service";
import { useAuth } from "@/contexts/firebase-auth-context";
import { Skeleton } from "@/components/ui/skeleton";

interface TokenUsageDisplayProps {
  className?: string;
  showRefresh?: boolean;
  compact?: boolean;
}

export function TokenUsageDisplay({
  className = "",
  showRefresh = true,
  compact = false,
}: TokenUsageDisplayProps) {
  const { user } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenStatus = async (showLoadingState = true) => {
    if (showLoadingState) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    try {
      const response = await tokenService.getTokenStatus();

      if (response.success && response.data) {
        setTokenStatus(response.data);
      } else {
        setError(response.error || "Failed to fetch token status");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.plan === "PREMIUM") {
      fetchTokenStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Don't show for free users
  if (!user || user.plan !== "PREMIUM") {
    return null;
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
          {showRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTokenStatus()}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!tokenStatus) {
    return null;
  }

  const inputTotal = 9000000; // 9M tokens
  const outputTotal = 600000; // 600K tokens

  const inputUsagePercentage = tokenService.calculateUsagePercentage(
    tokenStatus.inputTokensRemaining,
    inputTotal
  );
  const outputUsagePercentage = tokenService.calculateUsagePercentage(
    tokenStatus.outputTokensRemaining,
    outputTotal
  );

  const inputRemainingPercentage = 100 - inputUsagePercentage;
  const outputRemainingPercentage = 100 - outputUsagePercentage;

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Tokens</span>
          {tokenStatus.isTokensExhausted && (
            <Badge variant="destructive" className="text-xs">
              Exhausted
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Input</span>
            <span
              className={tokenService.getTokenStatusColor(
                tokenStatus.inputTokensRemaining,
                inputTotal
              )}
            >
              {tokenService.formatTokenCount(tokenStatus.inputTokensRemaining)}
            </span>
          </div>
          <Progress value={inputRemainingPercentage} className="h-1" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Output</span>
            <span
              className={tokenService.getTokenStatusColor(
                tokenStatus.outputTokensRemaining,
                outputTotal
              )}
            >
              {tokenService.formatTokenCount(tokenStatus.outputTokensRemaining)}
            </span>
          </div>
          <Progress value={outputRemainingPercentage} className="h-1" />
        </div>

        {tokenStatus.tokenResetDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Resets {tokenService.formatResetDate(tokenStatus.tokenResetDate)}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Token Usage
          </CardTitle>
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchTokenStatus(false)}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {tokenStatus.isTokensExhausted && (
          <div className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-950 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">
              Token limit exceeded
            </span>
          </div>
        )}

        {/* Input Tokens */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Input Tokens</span>
            <div className="text-right">
              <div
                className={`text-sm font-medium ${tokenService.getTokenStatusColor(tokenStatus.inputTokensRemaining, inputTotal)}`}
              >
                {tokenService.formatTokenCount(
                  tokenStatus.inputTokensRemaining
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                of {tokenService.formatTokenCount(inputTotal)}
              </div>
            </div>
          </div>
          <Progress value={inputRemainingPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {inputUsagePercentage}% used
          </div>
        </div>

        {/* Output Tokens */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Output Tokens</span>
            <div className="text-right">
              <div
                className={`text-sm font-medium ${tokenService.getTokenStatusColor(tokenStatus.outputTokensRemaining, outputTotal)}`}
              >
                {tokenService.formatTokenCount(
                  tokenStatus.outputTokensRemaining
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                of {tokenService.formatTokenCount(outputTotal)}
              </div>
            </div>
          </div>
          <Progress value={outputRemainingPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {outputUsagePercentage}% used
          </div>
        </div>

        {/* Reset Date */}
        {tokenStatus.tokenResetDate && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">Next Reset</span>
            <div className="flex items-center text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {tokenService.formatResetDate(tokenStatus.tokenResetDate)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
