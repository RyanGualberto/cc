import { Suspense } from "react";
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
        {children}
      </div>
    </Suspense>
  );
}
