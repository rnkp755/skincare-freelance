import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Image, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface ChatInputProps {
	onSendMessage: (message: string, imageUrl?: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
	const [message, setMessage] = useState("");
	const [isRecording, setIsRecording] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { theme } = useTheme();

	// Speech recognition setup
	const startRecording = () => {
		if (!("webkitSpeechRecognition" in window)) {
			alert("Speech recognition is not supported in your browser");
			return;
		}

		// Simulating speech recognition since WebSpeechAPI isn't directly accessible
		setIsRecording(true);

		// Mock recording for 3 seconds
		setTimeout(() => {
			const mockTranscript = "I have dry skin patches on my face";
			setMessage((prev) => prev + mockTranscript);
			setIsRecording(false);
		}, 3000);
	};

	const handleSendMessage = () => {
		if (message.trim() || uploadedImage) {
			onSendMessage(message, uploadedImage || undefined);
			setMessage("");
			setUploadedImage(null);
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			// In a real app, this would upload to a server and get a URL back
			// For now, just create a local object URL
			const mockUploadUrl =
				"https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
			setUploadedImage(mockUploadUrl);
		}
	};

	const clearImage = () => {
		setUploadedImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	// Handle Enter key to send message
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div
			className={`rounded-md p-4 border-t ${
				theme === "dark"
					? "border-gray-700 bg-gray-800"
					: "border-gray-200 bg-white"
			}`}
		>
			{uploadedImage && (
				<div className="relative mb-2 inline-block">
					<img
						src={uploadedImage}
						alt="Upload preview"
						className="h-16 w-16 object-cover rounded-md"
					/>
					<button
						onClick={clearImage}
						className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
						aria-label="Remove image"
					>
						<X size={14} />
					</button>
				</div>
			)}

			<div className="flex items-center gap-2">
				<button
					onClick={() => fileInputRef.current?.click()}
					className={`p-2 rounded-full ${
						theme === "dark"
							? "hover:bg-gray-700 text-gray-300"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					aria-label="Attach image"
				>
					<Image size={20} />
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleImageUpload}
						accept="image/*"
						className="hidden"
					/>
				</button>

				<div className="flex-1 relative">
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type a message..."
						className={`w-full rounded-full px-4 py-2 pr-10 resize-none ${
							theme === "dark"
								? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
								: "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200"
						} border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
						rows={1}
						style={{ minHeight: "44px", maxHeight: "120px" }}
					/>
				</div>

				{message.trim() || uploadedImage ? (
					<button
						onClick={handleSendMessage}
						className="p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
						aria-label="Send message"
					>
						<Send size={20} />
					</button>
				) : (
					<button
						onClick={startRecording}
						className={`p-3 rounded-full transition-colors ${
							isRecording
								? "bg-red-500 text-white animate-pulse"
								: theme === "dark"
								? "bg-gray-700 text-gray-300 hover:bg-gray-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
						aria-label={
							isRecording ? "Recording..." : "Start voice message"
						}
						disabled={isRecording}
					>
						<Mic size={20} />
					</button>
				)}
			</div>
		</div>
	);
};

export default ChatInput;
