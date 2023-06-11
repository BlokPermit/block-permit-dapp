import { prisma } from "@/utils/PrismaClient";
import { User, UserType } from "@prisma/client";
import { Contract } from "ethers";
import { getOwnerContract } from "@/utils/BlockchainUtils";
import { provider } from "@/utils/EthereumClient";

export const createUsers = async (users: User[]) => {
  for (let user of users) {
    user.walletAddress = user.walletAddress.toLowerCase();
  }
  return prisma.user.createMany({
    data: users,
  });
};

export const updateUser = async (user: User) => {
  console.log(user)
  let id = user.id;
  // @ts-ignore
  delete user.id;
  return prisma.user.update({
    where: {
      id: id,
    },
    data: user,
  });
};

export const findUserByAddress = async (address: string) => {
  const user = prisma.user.findUnique({
    where: {
      walletAddress: address.toLowerCase(),
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};

export const findUserById = async (id: string) => {
  const user = prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};

export const searchUsers = async (searchQuery: string, userType: UserType) => {
  return prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          streetAddress: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
      AND: [
        {
          userType: userType,
        },
      ],
    },
  });
};

export const checkUserOnBlockchain = async (address: any): Promise<boolean> => {
  const contract: Contract = await getOwnerContract();
  const isOwner: boolean = await contract.owners(address.account);
  console.log(isOwner);
  console.log(await contract.authorizedUsers(address.account));
  if (isOwner) return isOwner;
  return contract.authorizedUsers(address.account);
};

export const authorizeUsersOnBlockchain = async (addresses: any, signer: string): Promise<any> => {
  const contract: Contract = await getOwnerContract();
  return contract.connect(provider.getSigner(signer)).authorizeUsers(addresses);
};
