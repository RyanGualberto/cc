import { LoaderCircle, Wallet } from "lucide-react";

const Loading = ({ label }: { label?: string }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="relative animate-pulse flex flex-col items-center gap-2">
        <LoaderCircle
          strokeWidth={0.3}
          className="absolute -left-18 -top-[44px] h-48 w-48 animate-spin"
        />
        <Wallet width={70} height={70} />
        <span className="text-lg font-bold">Recebee</span>
      </div>
      <h1 className="mt-4 text-2xl font-semibold">{label}</h1>
    </div>
  );
};

export { Loading };
