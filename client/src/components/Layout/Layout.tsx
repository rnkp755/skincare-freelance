import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useTheme } from "../../contexts/ThemeContext";

const Layout: React.FC = () => {
	const { theme } = useTheme();

	return (
		<div
			className={`min-h-screen font-sans ${
				theme === "dark"
					? "bg-gray-900 text-white"
					: "bg-gray-50 text-gray-900"
			}`}
		>
			<Navbar />
			<main className="container mx-auto px-8 pb-20 pt-5 md:pt-24">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
