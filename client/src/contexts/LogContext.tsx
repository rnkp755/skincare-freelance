import React, { createContext, useState, useContext, useEffect } from "react";
import { format, isWithinInterval, setHours } from "date-fns";
import { useAuth } from "./AuthContext";

export interface RoutineStep {
	id: string;
	description: string;
	timeOfDay: "morning" | "afternoon" | "evening";
}

export interface Medicine {
	id: string;
	name: string;
	dosage: string;
	frequency: string;
	image: string;
}

export interface Routine {
	id: string;
	date: string;
	steps: RoutineStep[];
	medicines: Medicine[];
}

export interface LogEntry {
	id: string;
	date: string;
	routineId: string;
	stepId: string;
	completed: boolean;
	photoUrl?: string;
	reason?: string;
	timestamp: string;
}

interface LogContextType {
	routines: Routine[];
	logs: LogEntry[];
	completionRate: number;
	todaysRoutine: Routine | null;
	pendingSteps: RoutineStep[];
	canLogRoutine: (timeOfDay: "morning" | "afternoon" | "evening") => boolean;
	logRoutineStep: (
		stepId: string,
		completed: boolean,
		photoUrl?: string,
		reason?: string
	) => void;
	getLogsByDate: (date: string) => LogEntry[];
	getRoutineById: (id: string) => Routine | undefined;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

// Mock data
const mockRoutines: Routine[] = [
	{
		id: "1",
		date: format(new Date(), "yyyy-MM-dd"),
		steps: [
			{
				id: "s1",
				description: "Wash face with gentle cleanser",
				timeOfDay: "morning",
			},
			{
				id: "s2",
				description: "Apply vitamin C serum",
				timeOfDay: "morning",
			},
			{
				id: "s3",
				description: "Apply moisturizer with SPF",
				timeOfDay: "morning",
			},
			{
				id: "s4",
				description: "Wash face with gentle cleanser",
				timeOfDay: "evening",
			},
			{
				id: "s5",
				description: "Apply retinol serum",
				timeOfDay: "evening",
			},
			{
				id: "s6",
				description: "Apply night moisturizer",
				timeOfDay: "evening",
			},
		],
		medicines: [
			{
				id: "m1",
				name: "Adapalene Gel",
				dosage: "0.1%",
				frequency: "Once daily at night",
				image: "https://images.pexels.com/photos/139398/himalayas-mountains-nepal-himalaya-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			},
			{
				id: "m2",
				name: "Benzoyl Peroxide",
				dosage: "2.5%",
				frequency: "Twice daily",
				image: "https://images.pexels.com/photos/7719609/pexels-photo-7719609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			},
			{
				id: "m3",
				name: "Hyaluronic Acid Serum",
				dosage: "2%",
				frequency: "Twice daily",
				image: "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			},
		],
	},
	{
		id: "2",
		date: format(new Date(Date.now() - 86400000), "yyyy-MM-dd"), // Yesterday
		steps: [
			{
				id: "s7",
				description: "Wash face with gentle cleanser",
				timeOfDay: "morning",
			},
			{
				id: "s8",
				description: "Apply vitamin C serum",
				timeOfDay: "morning",
			},
			{
				id: "s9",
				description: "Apply moisturizer with SPF",
				timeOfDay: "morning",
			},
			{
				id: "s10",
				description: "Wash face with gentle cleanser",
				timeOfDay: "evening",
			},
			{
				id: "s11",
				description: "Apply retinol serum",
				timeOfDay: "evening",
			},
			{
				id: "s12",
				description: "Apply night moisturizer",
				timeOfDay: "evening",
			},
		],
		medicines: [
			{
				id: "m4",
				name: "Adapalene Gel",
				dosage: "0.1%",
				frequency: "Once daily at night",
				image: "https://images.pexels.com/photos/139398/himalayas-mountains-nepal-himalaya-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			},
			{
				id: "m5",
				name: "Benzoyl Peroxide",
				dosage: "2.5%",
				frequency: "Twice daily",
				image: "https://images.pexels.com/photos/7719609/pexels-photo-7719609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			},
		],
	},
];

const mockLogs: LogEntry[] = [
	{
		id: "l1",
		date: format(new Date(Date.now() - 86400000), "yyyy-MM-dd"), // Yesterday
		routineId: "2",
		stepId: "s7",
		completed: true,
		photoUrl:
			"https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
		timestamp: new Date(Date.now() - 86400000 + 28800000).toISOString(), // 8AM yesterday
	},
	{
		id: "l2",
		date: format(new Date(Date.now() - 86400000), "yyyy-MM-dd"), // Yesterday
		routineId: "2",
		stepId: "s8",
		completed: true,
		photoUrl:
			"https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
		timestamp: new Date(Date.now() - 86400000 + 28900000).toISOString(), // 8:01AM yesterday
	},
	{
		id: "l3",
		date: format(new Date(Date.now() - 86400000), "yyyy-MM-dd"), // Yesterday
		routineId: "2",
		stepId: "s9",
		completed: true,
		photoUrl:
			"https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
		timestamp: new Date(Date.now() - 86400000 + 29000000).toISOString(), // 8:03AM yesterday
	},
	{
		id: "l4",
		date: format(new Date(Date.now() - 86400000), "yyyy-MM-dd"), // Yesterday
		routineId: "2",
		stepId: "s10",
		completed: false,
		reason: "Was too tired",
		timestamp: new Date(Date.now() - 86400000 + 72000000).toISOString(), // 8PM yesterday
	},
];

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { user } = useAuth();
	const [routines, setRoutines] = useState<Routine[]>(mockRoutines);
	const [logs, setLogs] = useState<LogEntry[]>(mockLogs);

	// Get today's routine
	const todaysRoutine =
		routines.find((r) => r.date === format(new Date(), "yyyy-MM-dd")) ||
		null;

	// Calculate completion rate
	const completionRate =
		logs.length > 0
			? (logs.filter((log) => log.completed).length / logs.length) * 100
			: 0;

	// Get pending steps for today
	const pendingSteps = todaysRoutine
		? todaysRoutine.steps.filter((step) => {
				return !logs.some(
					(log) =>
						log.date === format(new Date(), "yyyy-MM-dd") &&
						log.stepId === step.id
				);
		  })
		: [];

	// Check if a routine can be logged based on time of day
	const canLogRoutine = (
		timeOfDay: "morning" | "afternoon" | "evening"
	): boolean => {
		// const now = new Date();

		// const timeRanges = {
		// 	morning: { start: setHours(now, 6), end: setHours(now, 11) },
		// 	afternoon: { start: setHours(now, 11), end: setHours(now, 17) },
		// 	evening: { start: setHours(now, 17), end: setHours(now, 23) },
		// };

		// return isWithinInterval(now, {
		// 	start: timeRanges[timeOfDay].start,
		// 	end: timeRanges[timeOfDay].end,
		// });
		return true;
	};

	// Log a routine step
	const logRoutineStep = (
		stepId: string,
		completed: boolean,
		photoUrl?: string,
		reason?: string
	) => {
		const date = format(new Date(), "yyyy-MM-dd");
		const newLog: LogEntry = {
			id: `l${logs.length + 1}`,
			date,
			routineId: todaysRoutine?.id || "",
			stepId,
			completed,
			photoUrl,
			reason,
			timestamp: new Date().toISOString(),
		};

		setLogs((prevLogs) => [...prevLogs, newLog]);
	};

	// Get logs by date
	const getLogsByDate = (date: string): LogEntry[] => {
		return logs.filter((log) => log.date === date);
	};

	// Get routine by ID
	const getRoutineById = (id: string): Routine | undefined => {
		return routines.find((routine) => routine.id === id);
	};

	// Effect to simulate fetching routines when user changes
	useEffect(() => {
		if (user) {
			// In a real app, this would fetch from API
			// For now, we're just using the mock data
		}
	}, [user]);

	return (
		<LogContext.Provider
			value={{
				routines,
				logs,
				completionRate,
				todaysRoutine,
				pendingSteps,
				canLogRoutine,
				logRoutineStep,
				getLogsByDate,
				getRoutineById,
			}}
		>
			{children}
		</LogContext.Provider>
	);
};

export const useLog = (): LogContextType => {
	const context = useContext(LogContext);
	if (!context) {
		throw new Error("useLog must be used within a LogProvider");
	}
	return context;
};
