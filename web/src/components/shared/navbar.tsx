import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "~/assets/images/logo-with-lateral-text.svg";
import { BellRing, LogOut, Settings, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";

const Navbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between border-b px-8 py-4">
      <Link href={"/app/dashboard"}>
        <Image src={Logo as StaticImport} alt="Logo" width={130} height={40} />
      </Link>
      <nav className="flex items-center gap-6">
        <Popover>
          <PopoverTrigger>
            <BellRing size={20} />
          </PopoverTrigger>
          <PopoverContent align="center" className="max-w-56">
            <div className="flex w-full items-center justify-center">
              <span className="w-full text-center text-xs opacity-70">
                Você não possui nenhuma notificação no momento.
              </span>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage
                src="/images/avatar.png"
                alt="Avatar"
                width={40}
                height={40}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent align="end" className="max-w-48">
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/app/profile" className="flex items-center gap-2">
                  <User size={16} />
                  <span className="text-sm">Perfil</span>
                </Link>
              </li>
              <li>
                <Link href="/app/settings" className="flex items-center gap-2">
                  <Settings size={16} />
                  <span className="text-sm">Configurações</span>
                </Link>
              </li>
              <li>
                <Link href="/app/logout" className="flex items-center gap-2">
                  <LogOut size={16} />
                  <span className="text-sm">Sair</span>
                </Link>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </nav>
    </header>
  );
};

export default Navbar;
