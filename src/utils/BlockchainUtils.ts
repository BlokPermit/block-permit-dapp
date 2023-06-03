import {Contract} from "ethers";
import {provider} from "./EthereumClient";

const projectAbi = require('../../contractArtifacts/Project.json');
const ownerContractAbi = require('../../contractArtifacts/OwnerContract.json');
const buildingPermitContractAbi = require('../../contractArtifacts/BuildingPermitContract.json');
const documentContractAbi = require('../../contractArtifacts/DocumentContract.json');

export const enum ArtifactType {
    PROJECT_ARTIFACT,
    OWNER_ARTIFACT,
    BUILDING_PERMIT_ARTIFACT,
    DOCUMENT_ARTIFACT
}

export const getContractArtifact = (artifactType: ArtifactType) => {
    switch (artifactType) {
        case ArtifactType.PROJECT_ARTIFACT:
            return projectAbi;
        case ArtifactType.OWNER_ARTIFACT:
            return ownerContractAbi;
        case ArtifactType.BUILDING_PERMIT_ARTIFACT:
            return buildingPermitContractAbi;
        case ArtifactType.DOCUMENT_ARTIFACT:
            return documentContractAbi;
        default:
            throw Error('No ARTIFACT type provided.')
    }
}

export const getOwnerContract = async () => {
    const contractARTIFACT = await getContractArtifact(ArtifactType.OWNER_ARTIFACT).artifact;
    return new Contract(
        process.env.NEXT_PUBLIC_OWNER_CONTRACT_ADDRESS as string,
        contractARTIFACT,
        provider
    );
}

export const getContractARTIFACT = async () => {
}
