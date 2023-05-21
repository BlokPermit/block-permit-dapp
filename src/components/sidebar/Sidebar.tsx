import Navigation from "@/components/navigation/Navigation";
import Jazzicon from "react-jazzicon";
import {useUser} from "@/context/UserContext";
import Link from "next/link";
import {useRouter} from "next/router";

export default function Sidebar() {
    const {pathname} = useRouter();
    const {accountAddress} = useUser();

    return (

        <div className="flex h-screen flex-col justify-between border-e bg-white fixed left-0 w-1/6">
            <div className="px-4 py-6">
    <span
        className="grid h-10 w-32 place-content-center rounded-lg bg-grey-100 text-xs text-gray-600"
    >
      Logo
    </span>

                <Navigation/>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                <Link href="/user" className={`flex items-center gap-2  p-4 hover:bg-gray-50 ${pathname == "/user" ? 'bg-gray-100' : 'bg-white'}`}>
                    <Jazzicon
                        seed={10015}
                        diameter={38}
                    />

                    <div>
                        <p className="text-xs">
                            <strong className="block font-2xl text-black">Test User</strong>

                            <span className="text-neutral-500 break-all">{accountAddress}</span>
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    )
}
