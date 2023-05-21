import {getSession} from "next-auth/react";
import cache from "memory-cache";

export const requireAuth = async (context: any, callback: any) => {
    const session = await getSessionData(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    callback();
}

async function getSessionData(context: any) {
    const cacheKey = 'session-data';

    const cachedSession = cache.get(cacheKey);
    if (cachedSession) {
        return cachedSession;
    }

    const session = await getSession(context);

    cache.put(cacheKey, session, 14400000); // Cache for 60 seconds (adjust the time as needed)

    return session;
}