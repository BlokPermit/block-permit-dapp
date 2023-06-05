import React, {useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import InitLoadingAnimation from "@/components/generic/loading-animation/InitLoadingAnimation";
import {getConnectedAddress} from "../utils/MetamaskUtils";

function Root() {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        /*const accounts = window.ethereum.request({method: 'eth_accounts'});*/
        console.log(window.ethereum.selectedAddress);
        if (status === "authenticated" && session) {
            router.push("/dashboard");
        } else if (status === "unauthenticated") {
            router.push("/auth");
        }

    }, [status, session]);

    return <InitLoadingAnimation/>;
}

export default Root;
