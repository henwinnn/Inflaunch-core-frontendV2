"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import {
  Sparkles,
  LinkIcon,
  PlusCircle,
  Trash2,
  Twitter,
  Send,
  Globe,
} from "lucide-react";
// import { useToast } from "../hooks/use-toast;
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { useWriteCreateToken } from "../hooks/useCreateToken";
import { useAccount } from "wagmi";
import { getProofData } from "../util/youtube";

interface SocialLink {
  id: string;
  platform: "twitter" | "telegram" | "website" | "other";
  url: string;
}

const initialSocialLink: SocialLink = {
  id: Date.now().toString(),
  platform: "twitter",
  url: "",
};

export default function CreateTokenPage() {
  const proofData = getProofData();
  const { channelTitle, channelThumbnail } = proofData || {
    channelTitle: "",
    channelThumbnail: "",
  };

  const [tokenName, setTokenName] = useState(channelTitle);
  const [tokenTicker, setTokenTicker] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    initialSocialLink,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"normal" | "revenue">("normal");

  const { CreateToken, error } = useWriteCreateToken();
  const { address } = useAccount();

  console.log("channelTitle", channelTitle);
  console.log("channelThumbnail", channelThumbnail);

  const { toast } = useToast();
  const router = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!address) return;
    setIsSubmitting(true);

    // Basic Validation
    if (!tokenName || !tokenTicker || !description) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill out all required fields and upload an image.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (tokenTicker.length > 5 || !/^[A-Z0-9]+$/.test(tokenTicker)) {
      toast({
        title: "⚠️ Invalid Ticker",
        description:
          "Ticker must be 1-5 uppercase letters or numbers (e.g., Inflaunch, MEME1).",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    console.log("Form Data:", {
      tokenName,
      tokenTicker,
      description,
      imageFile,
      socialLinks,
    });

    await CreateToken(
      tokenName,
      tokenTicker,
      description,
      channelThumbnail
      // BigInt(1000000000000000000000000),
      // BigInt(500000000000000000000000),
      // BigInt(10000000000000000),
      // address
    );

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    toast({
      title: "🎉 Token Creation Initiated!",
      description: `Your token ${tokenName} (${tokenTicker}) is being created. You'll be notified upon completion.`,
      className: "bg-green-600 text-white", // Custom toast for success
    });

    // Reset form or redirect
    // setTokenName(""); setTokenTicker(""); setDescription(""); setImagePreview(null); setImageFile(null); setSocialLinks([initialSocialLink]);
    setIsSubmitting(false);
    router("/"); // Redirect to homepage after successful submission
  };

  const getSocialIcon = (platform: SocialLink["platform"]) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-5 w-5 text-sky-500" />;
      case "telegram":
        return <Send className="h-5 w-5 text-blue-500" />;
      case "website":
        return <Globe className="h-5 w-5 text-gray-500" />;
      default:
        return <LinkIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="bg-card/80 backdrop-blur-md shadow-lg border border-border rounded-2xl">
        <CardHeader className="text-center">
          <div className="inline-block mx-auto mb-4 p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-brand-gradient">
            Create Your Token
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Launch your own token on Inflaunch.core! Fill in the details below
            to get started.
            <br />
            Connect your social account (e.g., Twitter via ZK-TLS/OAuth) to
            auto-fill your name.
          </CardDescription>
        </CardHeader>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white text-center mb-1">
              Choose Launch Type
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Select how you want to launch your token
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-900 rounded-xl p-1 max-w-lg mx-auto gap-1">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "normal"
                  ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow"
                  : "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("normal")}
            >
              Normal Launch
            </button>

            <button
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "revenue"
                  ? "bg-purple-500 text-white shadow"
                  : "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("revenue")}
            >
              Revenue Lock Launch
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-lg mx-auto">
            {activeTab === "normal" && (
              <div className="space-y-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-6 border-2 border-pink-500">
                  <h3 className="font-semibold text-white mb-2">
                    Normal Launch
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Standard token launch. Your token will be available for
                    trading immediately with no additional commitments.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="text-green-400">✓ Quick & Simple setup</div>
                    <div className="text-green-400">
                      ✓ No revenue commitments required
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "revenue" && (
              <div className="space-y-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-6 border-2 border-purple-500">
                  <h3 className="font-semibold text-white mb-2">
                    Revenue Lock Launch
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Lock a percentage of your YouTube ad revenue to
                    automatically buy back your token...
                  </p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="text-green-400">
                      ✓ Automatic token buybacks
                    </div>
                    <div className="text-green-400">
                      ✓ Increased token value potential
                    </div>
                    <div className="text-green-400">
                      ✓ Higher investor confidence
                    </div>
                    <div className="text-yellow-400">
                      ⚠ Requires YouTube monetization
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center">
                Choose Your Platform
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {/* YouTube - Active */}
                <button className="flex items-center gap-3 p-4 bg-red-600 hover:bg-red-700 rounded-lg border-2 border-red-500 transition-colors">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">YT</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">YouTube</div>
                    <div className="text-xs text-red-200">
                      Connected via Gmail
                    </div>
                  </div>
                </button>

                {/* Twitter - Coming Soon */}
                <button className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border-2 border-gray-700 opacity-60 cursor-not-allowed">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">𝕏</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-300">Twitter</div>
                    <div className="text-xs text-gray-500">Coming Soon</div>
                  </div>
                </button>

                {/* TikTok - Coming Soon */}
                <button className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border-2 border-gray-700 opacity-60 cursor-not-allowed">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TT</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-300">TikTok</div>
                    <div className="text-xs text-gray-500">Coming Soon</div>
                  </div>
                </button>

                {/* Instagram - Coming Soon */}
                <button className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg border-2 border-gray-700 opacity-60 cursor-not-allowed">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IG</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-300">Instagram</div>
                    <div className="text-xs text-gray-500">Coming Soon</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Token Name */}
            <div className="space-y-2">
              <Label htmlFor="token-name" className="text-lg font-semibold">
                Token Name 📛
              </Label>
              <Input
                id="token-name"
                placeholder="e.g., My Awesome Project (from Twitter/Social)"
                value={tokenName}
                // onChange={(e) => setTokenName(e.target.value)}
                disabled
                required
                className="h-12 text-base"
              />
              <p className="text-xs text-muted-foreground">
                This will be the official name of your token.
              </p>
            </div>

            {/* Token Ticker */}
            <div className="space-y-2">
              <Label htmlFor="token-ticker" className="text-lg font-semibold">
                Token Ticker 💲
              </Label>
              <Input
                id="token-ticker"
                placeholder="e.g., MAP (3-5 uppercase letters/numbers)"
                value={tokenTicker}
                onChange={(e) => setTokenTicker(e.target.value.toUpperCase())}
                maxLength={5}
                required
                className="h-12 text-base"
              />
              <p className="text-xs text-muted-foreground">
                A short, unique symbol for your token (e.g., BTC, ETH).
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-semibold">
                Description 📝
              </Label>
              <Textarea
                id="description"
                placeholder="Tell everyone about your token, its purpose, and vision..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                A compelling description will attract more users. Emojis are
                welcome!
              </p>
            </div>

            <CardFooter className="p-0 pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg font-semibold bg-brand-gradient hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Token...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" /> Launch My Token!
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
