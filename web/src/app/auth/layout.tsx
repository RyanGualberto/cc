"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserContext } from "~/hooks/use-user-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loadingUser } = useUserContext();
  const { push } = useRouter();

  useEffect(() => {
    if (Boolean(!loadingUser) && user) {
      push("/app/teams");
    }
  }, [user, push, loadingUser]);

  return <div className="flex min-h-screen flex-1 flex-col">{children}</div>;
}
