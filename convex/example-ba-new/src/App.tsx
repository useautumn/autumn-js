// import "./App.css";
import React, { useEffect, useState } from "react";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { AutumnProvider } from "autumn-js/react";
import { ConvexCustomerSection } from "./components/ConvexCustomerSection";
import { DebugConsole } from "./components/DebugConsole";
import { api } from "../convex/_generated/api";
import { authClient } from "./lib/auth-client";
import { BetterAuthSignIn } from "./components/BetterAuthSignIn";

const address = import.meta.env.VITE_CONVEX_URL || "";
const convex = new ConvexReactClient(address);

function AutumnWrapper({ children }: { children: React.ReactNode }) {
  const getToken = async () => {
    try {
      const cookie = await authClient.getCookie();
      console.log("Full cookie:", cookie);
      if (cookie) {
        const cookieParts = cookie.split(';');
        const convexJwtPart = cookieParts.find(part => 
          part.trim().startsWith('better-auth.convex_jwt=')
        );
        
        if (convexJwtPart) {
          const token = convexJwtPart.split('=')[1];
          console.log("Parsed JWT token:", token);
          return token;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  };

  return (
    <AutumnProvider
      convexApi={(api as any).autumn}
      convexUrl={import.meta.env.VITE_CONVEX_URL}
      getBearerToken={getToken}
    >
      {children}
    </AutumnProvider>
  );
}

function AppContent() {
  return (
    <div className="bg-gray-900 text-white min-h-screen w-screen overflow-x-hidden">
      <AuthLoading>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          <h2 className="text-center py-8 pb-4 text-2xl font-semibold text-white">
            Loading...
          </h2>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <BetterAuthSignIn />
      </Unauthenticated>

      <Authenticated>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 w-screen overflow-hidden">
          {/* Header with user button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={async () => {
                try {
                  await authClient.signOut();
                } finally {
                  window.location.reload();
                }
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign out
            </button>
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
    </div>
  );
}

function App() {
  return (
    <AutumnWrapper>
      <AppContent />
    </AutumnWrapper>
  );
}

export default App;
