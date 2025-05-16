import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="flex min-h-screen flex-1 flex-col">{children}</div>
    </Suspense>
  );
}
