import { Suspense } from "react";
import Navbar from "~/components/shared/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />
        {children}
      </div>
    </Suspense>
  );
}
