import React, { FC, ReactNode } from 'react';
import Sidebar from "@/components/sidebar/Sidebar";
import {useRouter} from "next/router";

interface LayoutProps {
    children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const showSidebar = router.pathname !== '/auth';
    return (
        <div className={'flex flex-row h-screen bg-neutral-100'}>
            {showSidebar && <Sidebar />}
            <div className={'w-full'}>
                <main className={'py-10 px-20 w-full h-full'}>{children}</main>
            </div>
        </div>
    );
};