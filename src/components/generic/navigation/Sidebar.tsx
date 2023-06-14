import Navigation from "@/components/generic/navigation/Navigation";
import Jazzicon from "react-jazzicon";
import Link from "next/link";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import React from "react";

export default function Sidebar() {
    const {pathname} = useRouter();
    const {data} = useSession();

    return (
        <div className="flex w-screen flex-row justify-between border-e bg-white shadow-sm pr-6 pl-8  left-0">
             <span
                 className=" w-32 flex justify-center items-center rounded-lg bg-grey-100 text-xs text-gray-600">   <img src="/images/logo1.png" alt="Metamask Logo" className="w-500 h-200 "/></span>
            <Navigation/>
            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 flex items-center justify-center">
                <Link href="/user"
                      className={`flex items-center gap-3.5  p-4 hover:bg-gray-50 ${pathname == "/user" ? "bg-gray-100" : "bg-white"}`}>
                    <div>
                            <strong className="block text-md">{data?.user.name}</strong>
                    </div>
                    <Jazzicon seed={10015} diameter={38}/>
                </Link>

            </div>
        </div>
    );
}
