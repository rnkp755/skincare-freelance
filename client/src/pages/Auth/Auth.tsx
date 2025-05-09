import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { Scan, Moon, Sun } from "lucide-react";

type AuthMode = "login" | "register";

const Auth: React.FC = () => {
	const [mode, setMode] = useState<AuthMode>("login");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { theme, toggleTheme } = useTheme();
	const { login, signup } = useAuth();
	const navigate = useNavigate();

	const toggleMode = () => {
		setMode(mode === "login" ? "register" : "login");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (mode === "login") {
				await login(email, password);
			} else {
				await signup(name, email, password);
			}
			navigate("/");
		} catch (error) {
			console.error("Authentication error:", error);
			alert("Authentication failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSkip = () => {
		// For demo purposes, allow skipping authentication
		if (mode === "login") {
			login("demo@example.com", "password").then(() => navigate("/"));
		} else {
			signup("Demo User", "demo@example.com", "password").then(() =>
				navigate("/")
			);
		}
	};

	return (
		<div
			className={`min-h-screen flex flex-col ${
				theme === "dark"
					? "bg-gray-900 text-white"
					: "bg-gray-50 text-gray-900"
			}`}
		>
			<div className="absolute top-4 right-4">
				<button
					onClick={toggleTheme}
					className={`p-2 rounded-full ${
						theme === "dark"
							? "bg-gray-800 text-gray-200"
							: "bg-white text-gray-700"
					} shadow-md`}
					aria-label="Toggle theme"
				>
					{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
				</button>
			</div>

			<div className="flex-1 flex flex-col items-center justify-center p-6">
				<div
					className={`w-full max-w-md p-8 rounded-xl shadow-xl ${
						theme === "dark" ? "bg-gray-800" : "bg-white"
					}`}
				>
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 text-white mb-4">
							<Scan size={32} />
						</div>
						<h1 className="text-2xl font-bold">SkinCare AI</h1>
						<p
							className={`mt-2 ${
								theme === "dark"
									? "text-gray-300"
									: "text-gray-600"
							}`}
						>
							{mode === "login"
								? "Sign in to your account"
								: "Create a new account"}
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{mode === "register" && (
							<Input
								label="Full Name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Raushan"
								required
								fullWidth
							/>
						)}

						<Input
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="email@example.com"
							required
							fullWidth
						/>

						<Input
							label="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							fullWidth
						/>

						<Button
							type="submit"
							variant="primary"
							fullWidth
							disabled={isLoading}
						>
							{isLoading
								? "Processing..."
								: mode === "login"
								? "Sign In"
								: "Sign Up"}
						</Button>

						<div className="mt-4 text-center">
							<Button
								type="button"
								variant="ghost"
								onClick={toggleMode}
							>
								{mode === "login"
									? "Don't have an account? Sign up"
									: "Already have an account? Sign in"}
							</Button>
						</div>

						<div className="mt-6 pt-4 border-t text-center">
							<Button
								type="button"
								variant="outline"
								onClick={handleSkip}
							>
								Skip for demo
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Auth;
