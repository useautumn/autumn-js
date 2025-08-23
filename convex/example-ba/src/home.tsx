import "./App.css";
import { useAction, useMutation, useQuery } from "convex/react";
import { api, components } from "../convex/_generated/api";
import React from "react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { authClient } from "./lib/auth-client";
import { useCustomer } from "autumn-js/react";
import { DebugConsole } from "./components/DebugConsole";
import { CustomerView } from "./components/CustomerView";
import { useState, useEffect } from "react";
import { ConvexCustomerSection } from "./components/ConvexCustomerSection";
import { AutumnJSCustomerSection } from "./components/AutumnJSCustomerSection";

export default function Home() {
  return (
    <>
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
            Unauthenticated
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-center text-lg font-medium text-gray-200 mb-6">
              Sign in to get started
            </h3>
            <div className="flex flex-col gap-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                onClick={() => {
                  authClient.signIn.email({
                    email: "test@test.com",
                    password: "test!@523dsgsAFF",
                  });
                }}
              >
                Sign in
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                onClick={() =>
                  authClient.signUp.email({
                    email: "test@test.com",
                    password: "test!@523dsgsAFF",
                    name: "Test User",
                  })
                }
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 w-full pb-64 overflow-hidden">
          
          <div className="flex-1 grid grid-cols-2 w-full overflow-hidden">
            
            <div className="border-r border-gray-700/50 flex flex-col justify-center items-center p-8 w-full overflow-y-auto">
              <div className="w-full max-w-lg">
                <h2 className="text-center text-2xl font-bold text-white mb-8">
                  Autumn without Convex
                </h2>
                <AutumnJSCustomerSection /> 
              </div>
            </div>

            <div className="flex flex-col justify-center items-center p-8 w-full overflow-y-auto">
              <div className="w-full max-w-lg">
                <h2 className="text-center text-2xl font-bold text-white mb-8">
                  Autumn with Convex
                </h2>
                <ConvexCustomerSection /> 
              </div>
            </div>
          </div>
        </div>

        <DebugConsole />
      </Authenticated> 
      

      <p>hi</p>
    </>
  );
}