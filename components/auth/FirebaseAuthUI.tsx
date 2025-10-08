/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from "react";
import * as firebaseui from "firebaseui";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { AdditionalUserInfo } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Import FirebaseUI CSS
import "firebaseui/dist/firebaseui.css";

interface FirebaseAuthUIProps {
  onSignInSuccess?: (user: User) => void;
  signInOptions?: string[];
  signInFlow?: "popup" | "redirect";
}

const FirebaseAuthUI: React.FC<FirebaseAuthUIProps> = ({
  onSignInSuccess,
  signInOptions = [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
  signInFlow = "popup",
}) => {
  useEffect(() => {
    const uiConfig = {
      signInFlow,
      signInOptions,
      callbacks: {
        signInSuccessWithAuthResult: (
          authResult: {
            user: User;
            credential?: Credential;
            additionalUserInfo?: AdditionalUserInfo;
          },
          redirectUrl?: string
        ) => {
          if (onSignInSuccess) {
            onSignInSuccess(authResult.user);
          }
          return false;
        },
        uiShown: () => {
          // The widget is rendered
          const loader = document.getElementById("firebaseui-auth-loader");
          if (loader) {
            loader.style.display = "none";
          }
        },
      },
      // Terms of service and privacy policy URLs
      tosUrl: "/terms",
      privacyPolicyUrl: "/privacy",
    };

    // Get or create the FirebaseUI instance
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    // Start the UI
    ui.start("#firebaseui-auth-container", uiConfig);

    // Cleanup function
    return () => {
      ui.reset();
    };
  }, [onSignInSuccess, signInOptions, signInFlow]);

  return (
    <div>
      <div id="firebaseui-auth-loader" className="text-center py-4">
        Loading...
      </div>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default FirebaseAuthUI;
