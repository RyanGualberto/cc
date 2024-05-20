'use client'
import 'regenerator-runtime/runtime'
import * as React from 'react'
import { cn } from '~/lib/utils';
import { Eye, EyeOff, type LucideProps } from 'lucide-react';

export type InputProps = {
  Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  error?: string
  label?: string
  labelClassName?: string
  containerClassName?: string
  allowAudio?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      Icon,
      error,
      className,
      type,
      containerClassName,
      // allowAudio,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    return (
      <div className="flex flex-col gap-2 w-full">
        <div
          className={cn(
            'flex items-center gap-3 h-12 w-full rounded-md border border-black/20 dark:border-white/20 bg-white dark:bg-[#1A1A1A] px-3 py-1 text-sm shadow-sm',
            error && 'border-red-500 dark:border-red-400',
            containerClassName,
          )}
        >
          {Icon && (
            <Icon
              size={24}
              opacity={0.8}
              className={cn(
                error && 'text-destructive dark:text-red-400'
              )}
            />
          )}
          <input
            type={type === 'password' && showPassword ? 'text' : type ?? 'text'}
            className={cn(
              'w-full h-full bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 outline-none',
              className,
            )}
            ref={ref}
            {...props}
          />

          {type === 'password' &&
            (showPassword ? (
              <Eye
                size={24}
                opacity={0.5}
                className={cn(
                  error && 'text-destructive dark:text-red-400'
                )}
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOff
                size={24}
                opacity={0.5}
                className={cn(
                  error && 'text-destructive dark:text-red-400'
                )}
                onClick={() => setShowPassword(!showPassword)}
              />
            ))}
        </div>
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
