import {Contract} from "ethers";
import {provider} from "./EthereumClient";

const projectArtifact = require('../../contractArtifacts/Project.json');
const ownerContractArtifact = require('../../contractArtifacts/OwnerContract.json');
const buildingPermitContractArtifact = require('../../contractArtifacts/BuildingPermitContract.json');
const documentContractArtifact = require('../../contractArtifacts/DocumentContract.json');

export const enum ArtifactType {
    PROJECT_ARTIFACT,
    OWNER_ARTIFACT,
    BUILDING_PERMIT_ARTIFACT,
    DOCUMENT_CONTRACT_ARTIFACT
}

export const getContractArtifact = (artifactType: ArtifactType) => {
    switch (artifactType) {
        case ArtifactType.PROJECT_ARTIFACT:
            return projectArtifact;
        case ArtifactType.OWNER_ARTIFACT:
            return ownerContractArtifact;
        case ArtifactType.BUILDING_PERMIT_ARTIFACT:
            return buildingPermitContractArtifact;
        case ArtifactType.DOCUMENT_CONTRACT_ARTIFACT:
            return documentContractArtifact;
        default:
            throw Error('No ARTIFACT type provided.')
    }
}

export const getOwnerContract = async () => {
    return new Contract(
        process.env.NEXT_PUBLIC_OWNER_CONTRACT_ADDRESS as string,
        await getContractArtifact(ArtifactType.OWNER_ARTIFACT).abi,
        provider
    );
}

export const getContractARTIFACT = async () => {
}
