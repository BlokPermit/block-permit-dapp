import React from 'react';
import Jazzicon from "react-jazzicon";
import {getSession, useSession} from "next-auth/react";
import {UserType} from ".prisma/client";
import {FaEdit, FaUser} from "react-icons/all";
import Link from "next/link";
import IconButton from "@/components/generic/buttons/IconButton";
import {findUserById} from "@/lib/UserService";
import { User} from "@prisma/client";
import {InferGetServerSidePropsType} from "next";


export const getServerSideProps: any = async (context: any) => {

    try {
        const session = await getSession(context);

        if(!session){
            return {
                redirect: {
                    destination: '/auth',
                    permanent: false,
                },
            }
        } else {
            let user: User | null = await findUserById(session.user.id?.toString() ?? "");
            return {
                props: {user}
            }
        }
    } catch (error) {
        return { notFound: true };
    }
};

export default function User({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    function getUserType(type?: UserType | null): string {
        switch (type) {
            case UserType.ADMIN:
                return "Admin"
            case UserType.ASSESSMENT_PROVIDER:
                return "Mnenjedajalec"
            case UserType.PROJECT_MANAGER:
                return "Projektni vodja"
            case UserType.ADMINISTRATIVE_AUTHORITY:
                return "Ustanova"
            default:
                return "Nedoločeno"
        }
    }

    return (
        <div className="px-12 py-12 w-full h-screen">
            <div
                className="border border-neutral-200 shadow rounded-lg px-10 py-10 max-w-3xl  w-full  mr-6 my-2 hover:bg-neutral-100"
            >

                <div className="flex">
                    <div className="mt-4">
                        <Jazzicon
                            seed={10015}
                            diameter={150}
                        />

                    </div>

                    <div className="flex-col ml-16 mt-2">
                        <div className="text-black text-2xl font-semibold mb-6 flex justify-between">
                            <div className="flex items-center justify-center space-x-1">
                            <div>{user.name}</div>
                            <Link href={`/user/editUser/${user?.id}`}>
                                <IconButton className="text-main-200 border-gray-50 rounded-none hover:border-b-main-200" icon={<FaEdit />} text={"Uredi"} onClick={() => {}} />
                            </Link>
                            </div>
                            <span
                                className={`inline-flex items-center justify-center rounded-full bg-main-400 px-2.5 py-1  text-white  h-1/4 mt-0.5`}>
                                 <FaUser color="white" size={14}/>
                                  <p className="whitespace-nowrap text-sm pl-1.5 ">{getUserType(user?.userType)}</p>
                        </span>

                        </div>

                        <div className="flex">
                            <div className="text-neutral-400 mr-2">Javni ključ:</div>
                            {user.walletAddress}</div>

                        <div className="flex">
                            <div className="text-neutral-400 mr-2">Email:</div>
                            {user.email}</div>

                        <div className="flex">
                            <div className="text-neutral-400 mr-2">Naslov:</div>
                            {user.streetAddress}</div>
                        <div className="flex">
                            <div className="text-neutral-400 mr-2">Telefon:</div>
                            {user.phone}</div>
                    </div>
                </div>

            </div>

        </div>
    );
};
