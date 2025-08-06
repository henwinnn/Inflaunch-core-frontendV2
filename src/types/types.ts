import { Address } from "viem"

type TokenMetrics = {
    id: string
    token: string
    date: string
    openPrice: string
    closePrice: string
    highPrice: string
    lowPrice: string
    volume24h: string
    priceChange24h: string
    priceChangePercent24h: number
    timestamp: string
}

export type TokenData = {
    id: string
    token: Address
    name: string
    symbol: string
    initialSupply: string
    pair: Address
    description: string
    ethAmount: string
    tokenPrice: string
    marketCap: string
    liquidity: string
    timestamp: string
    blockNumber: string
    latestMetrics: TokenMetrics
    allMetrics: TokenMetrics[]
}

export type TokenInfo = {
    marketCap: string
    pairAddress: string
    pricePerETH: string
    pricePerToken: string
}
