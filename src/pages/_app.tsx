import {configureChains, createConfig, WagmiConfig} from "wagmi";
import {publicProvider} from "wagmi/providers/public";
import {SessionProvider} from "next-auth/react";
import {mainnet} from "wagmi/chains";
import {AppProps} from "next/app";
import React, {useEffect, useState} from "react";
import "../styles/globals.css";
import {Layout} from "@/components/generic/Layout";
import Head from "next/head";
import {AlertProvider} from "@/context/AlertContext";
import Alert from "@/components/generic/notifications/Alert";
import {ConformationPopupProvider} from "@/context/ConformationPopupContext";
import ConformationPopup from "@/components/generic/notifications/ConformationPopup";
import NextNProgress from "nextjs-progressbar";
import {useRouter} from "next/router";
import {ethers} from "ethers";
import InitLoadingAnimation from "@/components/generic/loading-animation/InitLoadingAnimation";


const {publicClient, webSocketPublicClient} = configureChains([mainnet], [publicProvider()]);

const config = createConfig({
    publicClient,
    webSocketPublicClient,
});

function MyApp({Component, pageProps}: AppProps) {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkMetamaskInstallation = async () => {
            if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                try {
                    await window.ethereum.enable();
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setIsWalletConnected(ethers.utils.isAddress(address));
                } catch (error) {
                    router.replace('/auth');
                }
            } else {
                router.replace('/auth');
            }
        };

        checkMetamaskInstallation();
    }, [router.push]);

    if (!isWalletConnected) {
        return <div className="w-full h-screen  flex justify-center items-center"><InitLoadingAnimation/></div>;
    }
    return (
        <WagmiConfig config={config}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
                <AlertProvider>
                    <ConformationPopupProvider>
                        <NextNProgress color="#E88778"/>
                        <Layout>
                            <Head>
                                <title>D-Verification</title>
                            </Head>
                            <Component {...pageProps} />
                            <Alert/>
                            <ConformationPopup/>
                        </Layout>
                    </ConformationPopupProvider>
                </AlertProvider>
            </SessionProvider>
        </WagmiConfig>
    );
}

export default MyApp;
