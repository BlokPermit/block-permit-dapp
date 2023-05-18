import type {AppProps} from 'next/app';
import '../styles/globals.css'
import {Layout} from '@/components/layout/layout';
import Head from 'next/head';


function MyApp({Component, pageProps}: AppProps) {
    return (
        <Layout>
            <Head>
                <title>D-Verification</title>
            </Head>
            <Component {...pageProps} />
        </Layout>

    );
}

export default MyApp;