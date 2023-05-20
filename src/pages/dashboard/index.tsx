import React from 'react';
import {getSession} from "next-auth/react";
import cache from "memory-cache";
import DocumentPlaceholder from "@/components/placeholders/DocumentPlaceholder";
import ProjectPlaceholder from "@/components/placeholders/ProjectPlaceholder";

const Dashboard = () => {
    return (<div className="px-12 pt-6">
        <div className="mt-2">
            <h1 className="text-neutral-500 text-2xl font-semibold">Recent projects</h1>
            <div className="flex flex-wrap mt-3">
                {Array.from({length: 3}).map(() => (
                    <ProjectPlaceholder/>
                ))}</div>
        </div>
        <div className="mt-10">
            <div className="flex items-center">
                <h1 className="text-neutral-500 text-2xl font-semibold mr-3">Awaiting approval</h1><span
                className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700  h-1/4 mt-0.5"
            >
            <p className="whitespace-nowrap text-sm">1 new project</p>
            </span>
            </div>
            <div className="flex flex-wrap mt-3">
                {Array.from({length: 5}).map(() => (
                    <ProjectPlaceholder/>
                ))}</div>
        </div>
        <div className="mt-10">
            <h1 className="text-neutral-500 text-2xl font-semibold mt-10">Recent document</h1>
            <div className="flex flex-wrap mt-3">
                {Array.from({length: 3}).map(() => (
                    <DocumentPlaceholder/>
                ))}</div>
        </div>

    </div>);
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