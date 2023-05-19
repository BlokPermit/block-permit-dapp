import React from 'react';
import {getSession} from "next-auth/react";

const Dashboard = () => {

    return (
        <div className="text-black">Hello you are on page Dashboard.</div>
    );
};

export async function getServerSideProps(context: any) {
    const session = await getSession(context);



    // redirect if not authenticated
    if (!session) {
        console.log('no session', session);
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    console.log('is session', session.expires);

    return {
        props: { user: session.user },
    };
}

export default Dashboard;