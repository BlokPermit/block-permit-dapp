import NextAuth from "next-auth";
import {MoralisNextAuthProvider} from "@moralisweb3/next";

export default NextAuth({
    providers: [MoralisNextAuthProvider()],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.user = user;
            }
            console.log(user);
            return token;
        },
        async session({session, token}) {
            (session as { user: unknown }).user = token.user;
            return session;
        },
    },
});