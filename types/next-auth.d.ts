import 'next-auth'
import {UserType} from ".prisma/client";

declare module 'next-auth' {
    interface Session {
        user: User
    }

    interface User {
        id?: number | null
        name?: string | null
        phone?: string | null
        email?: string | null
        image?: string | null
        userType?: UserType | null
        walletAddress?: string | null
        streetAddress?: string | null
    }
}