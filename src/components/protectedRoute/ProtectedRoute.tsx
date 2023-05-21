import React, {FC, ReactNode} from 'react';
import {requireAuth} from "@/components/protectedRoute/RequireAuth";

interface Props {
    children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({children}) => {
    return <>{children}</>;
};

export async function getServerSideProps(context: any) {
    return requireAuth(context, ({session}: any) => {
        return {
            props: {session}
        }
    })
}

export default ProtectedRoute;