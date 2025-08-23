// import "./App.css";
import React, { useEffect, useState } from "react";
import {
  ClerkProvider,
  useAuth,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { AutumnProvider } from "autumn-js/react";
import { ConvexCustomerSection } from "./components/ConvexCustomerSection";
import { DebugConsole } from "./components/DebugConsole";
import { api } from "../convex/_generated/api";

const address = import.meta.env.VITE_CONVEX_URL || "";
const convex = new ConvexReactClient(address);

// Get Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function AutumnWrapper({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <h2 className="text-center py-8 pb-4 text-2xl font-semibold text-white">
          Loading authentication...
        </h2>
      </div>
    );
  }

  return (
    <AutumnProvider
      convexApi={api.autumn}
      convexUrl={import.meta.env.VITE_CONVEX_URL}
      getBearerToken={async () => {
        try {
          return await getToken({
            template: "convex",
          }) || "";
        } catch (error) {
          console.error("Failed to get fresh token:", error);
          return "";
        }
      }}
    >
      {children}
    </AutumnProvider>
  );
}

function AppContent() {
  return (
    <div className="bg-gray-900 text-white min-h-screen w-screen overflow-x-hidden">
      <AutumnWrapper>
        <AuthLoading>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <h2 className="text-center py-8 pb-4 text-2xl font-semibold text-white">
              Loading...
            </h2>
          </div>
        </AuthLoading>

        <Unauthenticated>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <h2 className="text-center py-8 pb-4 text-2xl font-semibold text-white">
              Convex Autumn Component Example with Clerk
            </h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-center text-lg font-medium text-gray-200 mb-6">
                Sign in to get started
              </h3>
              <div className="flex flex-col gap-3">
                <SignInButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Sign in with Clerk
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </Unauthenticated>

        <Authenticated>
          <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 w-screen overflow-hidden">
            {/* Header with user button */}
            <div className="absolute top-4 right-4 z-10">
              <UserButton afterSignOutUrl="/" />
            </div>

            <div className="flex-1 flex h-full overflow-hidden">
              <div className="flex-1 flex flex-col justify-center items-center p-8 overflow-y-auto min-w-0">
                <div className="w-full max-w-lg">
                  <h2 className="text-center text-2xl font-bold text-white mb-8">
                    Autumn with Convex & Clerk
                  </h2>
                  <ConvexCustomerSection />
                </div>
              </div>

              <div className="border-l border-gray-700/50 w-1/2 h-full min-w-0">
                <DebugConsole />
              </div>
            </div>
          </div>
        </Authenticated>
      </AutumnWrapper>
    </div>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <AppContent />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default App;
