export interface CreatorToken {
  id: string
  creatorName: string
  creatorAvatar: string
  tokenName: string
  tokenTicker: string
  price: number
  priceChange24h: number
  marketCap: number
  holders: number
  bio: string
  category: "top" | "new" | "trending"
  milestones?: string[]
  bondingCurveProgress?: number // 0-100
}

export const placeholderTokens: CreatorToken[] = [
  {
    id: "token-1",
    creatorName: "CryptoQueen 👑",
    creatorAvatar: "/placeholder.svg?width=40&height=40",
    tokenName: "Queen Coin",
    tokenTicker: "QNC",
    price: 1.25,
    priceChange24h: 5.75,
    marketCap: 1250000,
    holders: 1200,
    bio: "To the moon and beyond! Join the royal crypto family. 🚀",
    category: "trending",
    milestones: ["1K Holders!", "Top Gainer"],
    bondingCurveProgress: 75,
  },
  {
    id: "token-2",
    creatorName: "NFT Ninja 🥷",
    creatorAvatar: "/placeholder.svg?width=40&height=40",
    tokenName: "Ninja Art Token",
    tokenTicker: "NAT",
    price: 0.8,
    priceChange24h: -2.1,
    marketCap: 800000,
    holders: 850,
    bio: "Slicing through the digital art world with unique NFTs and tokens.",
    category: "top",
    bondingCurveProgress: 60,
  },
  {
    id: "token-3",
    creatorName: "Meme Lord 😂",
    creatorAvatar: "/placeholder.svg?width=40&height=40",
    tokenName: "Dank Meme Coin",
    tokenTicker: "DMC",
    price: 0.05,
    priceChange24h: 15.2,
    marketCap: 50000,
    holders: 5300,
    bio: "Fueling the meme economy, one laugh at a time. LOLZ!",
    category: "new",
    milestones: ["🚀 Launched!", "Fastest Growing"],
    bondingCurveProgress: 30,
  },
  {
    id: "token-4",
    creatorName: "Dev Dynamo 💻",
    creatorAvatar: "/placeholder.svg?width=40&height=40",
    tokenName: "Code Coin",
    tokenTicker: "CODE",
    price: 2.5,
    priceChange24h: 1.5,
    marketCap: 2500000,
    holders: 500,
    bio: "Building the future of decentralized applications. #BUIDL",
    category: "top",
    bondingCurveProgress: 90,
  },
]

export const getPlaceholderTokenById = (id: string): CreatorToken | undefined => {
  return placeholderTokens.find((token) => token.id === id)
}
