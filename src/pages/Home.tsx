"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getProofData } from "../util/youtube";

import { cn } from "../lib/utils";
import { useAccount } from "wagmi";
// import { placeholderTokens } from "../lib/placeholder-data";

export default function HomePage() {
  const { address } = useAccount();
  const proofData = getProofData();

  // const [filter, setFilter] = useState<"top" | "new" | "trending">("trending");

  // const filteredTokens = placeholderTokens.filter(
  //   (token) => token.category === filter
  // );

  // Confetti effect (conceptual)
  // const triggerConfetti = () => {
  //   // In a real app, you'd use a library like react-confetti
  //   // For now, we can simulate with a console log or a simple CSS animation
  //   const confettiElements = document.querySelectorAll(".confetti-piece");
  //   confettiElements.forEach((el) => {
  //     el.classList.add("animate-confetti-burst");
  //     setTimeout(() => el.classList.remove("animate-confetti-burst"), 800);
  //   });
  //   console.log("🎉 Confetti Burst! 🎉");
  // };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 background-color-new relative overflow-hidden">
        {/* Placeholder for animated background elements */}
        <div className="absolute inset-0 opacity-10">
          {/* Example: <Sparkles className="absolute top-1/4 left-1/4 h-32 w-32 text-brand-pink animate-pulse" /> */}
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-brand-gradient">
              Tokenize Your Influence with Inflaunch
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Unlock the power of the creator capital market. Launch your own
            token with a Web3-native platform built to empower modern content
            creators — no code, no gatekeepers, just direct value from your
            community. 🚀✨
          </p>
          <div className="space-x-4">
            {address && proofData && (
              <Link
                to="/create-token"
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background bg-brand-gradient"
                )}
              >
                <Sparkles className="mr-2 h-5 w-5" /> Create Your Token
              </Link>
            )}
            <Link
              to="/explore"
              className={cn(
                "inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-300 ease-in-out hover:scale-105"
              )}
            >
              Explore Tokens
            </Link>
          </div>
        </div>
        {/* Hidden confetti pieces for animation */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece absolute bg-primary rounded-full w-2 h-2 opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </section>
    </div>
  );
}
