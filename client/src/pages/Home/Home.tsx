import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLog } from "../../contexts/LogContext";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import RoutineChart from "../../components/Logs/RoutineChart";
import RoutineForm from "../../components/Logs/RoutineForm";
import { MessageSquare, ChevronRight } from "lucide-react";

const Home: React.FC = () => {
	const { user } = useAuth();
	const {
		completionRate,
		pendingSteps,
		todaysRoutine,
		canLogRoutine,
		logRoutineStep,
	} = useLog();
	const navigate = useNavigate();

	const handleRoutineComplete = (
		stepId: string,
		completed: boolean,
		photoUrl?: string,
		reason?: string
	) => {
		logRoutineStep(stepId, completed, photoUrl, reason);
	};

	const goToChat = () => {
		navigate("/chat");
	};

	// Find first pending step that can be logged based on time of day
	const currentStep = pendingSteps.find((step) =>
		canLogRoutine(step.timeOfDay)
	);

	return (
		<div className="space-y-6 max-w-6xl mx-auto">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">
						Welcome, {user?.name}
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						{new Date().toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}
					</p>
				</div>

				<Button
					variant="primary"
					onClick={goToChat}
					className="flex items-center gap-2"
				>
					<MessageSquare size={18} />
					<span>New Consultation</span>
				</Button>
			</div>

			{currentStep && (
				<Card className="bg-gradient-to-r from-teal-500 to-blue-500 text-white animate-fade-in">
					<h2 className="text-xl font-semibold mb-4">
						Complete Today's Routine
					</h2>
					<RoutineForm
						step={currentStep}
						onComplete={(completed, photoUrl, reason) =>
							handleRoutineComplete(
								currentStep.id,
								completed,
								photoUrl,
								reason
							)
						}
					/>
				</Card>
			)}

			<Card className="animate-fade-in">
				<div className="flex flex-col sm:flex-row items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Routine Adherence</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/logs")}
						className="flex items-center gap-1"
					>
						<span>View all logs</span>
						<ChevronRight size={16} />
					</Button>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					<div className="flex items-center justify-center">
						<RoutineChart completionRate={completionRate} />
					</div>

					<div className="flex flex-col justify-center">
						<h3 className="font-medium mb-2">Your Progress</h3>
						<p className="mb-4">
							You've completed{" "}
							<span className="font-semibold text-teal-600 dark:text-teal-400">
								{Math.round(completionRate)}%
							</span>{" "}
							of your skincare routine steps.
							{completionRate > 75
								? " Great job keeping up with your routine!"
								: " Keep going to see better results!"}
						</p>

						{completionRate < 100 && (
							<Button
								variant="primary"
								size="lg"
								onClick={() => navigate("/logs")}
							>
								Complete today's routine
							</Button>
						)}
					</div>
				</div>
			</Card>

			<Card className="animate-fade-in delay-75">
				<h2 className="text-xl font-semibold mb-4">
					Recent Consultation
				</h2>
				<div
					className="cursor-pointer border rounded-lg p-4 transition-all hover:shadow-md dark:border-gray-700"
					onClick={goToChat}
				>
					<div className="flex justify-between items-center">
						<div>
							<h3 className="font-medium">Skin Assessment</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Yesterday
							</p>
						</div>
						<ChevronRight className="text-gray-400" />
					</div>
					<p className="mt-2 text-sm line-clamp-2">
						Based on your photos, I've identified mild acne with
						some dryness. I've suggested a gentle routine with
						moisturizing and acne-fighting ingredients...
					</p>
				</div>
			</Card>
		</div>
	);
};

export default Home;
