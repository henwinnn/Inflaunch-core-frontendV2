"use client";

import { Link } from "react-router-dom";

import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Search, LogIn, Wallet, Sparkles, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import useOAuth2 from "@/src/hooks/useOauth";
// import { googleOAuthConfig } from "@/src/config/googleOAuthConfig";
import useOAuth2 from "../../hooks/useOauth";
import { googleOAuthConfig } from "../../config/googleOAuthConfig";
import { cn } from "../..//lib/utils";
import axios from "axios";
import { useAccount } from "wagmi";
import { useToast } from "../../hooks/use-toast";
import { getProofData } from "../../util/youtube";

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();
  const [isLoadingGenerateProof, setIsLoadingGenerateProof] = useState(false);

  const navLinks = [
    { to: "/", label: "Explore" },
    // Add more links if needed
  ];

  const { accessToken, initiateAuthFlow, logout } = useOAuth2({
    ...googleOAuthConfig,
    clientId: googleOAuthConfig.clientId ?? "",
    // Remove clientSecret - it's not needed for frontend OAuth2
  });

  const generateProof = async () => {
    setIsLoadingGenerateProof(true);
    const token = accessToken;
    if (!token) {
      console.error("No valid token available");
      return;
    }

    try {
      const res = await axios.post(
        "https://zkfetch-xi.vercel.app/generateProof",
        {
          token,
        }
      );

      localStorage.setItem("proofData", JSON.stringify(res.data));

      toast({
        title: "Proof Generated",
        description: `Proof successfully generated! Check console for details.`,
        variant: "default",
      });

      // alert("Proof successfully generated! Check console for details.");
    } catch (error) {
      console.error("Failed to generate proof:", error);
      alert("Failed to generate proof");
    }

    setIsLoadingGenerateProof(false);
  };

  // Fetch proof data from local storage or API
  const proofData = getProofData();

  useEffect(() => {
    if (accessToken && !proofData) {
      const timeout = setTimeout(() => {
        generateProof();
      }, 100); // 5000ms = 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [accessToken, proofData]);

  useEffect(() => {
    if (isLoadingGenerateProof) {
      toast({
        title: "Generating Proof...",
        description: "Please wait while we generate your proof.",
        variant: "default",
      });
    }
  }, [isLoadingGenerateProof]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block bg-clip-text text-transparent bg-brand-gradient">
            Inflaunch.core
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="hidden md:flex w-full flex-1 md:w-auto md:flex-none">
            {/* Adjust left positioning based on your layout */}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          {address && proofData && (
            <Link
              to="/create-token"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "hidden sm:inline-flex bg-brand-gradient hover:opacity-90 transition-opacity"
              )}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Create Tokens
            </Link>
          )}

          {accessToken && (
            <div className="hidden sm:flex items-center space-x-2">
              <ConnectButton />
            </div>
          )}
          <div className="hidden sm:flex items-center space-x-2">
            {!accessToken ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // handleSignIn()
                  initiateAuthFlow();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full my-1 bg-white hover:bg-black text-gray-900 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // handleSignIn()
                    logout();
                    setIsMobileMenuOpen(false);
                    localStorage.clear();
                  }}
                  className="w-full my-1 bg-white hover:bg-black text-gray-900 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Logout Gmail
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // generateProof();
                  }}
                >
                  Proof Account
                </Button> */}
              </>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-t py-2">
          <nav className="flex flex-col gap-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/create-token"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "w-full my-1 bg-brand-gradient hover:opacity-90 transition-opacity"
              )}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Create Tokens
            </Link>
            {!isLoggedIn && (
              <>
                <ConnectButton />

                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    socialLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full my-1"
                >
                  <LogIn className="mr-2 h-4 w-4" /> Social Login
                </Button> */}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // handleSignIn()
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full my-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </>
            )}

            <Input
              type="search"
              placeholder="Search creators..."
              className="h-9 rounded-full pl-10 my-1"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ml-5 mt-[6.5px]" />
          </nav>
        </div>
      )}
    </header>
  );
}
