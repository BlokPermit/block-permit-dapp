import React, { FC, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LoadingAnimation } from "@/components/generic/loading-animation/LoadingAnimation";

interface Props {
  children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
  const { status } = useSession();
  const { push } = useRouter();

  if (status === "loading") {
    return <LoadingAnimation />;
  }

  if (status === "unauthenticated") {
    push("/auth");
  }
  return <>{children}</>;
};

export default ProtectedRoute;
