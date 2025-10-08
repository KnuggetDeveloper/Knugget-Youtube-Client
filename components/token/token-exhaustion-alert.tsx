"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Zap } from "lucide-react";
import { tokenService } from "@/lib/token-service";

interface TokenExhaustionAlertProps {
  tokenResetDate?: string | null;
  onUpgrade?: () => void;
  className?: string;
}

export function TokenExhaustionAlert({
  tokenResetDate,
  onUpgrade,
  className = "",
}: TokenExhaustionAlertProps) {
  const resetDateFormatted = tokenService.formatResetDate(
    tokenResetDate || null
  );

  return (
    <Alert
      className={`border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 ${className}`}
    >
      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="text-red-800 dark:text-red-200">
        <div className="space-y-3">
          <div>
            <p className="font-medium">Token limit exceeded</p>
            <p className="text-sm mt-1">
              You&apos;ve used all your available tokens for this billing cycle.
            </p>
          </div>

          {tokenResetDate && (
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1" />
              <span>Tokens will reset {resetDateFormatted}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {onUpgrade && (
              <Button
                onClick={onUpgrade}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Zap className="h-3 w-3 mr-1" />
                Contact Support
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
            >
              Refresh Status
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface InsufficientTokensAlertProps {
  required: {
    input: number;
    output: number;
  };
  available: {
    input: number;
    output: number;
  };
  tokenResetDate?: string | null;
  onUpgrade?: () => void;
  className?: string;
}

export function InsufficientTokensAlert({
  required,
  available,
  tokenResetDate,
  onUpgrade,
  className = "",
}: InsufficientTokensAlertProps) {
  const resetDateFormatted = tokenService.formatResetDate(
    tokenResetDate || null
  );

  return (
    <Alert
      className={`border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 ${className}`}
    >
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
        <div className="space-y-3">
          <div>
            <p className="font-medium">Insufficient tokens</p>
            <p className="text-sm mt-1">
              This operation requires more tokens than you have available.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Required:</p>
              <p>{tokenService.formatTokenCount(required.input)} input</p>
              <p>{tokenService.formatTokenCount(required.output)} output</p>
            </div>
            <div>
              <p className="font-medium">Available:</p>
              <p
                className={
                  available.input < required.input
                    ? "text-red-600 dark:text-red-400"
                    : ""
                }
              >
                {tokenService.formatTokenCount(available.input)} input
              </p>
              <p
                className={
                  available.output < required.output
                    ? "text-red-600 dark:text-red-400"
                    : ""
                }
              >
                {tokenService.formatTokenCount(available.output)} output
              </p>
            </div>
          </div>

          {tokenResetDate && (
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1" />
              <span>Tokens will reset {resetDateFormatted}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {onUpgrade && (
              <Button
                onClick={onUpgrade}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Zap className="h-3 w-3 mr-1" />
                Contact Support
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900"
            >
              Refresh Status
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
