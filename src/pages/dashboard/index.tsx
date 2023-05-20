import React from 'react';
import {getSession} from "next-auth/react";
import cache from "memory-cache";

const Dashboard = () => {
    return (
        <h1 className="text-black text-3xl font-semibold">Dashboard</h1>
    );
};

export async function getServerSideProps(context: any) {
    const session = await getSessionData(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    return {
        props: {}
    }
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

export default Dashboard;