import { useState, useEffect } from "react";
import { TokenData, TokenInfo } from "../types/types";

//CG-GqhpcCXadMuF2zwJUr5H2XYv

const useTokenInfo = (pair: string) => {
  const [data, setData] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://inflaunch-core-backend.onrender.com/token/${pair}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, [pair]);

  return { data, loading, error, refetch: fetchTokenData };
};

export default useTokenInfo;
