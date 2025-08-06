import { useState, useEffect } from "react";

export interface OHLCData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  timestamp?: number;
}

export interface UseOHLCReturn {
  data: OHLCData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<OHLCData[] | null>;
  waitUntilDataIncreases: (
    currentLength: number,
    maxTries?: number
  ) => Promise<void>;
}

export const useOHLC = (pairAddress: string): UseOHLCReturn => {
  const [data, setData] = useState<OHLCData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOHLCData = async () => {
    if (!pairAddress) {
      setError("Pair address is required");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://inflaunch-core-backend.onrender.com/tradingview/${pairAddress}?t=${Date.now()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const transformedData: OHLCData[] = result.data.map((item: any) => ({
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        time: item.time,
      }));

      setData([...transformedData]);

      return transformedData; // ✅ return it
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching OHLC data"
      );
      setData([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pairAddress) {
      fetchOHLCData();
    }
  }, [pairAddress]);

  const refetch = async (): Promise<OHLCData[] | null> => {
    return await fetchOHLCData();
  };

  const waitUntilDataIncreases = async (
    currentLength: number,
    maxTries = 5
  ) => {
    let attempt = 0;
    while (attempt < maxTries) {
      const updatedData = await refetch(); // ✅ get new data
      if (updatedData && updatedData.length > currentLength) {
        console.log("🎯 New OHLC data available");
        break;
      }
      console.log(`⏳ Waiting for new OHLC data... attempt ${attempt + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempt++;
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
    waitUntilDataIncreases,
  };
};
