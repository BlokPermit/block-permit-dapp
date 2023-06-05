import {prisma} from "@/utils/PrismaClient";
import {User} from "@prisma/client";
import {Contract} from "ethers";
import {getOwnerContract} from "@/utils/BlockchainUtils";
import {provider} from "@/utils/EthereumClient";


export const createUsers = async (users: User[]) => {
    for (let user of users) {
        user.walletAddress = user.walletAddress.toLowerCase();
    }
    return prisma.user.createMany({
        data: users,
    });
}

export const findUserByAddress = async (address: string) => {
    const user = prisma.user.findUnique({
        where: {
            walletAddress: address.toLowerCase(),
        }
    });

    if (!user) throw new Error("User not found");

    return user;
}

export const checkUserOnBlockchain = async (address: any): Promise<boolean> => {
    const contract: Contract = await getOwnerContract();
    const isOwner: boolean = await contract.owners(address.account)
    console.log(isOwner);
    console.log(await contract.authorizedUsers(address.account));
    if (isOwner) return isOwner;
    return contract.authorizedUsers(address.account);
}

export const authorizeUsersOnBlockchain = async (addresses: any, signer: string): Promise<any> => {
    const contract: Contract = await getOwnerContract();
    return contract.connect(provider.getSigner(signer)).authorizeUsers(addresses);
}