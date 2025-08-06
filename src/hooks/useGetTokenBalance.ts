import { useReadContract } from "wagmi";
import { TOKEN } from "../constants";

export const useGetBalance = (ca: `0x${string}` | undefined, userAddress: `0x${string}` | undefined) : number => {
    const { data: balance } = useReadContract({
        address: ca,
        abi: TOKEN,
        functionName: "balanceOf",
        args: [userAddress]
    });

    return balance as number;
};
