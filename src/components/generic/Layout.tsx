import React, { FC, ReactNode } from "react";
import Sidebar from "@/components/generic/navigation/Sidebar";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  let showSidebar = false;

  if (router.pathname != "/auth" && router.pathname != "/") showSidebar = true;

  if (showSidebar) {
    return (
      <div className="flex flex-col h-screen bg-neutral-50 bg-blend-lighten">
        <div className=""><Sidebar/></div>
          <main className={"w-full h-full"}>{children}</main>
      </div>
    );
  } else {
    return <div className="w-full h-screen  flex justify-center items-center">{children}</div>;
  }
};
