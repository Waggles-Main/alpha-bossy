import React from 'react';
import { clsx } from 'clsx';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const GameButton = ({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: GameButtonProps) => {

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white border-blue-800",
        success: "bg-[#38A169] hover:bg-[#2F855A] text-white border-[#22543d]",
        danger: "bg-[#FE5F55] hover:bg-[#e6554c] text-white border-red-800",
        warning: "bg-yellow-600 hover:bg-yellow-500 text-white border-yellow-800",
        secondary: "bg-gray-500 hover:bg-gray-400 text-white border-gray-700"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-lg",
        lg: "w-full py-4 text-2xl"
    };

    return (
        <button
            className={clsx(
                "font-bold rounded-lg transition-all shadow-lg active:mt-1",
                "border-b-4 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:mt-0 disabled:border-b-4",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
