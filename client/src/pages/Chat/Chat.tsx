import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History, ArrowLeft } from "lucide-react";
import ChatInput from "../../components/Chat/ChatInput";
import ChatMessage, {
	ChatMessageData,
} from "../../components/Chat/ChatMessage";
import ChatHistory from "../../components/Chat/ChatHistory";
import { useLog } from "../../contexts/LogContext";
import Button from "../../components/UI/Button";

// Mock initial messages for demo purposes
const initialMessages: ChatMessageData[] = [
	{
		id: "1",
		sender: "ai",
		text: "Hello! I'm your SkinCare AI assistant. How can I help you today?",
		timestamp: new Date(Date.now() - 3600000), // 1 hour ago
	},
];

// Mock chat history
const mockChatHistory: ChatMessageData[][] = [
	[
		{
			id: "h1",
			sender: "ai",
			text: "Hello! I'm your SkinCare AI assistant. How can I help you today?",
			timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
		},
		{
			id: "h2",
			sender: "user",
			text: "I have dry patches on my face",
			timestamp: new Date(Date.now() - 86400000 * 3 + 60000), // 3 days ago + 1 minute
		},
		{
			id: "h3",
			sender: "ai",
			text: "I understand you're experiencing dry patches. Could you tell me a bit more about your current skincare routine?",
			timestamp: new Date(Date.now() - 86400000 * 3 + 120000), // 3 days ago + 2 minutes
		},
	],
	[
		{
			id: "h4",
			sender: "ai",
			text: "Hello! I'm your SkinCare AI assistant. How can I help you today?",
			timestamp: new Date(Date.now() - 86400000 * 7), // 7 days ago
		},
		{
			id: "h5",
			sender: "user",
			text: "I have acne issues",
			timestamp: new Date(Date.now() - 86400000 * 7 + 60000), // 7 days ago + 1 minute
		},
		{
			id: "h6",
			sender: "ai",
			text: "I'm sorry to hear you're dealing with acne. What type of acne are you experiencing (whiteheads, blackheads, cystic, etc.)?",
			options: [
				{ text: "Whiteheads", value: "whiteheads" },
				{ text: "Blackheads", value: "blackheads" },
				{ text: "Cystic Acne", value: "cystic" },
				{ text: "Combination", value: "combination" },
			],
			timestamp: new Date(Date.now() - 86400000 * 7 + 120000), // 7 days ago + 2 minutes
		},
	],
];

const Chat: React.FC = () => {
	const [messages, setMessages] =
		useState<ChatMessageData[]>(initialMessages);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { routines } = useLog();
	const navigate = useNavigate();

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = (text: string, imageUrl?: string) => {
		// User message
		const userMessage: ChatMessageData = {
			id: Date.now().toString(),
			sender: "user",
			text,
			imageUrl,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);

		// Simulate AI response
		setTimeout(() => {
			// Select a random response type for demo
			const responseType = Math.floor(Math.random() * 3);

			let aiResponse: ChatMessageData;

			if (responseType === 0) {
				// Simple text response
				aiResponse = {
					id: (Date.now() + 1).toString(),
					sender: "ai",
					text: "I've analyzed your skin condition. It appears you have mild dryness with some redness. This could be due to environmental factors or your current skincare products.",
					timestamp: new Date(),
				};
			} else if (responseType === 1) {
				// Response with options
				aiResponse = {
					id: (Date.now() + 1).toString(),
					sender: "ai",
					text: "To better help you, I need to know your age range:",
					options: [
						{ text: "0-30 Years", value: "0-30" },
						{ text: "30-60 Years", value: "30-60" },
						{ text: "60+ Years", value: "60+" },
					],
					timestamp: new Date(),
				};
			} else {
				// Response with routine and medicines
				aiResponse = {
					id: (Date.now() + 1).toString(),
					sender: "ai",
					text: "Based on the image and information you've provided, I believe you have mild acne with some dryness. Here's a recommended routine and some medications that might help:",
					routineSteps: [
						{
							timeOfDay: "Morning",
							steps: [
								"Wash face with gentle cleanser",
								"Apply vitamin C serum",
								"Apply moisturizer with SPF",
							],
						},
						{
							timeOfDay: "Evening",
							steps: [
								"Wash face with gentle cleanser",
								"Apply retinol serum (start with 2-3 times per week)",
								"Apply night moisturizer",
							],
						},
					],
					medicines: routines[0].medicines,
					timestamp: new Date(),
				};
			}

			setMessages((prev) => [...prev, aiResponse]);
		}, 1500);
	};

	const handleOptionSelect = (value: string) => {
		handleSendMessage(value);
	};

	const selectChatFromHistory = (index: number) => {
		// In a real app, this would load a chat from history
		// For demo, we'll use the mock data
		setMessages(mockChatHistory[index]);
	};

	return (
		<div className="h-[calc(100vh-7rem)] flex flex-col max-w-6xl mx-auto">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						onClick={() => navigate(-1)}
						className="p-2"
					>
						<ArrowLeft size={20} />
					</Button>
					<h1 className="text-xl font-bold">AI Consultation</h1>
				</div>

				<Button
					variant="ghost"
					onClick={() => setIsHistoryOpen(true)}
					className="flex items-center gap-1"
				>
					<History size={20} />
					<span className="hidden sm:inline">History</span>
				</Button>
			</div>

			<div className="flex-1 overflow-y-auto p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4">
				{messages.map((message) => (
					<ChatMessage
						key={message.id}
						message={message}
						onOptionSelect={handleOptionSelect}
					/>
				))}
				<div ref={messagesEndRef} />
			</div>

			<ChatInput onSendMessage={handleSendMessage} />

			<ChatHistory
				isOpen={isHistoryOpen}
				onClose={() => setIsHistoryOpen(false)}
				history={mockChatHistory}
				onSelectChat={selectChatFromHistory}
			/>
		</div>
	);
};

export default Chat;
