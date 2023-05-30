import React, { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Alert from "@/components/notifications/Alert";
import InitLoadingAnimation from "@/components/generic/loading-animation/InitLoadingAnimation";

interface Props {
  children: ReactNode;
}

function Root({ children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  }, [status, session, router.push]);

  return <InitLoadingAnimation />;
}

export default Root;
