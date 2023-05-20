import React from 'react';
import {getSession} from "next-auth/react";
import cache from "memory-cache";

const Dashboard = () => {

    return (<div className="px-12 pt-6">
        <div className="mt-2">
            <h1 className="text-neutral-500 text-2xl font-semibold">Recent projects</h1>
            <div className="flex flex-wrap mt-3">
                {Array.from({length: 3}).map((_, index) => (
                    <div key={index} className="border border-neutral-200 shadow rounded-md p-5 max-w-sm w-full mr-6 my-2">
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-neutral-300 h-10 w-10"></div>
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 bg-neutral-300 rounded"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-neutral-300 rounded col-span-2"></div>
                                        <div className="h-2 bg-neutral-300 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-neutral-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}</div>
        </div>
        <div className="mt-10">
            <div className="flex items-center">
                <h1 className="text-neutral-500 text-2xl font-semibold mr-3">Awaiting your approval</h1><span
                className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700  h-1/4 mt-0.5"
            >
            <p className="whitespace-nowrap text-sm">1 new project</p>
            </span>
            </div>
            <div className="flex flex-wrap mt-3">
                {Array.from({length: 5}).map((_, index) => (
                    <div key={index} className="border border-neutral-200 shadow rounded-md p-5 max-w-sm w-full mr-6 my-2">
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-neutral-300 h-10 w-10"></div>
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 bg-neutral-300 rounded"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-neutral-300 rounded col-span-2"></div>
                                        <div className="h-2 bg-neutral-300 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-neutral-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}</div>
        </div>
        <div className="mt-10">
            <h1 className="text-neutral-500 text-2xl font-semibold mt-10">Recent document</h1>
            <div className="flex flex-wrap mt-3">
                {Array.from({length: 3}).map((_, index) => (
                    <div key={index} className="border border-neutral-200 shadow rounded-md p-5 max-w-xs w-full mr-6 my-2 ">
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 bg-neutral-300 rounded"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-neutral-300 rounded col-span-2"></div>
                                        <div className="h-2 bg-neutral-300 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-neutral-300 rounded"></div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-neutral-300 rounded col-span-2"></div>
                                        <div className="h-2 bg-neutral-300 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-neutral-300 rounded"></div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-neutral-300 rounded col-span-2"></div>
                                        <div className="h-2 bg-neutral-300 rounded col-span-1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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