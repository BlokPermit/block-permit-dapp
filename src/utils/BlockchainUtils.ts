import path from "path";
import {Contract, getDefaultProvider} from "ethers";
import {provider} from "./EthereumClient";
import {Web3Provider} from "@ethersproject/providers";
import {readFileSync} from "fs";

export const getContractArtifact = (contractName: string) => {
    const abiPath: string = path.join(__dirname, "..", "..", "..", "..", "contractArtifacts");
    const abiFile: string = `${abiPath}/${contractName}.json`;

    const artifact: string = readFileSync(abiFile, "utf8");

    return JSON.parse(artifact);
}

export const getOwnerContract = async () => {
    const contractABI = await getContractArtifact("OwnerContract").abi;
    return new Contract(
        process.env.OWNER_CONTRACT_ADDRESS,
        contractABI,
        provider
    );
}
