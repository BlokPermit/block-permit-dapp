import React, { FC, ReactNode } from 'react';
import Sidebar from "@/components/sidebar/sidebar";





interface LayoutProps {
    children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className={'flex flex-row h-screen'}>
            <Sidebar />
            <div className={'w-full'}>
                <main className={'py-10 px-20 w-full'}>{children}</main>
            </div>
        </div>
    );
};