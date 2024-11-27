import Image from "next/image";
import Logo from "~/assets/images/logo-without-bg.svg";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import { LoaderCircle } from "lucide-react";

const Loading = () => {
  console.log("here5");
  
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="relative animate-pulse">
        <LoaderCircle
          strokeWidth={0.3}
          className="absolute -left-14 -top-14 h-72 w-72 animate-spin"
        />

        <Image src={Logo as StaticImport} alt="Logo" width={180} height={180} />
      </div>
    </div>
  );
};

export { Loading };
