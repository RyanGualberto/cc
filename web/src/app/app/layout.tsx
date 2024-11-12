import Navbar from "~/components/shared/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
