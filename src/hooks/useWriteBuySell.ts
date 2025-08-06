import {
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { CONTRACTS, PAIR, TOKEN } from "../constants";
import { Address, parseEther } from "viem";
import { useState } from "react";

export const useWriteBuy = () => {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const { sendTransactionAsync } = useSendTransaction();

  const Buy = async (
    pairAddress: `0x${string}` | undefined,
    amount: string
  ) => {
    if (!pairAddress) throw new Error("pairAddress is required");

    const hash = await sendTransactionAsync({
      to: pairAddress,
      value: parseEther(amount),
    });

    setTxHash(hash); // ✅ directly use the returned string hash
    return hash; // or optionally wait for receipt externally
  };

  return { Buy, txHash, isConfirming, isConfirmed, confirmError };
};

export const useWriteSell = () => {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const { writeContractAsync } = useWriteContract();

  const Approve = async (
    tokenAddress: `0x${string}`,
    spender: `0x${string}` | undefined,
    amount: string
  ) => {
    const bigintAmount = BigInt(Number(amount) * 1e18);
    return await writeContractAsync({
      address: tokenAddress,
      abi: TOKEN,
      functionName: "approve",
      args: [spender, bigintAmount],
    });
  };

  const Sell = async (pairAddress: Address, amount: string) => {
    const bigintAmount = BigInt(Number(amount) * 1e18);
    const hash = await writeContractAsync({
      address: pairAddress,
      abi: PAIR,
      functionName: "sell",
      args: [bigintAmount, 1],
    });

    setTxHash(hash); // hash is returned directly as string from wagmi v1+
    return hash;
  };

  return {
    Approve,
    Sell,
    txHash,
    isConfirming,
    isConfirmed,
    confirmError,
    receipt,
  };
};

export const useGetAllowance = (
  address: `0x${string}` | undefined,
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined
) => {
  const { data: allowance } = useReadContract({
    address: address,
    abi: TOKEN,
    functionName: "allowance",
    args: [owner, spender],
  });

  return Number(allowance);
};
