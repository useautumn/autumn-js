import React from "react";
import { authClient } from "../lib/auth-client";

export function BetterAuthSignIn() {
  const onGoogleSignIn = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
      });
      if (error) {
        console.error("Google sign in failed:", error);
        return;
      }
      // Reload to re-evaluate auth gates
    //   window.location.reload();
    } catch (err) {
      console.error("Unexpected error during Google sign in:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h2 className="text-center py-8 pb-4 text-2xl font-semibold text-white">
        Convex Autumn Component Example with Better Auth
      </h2>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl p-8 max-w-md w-full mx-4">
        <h3 className="text-center text-lg font-medium text-gray-200 mb-6">
          Sign in to get started
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={onGoogleSignIn}
            className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
