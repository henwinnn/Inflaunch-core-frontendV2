"use client";

import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { InteractiveChart } from "./components/interactive-chart";
import { BondingCurveProgress } from "./components/bonding-curve-progress";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  BarChart2,
  ShoppingCart,
  CheckCircle,
  Info,
} from "lucide-react";
import { useToast } from "./components/ui/use-toast";
import type React from "react";
import { useEffect, useRef, useState } from "react";
// import useTokenExplorer from "../api/useTokenExplorer";
import { useGetPercentage } from "../hooks/useGetPercentage";
import {
  useGetAllowance,
  useWriteBuy,
  useWriteSell,
} from "../hooks/useWriteBuySell";
import { useAccount } from "wagmi";
import useTokenInfo from "../api/useTokenInfo";
import { useGetBalance } from "../hooks/useGetTokenBalance";
import { useTokenExplorerQuery } from "../hooks/useTokenExplorerQuery";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OHLCData, useOHLC } from "../hooks/useOHLC";

export default function TokenDetailPage() {
  const router = useNavigate();
  const params = useParams();
  const { toast } = useToast();
  const pair = params.id as string;
  const { isConnected, address } = useAccount();
  const { data: tokenData, refetch: refetchToken } = useTokenInfo(pair);
  const {
    data: OHLCData,
    refetch: refetchOHLC,
    waitUntilDataIncreases,
  } = useOHLC(pair);
  // Move the hook to component level
  const { data: apiData } = useTokenExplorerQuery();
  const [newOHLC, setNewOHLC] = useState<OHLCData[] | null>(null);

  let token = apiData?.tokensMap?.find((token: any) => token.pair === pair);
  const balance = useGetBalance(token?.token, address);
  const percentage = useGetPercentage(token?.pair);
  const { Buy } = useWriteBuy();
  const { Approve, Sell } = useWriteSell();
  const allowance = useGetAllowance(token?.token, address, token?.pair);

  // Try to get token from local data first, then from API data

  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const sellButtonRef = useRef<HTMLButtonElement>(null);
  const [amount, setAmount] = useState("");
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy");
  // const price = 3100;
  // Show loading state
  // if (loading) {
  //   return (
  //     <div className="container mx-auto py-10 text-center">
  //       <p className="text-lg text-muted-foreground mb-2">Loading token...</p>
  //     </div>
  //   );
  // }

  // // Show error state
  // if (error) {
  //   return (
  //     <div className="container mx-auto py-10 text-center">
  //       <p className="text-lg text-muted-foreground mb-2">
  //         Error loading token
  //       </p>
  //       <Button onClick={() => router(-1)} variant="link" className="mt-4">
  //         <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
  //       </Button>
  //     </div>
  //   );
  // }

  useEffect(() => {
    const init = async () => {
      const data = await refetchOHLC();
      setNewOHLC(data);
    };

    init();
  }, []);

  // Show not found state
  if (!token) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Token not found 😢</h1>
        <Button onClick={() => router(-1)} variant="link" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // const [comments, setComments] = useState([
  //   {
  //     id: 1,
  //     author: "CryptoEnthusiast",
  //     avatar: "/placeholder.svg?width=32&height=32",
  //     content:
  //       "This token has amazing potential! The community is growing fast 🚀",
  //     timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  //   },
  //   {
  //     id: 2,
  //     author: "TokenTrader",
  //     avatar: "/placeholder.svg?width=32&height=32",
  //     content: "Great project! Love the roadmap and the team behind it.",
  //     timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  //   },
  //   {
  //     id: 3,
  //     author: "DeFiExplorer",
  //     avatar: "/placeholder.svg?width=32&height=32",
  //     content: "Just bought some tokens. Excited to see where this goes!",
  //     timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  //   },
  // ]);
  // const [newComment, setNewComment] = useState("");
  // const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const handleRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    ripple.classList.add("ripple"); // Defined in globals.css

    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);
  };

  if (!token) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Token not found 😢</h1>
        <Button onClick={() => router(-1)} variant="link" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const handleBuy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    handleRippleEffect(event);
    // Simulate buy action
    const isInputValid = !Number.isNaN(Number(amount));
    if (isInputValid && isConnected) {
      await Buy(token.pair, amount);
      await refetchToken();
      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2s
      const currentLength = (await refetchOHLC())?.length ?? 0;
      const newOHLC = await refetchOHLC();
      setNewOHLC(newOHLC);
      await waitUntilDataIncreases(currentLength);
    }
    toast({
      title: "🚀 Purchase Successful!",
      description: `You bought ${token.name}. To the moon!`,
      action: <CheckCircle className="text-green-500" />,
    });
    // Potentially trigger confetti here
  };

  const handleSell = async (event: React.MouseEvent<HTMLButtonElement>) => {
    handleRippleEffect(event);
    const isBalanceEnough = Number(amount) <= balance;

    if (token?.token !== undefined && isBalanceEnough) {
      if (Number(amount) > allowance) {
        Approve(token?.token, token.pair, amount);
      }
      await Sell(token.pair, amount);
      await refetchToken();
      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2s
      const currentLength = (await refetchOHLC())?.length ?? 0;
      const newOHLC = await refetchOHLC();
      setNewOHLC(newOHLC);
      await waitUntilDataIncreases(currentLength);
    }

    // Simulate sell action

    toast({
      title: "💸 Sale Confirmed!",
      description: `You sold ${token.name}.`,
    });
  };

  // const handleCommentSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newComment.trim()) return;

  //   const comment = {
  //     id: comments.length + 1,
  //     author: "You", // In a real app, this would be the logged-in user
  //     avatar: "/placeholder.svg?width=32&height=32",
  //     content: newComment.trim(),
  //     timestamp: new Date(),
  //   };

  //   setComments([comment, ...comments]);
  //   setNewComment("");

  //   toast({
  //     title: "Comment Posted!",
  //     description: "Your comment has been added successfully.",
  //   });
  // };

  // const sortedComments = [...comments].sort((a, b) => {
  //   if (sortOrder === "newest") {
  //     return b.timestamp.getTime() - a.timestamp.getTime();
  //   } else {
  //     return a.timestamp.getTime() - b.timestamp.getTime();
  //   }
  // });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        onClick={() => router(-1)}
        variant="outline"
        size="sm"
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
      </Button>

      {/* Token Header */}
      <header className="mb-8 p-6 rounded-xl bg-card/50 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-primary">
            <AvatarImage
              src={token.url || "/placeholder.svg"}
              alt={token.creatorName}
            />
            <AvatarFallback className="text-3xl">{token.name}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-brand-gradient mb-1">
              {token.name} ({token.symbol})
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Created by {token.name}
            </p>
            <p className="text-sm text-foreground/80 max-w-xl">
              {token.description} ✨
            </p>
          </div>
        </div>
        {/* {token.milestones && token.milestones.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {token.milestones.map((milestone) => (
              <Badge
                key={milestone}
                variant="default"
                className="text-sm bg-primary/20 text-primary border-primary/30 py-1 px-3"
              >
                <TrendingUp className="h-4 w-4 mr-1.5" /> {milestone}
              </Badge>
            ))}
          </div>
        )} */}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart & Info */}
        <div className="lg:col-span-2 space-y-8">
          <InteractiveChart
            newOHLC={newOHLC}
            tokenName={token.name}
            pair={token.pair}
          />

          <Card className="bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" /> About{" "}
                {token.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{token.description}</p>
            </CardContent>
          </Card>

          {/* <Card className="bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">💬 Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              Comment Form
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this token..."
                  className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {newComment.length}/500 characters
                  </span>
                  <Button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Post Comment
                  </Button>
                </div>
              </form>
              Comments List
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sortedComments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  sortedComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={comment.avatar || "/placeholder.svg"}
                          alt={comment.author}
                        />
                        <AvatarFallback>
                          {comment.author.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/90 break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              Comment Stats
              <div className="pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
                </p>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Right Column: Stats, Buy/Sell, Bonding Curve */}
        <div className="space-y-8">
          <Card className="bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-primary" /> Live Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price (ETH)</span>
                <span className="font-semibold text-lg">
                  {/* ${Number(tokenData?.pricePerToken)/1e18} */}
                  {`$${(Number(tokenData?.pricePerToken) / 1e18).toFixed(8)}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">24h Change</span>
                <span
                  className={`font-semibold ${
                    Number(token.priceChange24h) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {Number(token.priceChange24h)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-semibold">
                  ${(Number(tokenData?.marketCap) / 1e18).toFixed(8)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Holders</span>
                <span className="font-semibold">
                  <Users className="inline h-4 w-4 mr-1 text-primary" />
                  {/* {token.holders.toLocaleString()} */}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-primary" /> Trade
                Token
              </CardTitle>
            </CardHeader>
            {!address ? (
              <CardContent className="space-y-4 flex flex-col items-center">
                <ConnectButton />
              </CardContent>
            ) : (
              <CardContent className="space-y-4">
                {/* Buy/Sell Toggle */}
                <div className="flex rounded-lg bg-muted p-1">
                  <button
                    onClick={() => setTradeMode("buy")}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      tradeMode === "buy"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeMode("sell")}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      tradeMode === "sell"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Amount input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="input flex-1 h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="font-semibold text-primary">
                    {token.symbol}
                  </span>
                </div>

                {/* Dynamic Button */}
                {tradeMode === "buy" ? (
                  <Button
                    ref={buyButtonRef}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white ripple-button"
                    onClick={handleBuy}
                  >
                    Buy {token.symbol}
                  </Button>
                ) : (
                  <Button
                    ref={sellButtonRef}
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700 text-white ripple-button"
                    onClick={handleSell}
                  >
                    Sell {token.symbol}
                  </Button>
                )}
              </CardContent>
            )}
          </Card>

          {percentage !== undefined && (
            <Card className="bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-primary" />{" "}
                  Tokenomics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BondingCurveProgress value={percentage} />
                <p className="text-xs text-muted-foreground mt-2">
                  The bonding curve determines the token's price based on its
                  supply. As more tokens are bought, the price increases.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
