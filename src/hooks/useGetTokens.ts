import { useReadContract } from "wagmi";
import { CONTRACTS, TOKEN_FACTORY } from "../constants";

export const useGetTokens = () => {
    const { data: tokens } = useReadContract({
        address: CONTRACTS.TOKEN_FACTORY,
        abi: TOKEN_FACTORY,
        functionName: "getTokenCreated",
    });

    return tokens;
};
