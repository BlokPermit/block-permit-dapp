import {ethers} from "ethers";
import {JsonRpcProvider} from "@ethersproject/providers";

const globalForProvider = global as unknown as {
    provider: JsonRpcProvider | undefined;
};

export const provider: JsonRpcProvider =
    globalForProvider.provider ??
    new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);