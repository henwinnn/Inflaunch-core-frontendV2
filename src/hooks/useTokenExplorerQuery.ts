import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const fetchTokenExplorer = async () => {
  const res = await fetch("https://cloutponder.onrender.com/token-explorer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
  query MyQuery {
  tokenPrices {
    items {
      blockNumber
      description
      ethAmount
      id
      initialSupply
      liquidity
      marketCap
      name
      pair
      priceChange24h
      priceChangePercent24h
      symbol
      timestamp
      token
      tokenPrice
      volume24h
      url,
    }
  }
}
`,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const { data } = await res.json();

  return { tokensMap: data.tokenPrices.items };
};

export const useTokenExplorerQuery = () => {
  const query = useQuery({
    queryKey: ["tokenPrices"],
    queryFn: fetchTokenExplorer,
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    tokensMap: query.data?.tokensMap || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isRefetching: query.isRefetching,
  };
};
