import { useReadContract } from "wagmi";
import { PAIR } from "../constants";

export const useGetPercentage = (address: `0x${string}` | undefined) => {
    const { data: percentage } = useReadContract({
        address: address,
        abi: PAIR,
        functionName: "getProgressPercentage",
        query: {
            refetchInterval: 10000
        }
    });

    return Number(percentage);
};
