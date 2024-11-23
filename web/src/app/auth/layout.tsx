import { Suspense } from "react";
import Navbar from "~/components/shared/navbar";
import { Loading } from "~/components/ui/loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loading />
        </div>
      }
    >
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />
        {children}
      </div>
    </Suspense>
  );
}
