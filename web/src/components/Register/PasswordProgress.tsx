import { useCallback, useMemo } from "react";
import { Progress } from "../ui/progress";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";

export default function PasswordProgress({ password }: { password: string }) {
  const handleProgress = useCallback(() => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#\$%\^&*\(\)_+\-=\[\]\{\}\'\";:\./\<\>,.\?]/.test(
      password,
    );
    const hasLength = password.length >= 8;

    return {
      values: { hasLowercase, hasUppercase, hasSpecial, hasLength },
      progress: [hasLowercase, hasUppercase, hasSpecial, hasLength].filter(
        Boolean,
      ).length,
    };
  }, [password]);

  const progress = useMemo(() => handleProgress(), [handleProgress]);

  const handleLabel = useCallback(() => {
    const message: Record<number, string> = {
      0: "Muito fraca",
      1: "Fraca",
      2: "Média",
      3: "Forte",
      4: "Muito forte",
    };
    return message[progress.progress];
  }, [progress]);

  const label = useMemo(() => handleLabel(), [handleLabel]);

  function PasswordRule({ valid, label }: { valid: boolean; label: string }) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full bg-black/10 duration-150 dark:bg-white/10",
            valid && "!bg-green-500/60",
          )}
        >
          {valid && <Check size={12} fontWeight={900} />}
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <section className="flex w-full items-center">
        <Progress
          value={progress.progress * 25}
          className="h-2 w-full rounded-lg bg-black/10 dark:bg-white/10"
        />
        <div className="ml-2 whitespace-nowrap text-sm text-gray-500">
          {label}
        </div>
      </section>
      <section className="w-full space-y-2">
        <PasswordRule
          valid={progress.values.hasLength}
          label="Deve possuir pelo menos 8 caracteres"
        />
        <PasswordRule
          valid={progress.values.hasLowercase}
          label="Deve possuir letras minúsculas"
        />
        <PasswordRule
          valid={progress.values.hasUppercase}
          label="Deve possuir letras maiúsculas"
        />
        <PasswordRule
          valid={progress.values.hasSpecial}
          label="Deve possuir caracteres especiais"
        />
      </section>
    </div>
  );
}
