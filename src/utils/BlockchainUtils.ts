import path from "path";
import {Contract} from "ethers";
import {provider} from "./EthereumClient";
import {readFileSync} from "fs";

export const getContractArtifact = (contractName: string) => {
    const abiPath: string = path.join(__dirname, "..", "..", "..", "..", "contractArtifacts");
    const abiFile: string = `${abiPath}/${contractName}.json`;

    const artifact: string = readFileSync(abiFile, "utf8");

    return JSON.parse(artifact);
}

export const getOwnerContract = async () => {
    const contractABI = await getContractArtifact("OwnerContract").abi;
    console.log(provider);

    return new Contract(
        process.env.NEXT_PUBLIC_OWNER_CONTRACT_ADDRESS as string,
        contractABI,
        provider
    );
}

export const getContractABI = async () => {
}
