import {ethers} from "ethers";
import {JsonRpcProvider, Provider} from "@ethersproject/providers";

const globalForProvider = global as unknown as {
    provider: ethers.providers.Provider | undefined;
};

export const provider: Provider =
    globalForProvider.provider ??
    new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);