import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, MessageCircle, CalendarCheck, User } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface NavItem {
	path: string;
	label: string;
	icon: React.ReactNode;
}

const Navbar: React.FC = () => {
	const { theme, colors } = useTheme();
	const location = useLocation();

	const navItems: NavItem[] = [
		{ path: "/", label: "Home", icon: <Home size={24} /> },
		{ path: "/chat", label: "Chat", icon: <MessageCircle size={24} /> },
		{ path: "/logs", label: "Logs", icon: <CalendarCheck size={24} /> },
		{ path: "/profile", label: "Profile", icon: <User size={24} /> },
	];

	const activeClass = `text-${colors.primary} border-${colors.primary}`;
	const inactiveClass =
		theme === "dark"
			? "text-gray-400 hover:text-gray-300 border-transparent"
			: "text-gray-500 hover:text-gray-700 border-transparent";

	return (
		<nav
			className={`fixed bottom-0 left-0 right-0 z-50 ${
				theme === "dark" ? "bg-gray-800" : "bg-white"
			} shadow-lg md:shadow-none md:top-0 md:bottom-auto`}
		>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between py-2 md:py-4 max-w-xl mx-auto">
					{navItems.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							className={({ isActive }) => `
                flex flex-col items-center p-2 border-b-2 transition-colors duration-200
                ${isActive ? activeClass : inactiveClass}
                md:flex-row md:gap-2
              `}
						>
							{item.icon}
							<span className="text-xs mt-1 md:text-sm md:mt-0">
								{item.label}
							</span>
						</NavLink>
					))}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
