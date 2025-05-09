import React from "react";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContext";

interface RoutineChartProps {
	completionRate: number;
}

const RoutineChart: React.FC<RoutineChartProps> = ({ completionRate }) => {
	const { theme } = useTheme();

	const completedValue = Math.round(completionRate);
	const missedValue = 100 - completedValue;

	const data = [
		{ name: "Completed", value: completedValue },
		{ name: "Missed", value: missedValue },
	];

	const colors =
		theme === "dark"
			? ["#4f39f6", "#334155"] // dark theme colors
			: ["#4f39f6", "#6e747b"]; // light theme colors

	const textColor = theme === "dark" ? "#f1f5f9" : "#334155";

	const customTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			return (
				<div
					className={`p-2 rounded shadow-md text-sm ${
						theme === "dark"
							? "bg-gray-800 text-white"
							: "bg-white text-gray-800"
					}`}
				>
					<p>{`${payload[0].name}: ${payload[0].value}%`}</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="h-64 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={80}
						paddingAngle={5}
						dataKey="value"
						label={({ name, value }) => `${name}: ${value}%`}
						labelLine={false}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={colors[index % colors.length]}
							/>
						))}
					</Pie>
					<Tooltip content={customTooltip} />
					<Legend verticalAlign="bottom" iconType="circle" />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default RoutineChart;
