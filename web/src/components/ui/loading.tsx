import Image from "next/image";
import Logo from "~/assets/images/logo-without-bg.svg";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import { LoaderCircle } from "lucide-react";

const Loading = ({ label }: { label?: string }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="relative animate-pulse">
        <LoaderCircle
          strokeWidth={0.3}
          className="absolute -left-14 -top-14 h-72 w-72 animate-spin"
        />

        <Image src={Logo as StaticImport} alt="Logo" width={180} height={180} />
      </div>
      <h1 className="mt-4 text-2xl font-semibold">{label}</h1>
    </div>
  );
};

export { Loading };
