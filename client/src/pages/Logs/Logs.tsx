import React, { useState } from "react";
import { format, subDays, parseISO } from "date-fns";
import Card from "../../components/UI/Card";
import RoutineChart from "../../components/Logs/RoutineChart";
import { useLog } from "../../contexts/LogContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

const Logs: React.FC = () => {
	const { logs, routines, completionRate, getLogsByDate, getRoutineById } =
		useLog();
	const { theme } = useTheme();
	const [selectedDate, setSelectedDate] = useState<string>(
		format(new Date(), "yyyy-MM-dd")
	);

	// Get logs for selected date
	const dayLogs = getLogsByDate(selectedDate);
	const dayRoutine = routines.find((r) => r.date === selectedDate);

	// Generate last 7 days for date picker
	const last7Days = Array.from({ length: 10 }, (_, i) => {
		const date = subDays(new Date(), i);
		return format(date, "yyyy-MM-dd");
	});

	const handleDateSelect = (date: string) => {
		setSelectedDate(date);
	};

	return (
		<div className="space-y-6 max-w-6xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Routine Logs</h1>

			<Card className="animate-fade-in">
				<div className="flex flex-col sm:flex-row items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Overall Progress</h2>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					<div className="flex items-center justify-center">
						<RoutineChart completionRate={completionRate} />
					</div>

					<div className="flex flex-col justify-center">
						<div className="mb-4 self-center sm:self-auto">
							<p className="font-medium">Completion Rate</p>
							<p className="text-3xl font-bold text-teal-600 dark:text-teal-400 text-center sm:text-left">
								{Math.round(completionRate)}%
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Completed Steps
								</p>
								<p className="font-medium text-lg">
									{logs.filter((log) => log.completed).length}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Total Steps
								</p>
								<p className="font-medium text-lg">
									{logs.length}
								</p>
							</div>
						</div>
					</div>
				</div>
			</Card>
			<div
				className="flex gap-2 mb-6 overflow-x-auto pb-2"
				style={{ scrollbarWidth: "none" }}
			>
				// Hide scrollbar for Firefox
				<style>
					{`
						::-webkit-scrollbar {
							display: none;
						}
					`}
				</style>
				{last7Days.map((date) => {
					const isActive = date === selectedDate;
					const day = format(parseISO(date), "E");
					const dateNum = format(parseISO(date), "d");

					return (
						<button
							key={date}
							onClick={() => handleDateSelect(date)}
							className={`
				flex flex-col items-center justify-center rounded-full w-12 h-12 transition-colors flex-shrink-0
				${
					isActive
						? "bg-teal-500 text-white"
						: theme === "dark"
						? "bg-gray-800 text-gray-300 hover:bg-gray-700"
						: "bg-white text-gray-800 hover:bg-gray-100"
				}
			  `}
						>
							<span className="text-xs">{day}</span>
							<span className="text-sm font-medium">
								{dateNum}
							</span>
						</button>
					);
				})}
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-4">
					<Calendar size={18} className="text-gray-500" />
					<h2 className="text-lg font-medium">
						{format(parseISO(selectedDate), "MMMM d, yyyy")}
					</h2>
				</div>

				{dayLogs.length > 0 ? (
					<div className="space-y-4">
						{dayLogs.map((log) => {
							const routine = getRoutineById(log.routineId);
							const step = routine?.steps.find(
								(s) => s.id === log.stepId
							);

							return (
								<Card
									key={log.id}
									className="border-l-4 border-l-teal-500"
								>
									<div className="flex items-start justify-between">
										<div>
											<h3 className="font-medium">
												{step?.description}
											</h3>
											<div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
												<Clock size={14} />
												<span>
													{format(
														parseISO(log.timestamp),
														"h:mm a"
													)}
												</span>
												<span className="capitalize">
													{step?.timeOfDay}
												</span>
											</div>
										</div>

										{log.completed ? (
											<CheckCircle
												className="text-green-500"
												size={24}
											/>
										) : (
											<XCircle
												className="text-red-500"
												size={24}
											/>
										)}
									</div>

									{log.completed && log.photoUrl && (
										<div className="mt-3">
											<p className="text-sm font-medium mb-1">
												Photo:
											</p>
											<img
												src={log.photoUrl}
												alt="Skin condition"
												className="w-16 h-16 object-cover rounded"
											/>
										</div>
									)}

									{!log.completed && log.reason && (
										<div className="mt-3">
											<p className="text-sm font-medium mb-1">
												Reason:
											</p>
											<p className="text-sm">
												{log.reason}
											</p>
										</div>
									)}
								</Card>
							);
						})}
					</div>
				) : (
					<div
						className={`p-8 rounded-lg text-center ${
							theme === "dark" ? "bg-gray-800" : "bg-gray-100"
						}`}
					>
						<p className="text-gray-500 dark:text-gray-400">
							No logs for this date
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Logs;
