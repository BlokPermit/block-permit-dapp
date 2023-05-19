import { MoralisNextApi } from "@moralisweb3/next";


export default MoralisNextApi({
    // @ts-ignore
    apiKey: process.env.MORALIS_API_KEY,
    authentication: {
        domain: "document.verification.dApp",
        // @ts-ignore
        uri: process.env.NEXTAUTH_URL,
        timeout: 120,
    },
});