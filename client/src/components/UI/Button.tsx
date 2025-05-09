import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "md",
	fullWidth = false,
	children,
	className = "",
	...props
}) => {
	const baseClasses =
		"font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variants = {
		primary:
			"bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
		secondary:
			"bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400",
		outline:
			"border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 dark:hover:bg-indigo-900/20 dark:border-indigo-500 dark:text-indigo-400",
		ghost: "text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/20",
		danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
	};

	const sizes = {
		sm: "text-xs py-1 px-3",
		md: "text-sm py-2 px-4",
		lg: "text-base py-3 px-6",
	};

	const widthClass = fullWidth ? "w-full" : "";

	return (
		<button
			className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
