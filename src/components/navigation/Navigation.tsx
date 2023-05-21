import React, {FC, ReactNode} from 'react';
import {AiOutlineFundProjectionScreen, HiOutlineDocumentSearch, RiDashboardLine} from "react-icons/all";
import {useRouter} from "next/router";
import Link from "next/link";


const Navigation: FC = () => {
    const {pathname} = useRouter();
    const adminRoutes: {
        label: string;
        href: string;
        icon: ReactNode;
    }[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: <RiDashboardLine size={26}/>,
        },
        {
            label: 'Projects',
            href: '/projects',
            icon: <AiOutlineFundProjectionScreen size={26}/>,
        },
        {
            label: 'Documents',
            href: '/documents',
            icon: <HiOutlineDocumentSearch size={26}/>,
        },
    ];

    return (
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-5">
            {adminRoutes.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-2 hover:text-main-200  px-4 py-2 text-gray-70 ${pathname == item.href ? 'border-r-4 border-main-200 rounded-sm' : ''}`}
                >

                    <div
                        className={`pr-2  ${pathname == item.href ? 'text-main-200' : ''}`}>{item.icon}</div>
                    <span
                        className={`text-lg  ${pathname == item.href ? 'text-main-200 font-bold' : ''}`}> {item.label} </span>
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;