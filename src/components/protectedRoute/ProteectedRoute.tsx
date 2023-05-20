import React, {FC, ReactNode} from 'react';
import {useRouter} from 'next/router';
import {useUser} from '@/context/UserContext';

interface Props {
    children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({children}) => {
    const router = useRouter();
    const user = useUser();

    if (!user) {
        router.push('/auth');
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;