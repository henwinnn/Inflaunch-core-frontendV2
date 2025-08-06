import { useAccount, useWriteContract } from "wagmi";
import { CONTRACTS, TOKEN_FACTORY } from "../constants";
import { parseEther } from "viem";

export const useWriteCreateToken = () => {
  const { address } = useAccount();

  const initialSupply = BigInt(1000000 * 10 ** 18); // 1M token
  const pairAmount = BigInt(500000 * 10 ** 18); // 500.000 token pair
  const ethAmount = BigInt(0.01 * 10 ** 18); // 0.01 ETH
  const { data: hash, error, writeContractAsync } = useWriteContract();

  const CreateToken = async (
    name: string,
    symbol: string,
    description: string,
    url: string
    // initialSupply: BigInt,
    // pairAmount: BigInt,
    // ethAmount: BigInt,
    // creator: string
  ) => {
    return await writeContractAsync({
      address: CONTRACTS.TOKEN_FACTORY,
      abi: TOKEN_FACTORY,
      functionName: "createTokenWithEthPair",
      args: [
        {
          name,
          symbol,
          description,
          url,
          initialSupply,
          pairAmount,
          ethAmount,
          creator: address,
        },
      ],
      value: parseEther("0.01"),
    });
  };
  return { hash, CreateToken, error };
};
