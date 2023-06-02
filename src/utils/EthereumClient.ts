import {ethers} from "ethers";

const globalForProvider = global as unknown as {
    provider: ethers.providers.Provider | undefined;
};

export const provider =
    globalForProvider.provider ??
    new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);