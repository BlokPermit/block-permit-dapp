import React, {FC, ReactNode, useEffect} from 'react';
import {AiOutlineFundProjectionScreen, HiOutlineDocumentSearch, RiDashboardFill} from "react-icons/all";
import {useRouter} from "next/router";
import Link from "next/link";


const Navigation: FC = () => {
    const { pathname } = useRouter();
    const adminRoutes: {
        label: string;
        href: string;
        icon: ReactNode;
    }[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: <RiDashboardFill size={25}/>,
        },
        {
            label: 'Projects',
            href: '/projects',
            icon: <AiOutlineFundProjectionScreen size={25}/>,
        },
        {
            label: 'Documents',
            href: '/documents',
            icon: <HiOutlineDocumentSearch size={25}/>,
        },
    ];

    useEffect(
        () => {
            console.log(pathname)
        }
    )

    return (
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-5">
            {adminRoutes.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 ${pathname == item.href ? 'bg-gray-100' : ''}`}
                >

                    <div className="pr-3">{item.icon}</div>
                    <span className="text-md font-medium"> {item.label} </span>
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;