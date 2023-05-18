import type {AppProps} from 'next/app';
import '../styles/globals.css'
import {Layout} from '@/components/layout/layout';
import Head from 'next/head';
import AuthProvider from "@/context/AuthContext";


function MyApp({Component, pageProps}: AppProps) {
    return (
        <AuthProvider>
            <Layout>
                <Head>
                    <title>D-Verification</title>
                </Head>
                <Component {...pageProps} />
            </Layout>
        </AuthProvider>
    );
}

export default MyApp;