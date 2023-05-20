import Navigation from "@/components/navigation/Navigation";
import Jazzicon from "react-jazzicon";
import {useUser} from "@/context/UserContext";
import {useEffect, useState} from "react";

export default function Sidebar() {
    const { accountAddress } = useUser();
    const [seed, setSeed] = useState<number| null>(null);

    useEffect(() => {
        if (!seed) {
            const generatedSeed = Math.round(Math.random() * 10000000);
            setSeed(generatedSeed);
        }
    }, [seed]);
    return (

        <div style={{width: 350}} className="flex h-screen flex-col justify-between border-e bg-white">
            <div className="px-4 py-6">
    <span
        className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"
    >
      Logo
    </span>

                <Navigation/>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                <a href="@/app/components/page#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                    <Jazzicon
                        seed={seed as number}
                        diameter={40}
                    />

                    <div>
                        <p className="text-xs">
                            <strong className="block font-2xl text-black">Test User</strong>

                            <span className="text-neutral-500">{accountAddress}</span>
                        </p>
                    </div>
                </a>
            </div>
        </div>
    )
}
