import { useQuery } from "@tanstack/react-query";

const fetchTokenDailyMetrics = async () => {
  const res = await fetch("https://inflaunch-core-backend.onrender.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
  query MyQuery {
  tokenDailyMetricss {
    items {
      closePrice
      date
      highPrice
      id
      openPrice
      lowPrice
      priceChange24h
      priceChangePercent24h
      timestamp
      token
      volume24h
    }
  }
}
`,
    }),
  });

  const { data } = await res.json();

  return { dataMetrics: data.tokenDailyMetricss.items };
};

export const useTokenDailyMetricsQuery = () => {
  return useQuery({
    queryKey: ["tokenDailyMetricss"],
    queryFn: fetchTokenDailyMetrics,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};
