import { configureChains, WagmiConfig, createConfig} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import { mainnet } from "wagmi/chains";
import {AppProps} from "next/app";
import React from "react";
import "../styles/globals.css";
import {Layout} from "@/components/layout/Layout";
import Head from "next/head";
import {UserProvider} from "@/context/UserContext";

const { publicClient, webSocketPublicClient } = configureChains(
    [mainnet],
    [publicProvider()],
)

const config = createConfig({
    publicClient,
    webSocketPublicClient,
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig config={config}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
                <UserProvider>
                <Layout>
                    <Head>
                        <title>D-Verification</title>
                    </Head>
                    <Component {...pageProps} />
                </Layout>
                </UserProvider>
            </SessionProvider>
        </WagmiConfig>
    );
}

export default MyApp;