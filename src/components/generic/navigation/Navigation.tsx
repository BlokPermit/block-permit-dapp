import React, { FC, ReactNode } from "react";
import { AiOutlineFundProjectionScreen, AiOutlineUserAdd, RiDashboardLine } from "react-icons/all";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserType } from ".prisma/client";

const Navigation: FC = () => {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const routes: {
    label: string;
    href: string;
    icon: ReactNode;
    adminOnly?: boolean;
  }[] = [
    {
      label: "Nadzorna plošča",
      href: "/dashboard",
      icon: <RiDashboardLine size={24} />,
    },
    {
      label: "Projekti",
      href: "/projects",
      icon: <AiOutlineFundProjectionScreen size={24} />,
    },

    {
      label: "Dodaj uporabnike",
      href: "/addUser",
      icon: <AiOutlineUserAdd size={24} />,
      adminOnly: true,
    },
  ];

  const adminRoutes = routes.filter((route) => {
    if (route.adminOnly) {
      return session?.user?.userType === UserType.ADMIN;
    }
    return true;
  });

  return (
    <nav aria-label="Main Nav" className=" flex ">

      {adminRoutes.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`flex items-center gap-2 hover:text-main-200 px-5 text-gray-70 ${pathname.split("/").slice(0, 2).join("/") == item.href ? "border-b-2 border-main-200 rounded-sm" : ""}`}
        >
          <div className={`pr-2  ${pathname.split("/").slice(0, 2).join("/") == item.href ? "text-main-200" : ""}`}>{item.icon}</div>
          <span className={`text-md ${pathname.split("/").slice(0, 2).join("/") == item.href ? "text-main-200 font-semibold" : ""}`}> {item.label} </span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
