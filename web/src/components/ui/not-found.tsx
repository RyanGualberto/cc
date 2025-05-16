import { useTheme } from "next-themes";
import { LoaderCircle, Wallet } from "lucide-react";
import Show from "../utils/show";

const NotFound = ({ label }: { label: string }) => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="relative animate-pulse">
        <LoaderCircle
          strokeWidth={0.3}
          className="absolute -left-14 -top-14 h-72 w-72 animate-spin"
        />
        <Show
          when={theme === "dark"}
          component={<Wallet width={180} height={180} />}
          fallback={<Wallet width={180} height={180} />}
        />
      </div>
      <h1 className="mt-4 text-2xl font-semibold">{label}</h1>
    </div>
  );
};

export { NotFound };
