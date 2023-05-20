import React, {FC, ReactNode} from 'react';
import Sidebar from "@/components/sidebar/Sidebar";
import {useRouter} from "next/router";

interface LayoutProps {
    children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({children}) => {
    const router = useRouter();
    const showSidebar = router.pathname !== '/auth';
    return (
        <div className='flex flex-row h-screen bg-neutral-50'>
            {showSidebar && <div className="w-1/6"><Sidebar/></div>}
            <div className={'w-5/6'}>
                <main className={' w-full h-full'}>{children}</main>
            </div>
        </div>
    );
};