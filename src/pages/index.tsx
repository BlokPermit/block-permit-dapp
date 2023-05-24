import React, {ReactNode, useEffect} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';

interface Props {
    children: ReactNode;
}

function Root({children}: Props) {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session) {
            router.push('/dashboard');
        }
    }, [status, session, router.push]);

    return <div>{children}</div>;
}

export default Root;