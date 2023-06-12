import Navigation from "@/components/generic/navigation/Navigation";
import Jazzicon from "react-jazzicon";
import Link from "next/link";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";

export default function Sidebar() {
    const {pathname} = useRouter();
    const {data} = useSession();

    return (
        <div className="flex w-screen flex-row justify-between border-e bg-white shadow-sm  left-0">
            <Navigation/>
            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                <Link href="/user"
                      className={`flex items-center gap-2  p-4 hover:bg-gray-50 ${pathname == "/user" ? "bg-gray-100" : "bg-white"}`}>
                    <Jazzicon seed={10015} diameter={38}/>

                    <div>
                        <p className="text-xs">
                            <strong className="block font-2xl text-black">{data?.user.name}</strong>

                            <span className="text-neutral-500 break-all">{data?.user.walletAddress}</span>
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
