import {ReactNode} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {UserType} from ".prisma/client";

interface RoleBasedProps {
    adminComponent?: ReactNode | null;
    administrativeAuthorityComponent?: ReactNode | null;
    opinionProviderComponent?: ReactNode | null;
    projectManagerComponent?: ReactNode | null;
}

const RoleBasedComponent = ({
                                adminComponent = null,
                                administrativeAuthorityComponent = null,
                                opinionProviderComponent = null,
                                projectManagerComponent = null
                            }: RoleBasedProps) => {
    const {data, status} = useSession();
    const router = useRouter();

    if (status == 'loading') return <p>Loading...</p>;

    if (!data) {
        router.push('/auth');
        return <></>;
    } else {
        switch (data?.user?.userType) {
            case UserType.ADMIN:
                return <>{adminComponent}</>;
            case UserType.ADMINISTRATIVE_AUTHORITY:
                return <>{administrativeAuthorityComponent}</>;
            case UserType.OPINION_PROVIDER:
                return <>{opinionProviderComponent}</>;
            case UserType.PROJECT_MANAGER:
                return <>{projectManagerComponent}</>;
            default:
                router.push('/auth');
                return <></>;
        }
    }
};

export default RoleBasedComponent;