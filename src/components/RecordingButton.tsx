import { useState } from "react";

const RecordingButton = ({
    isRecording,
    onClickButton,
}: {
    onClickButton: () => void;
    isRecording: boolean;
}) => {
    const [isLocalRecording, setIsLocalRecording] = useState(isRecording);

    const toggleRecording = () => {
        setIsLocalRecording(!isLocalRecording);

        onClickButton();
    };
    // console.log("isLocalRecording in button", isLocalRecording);
    return (
        <button
            onClick={toggleRecording}
            className={`relative flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all duration-300 ease-in-out ${
                isLocalRecording ? "bg-red-500 animate-pulse" : "bg-gray-800"
            }`}
        >
            <div
                className={`absolute transition-all duration-300 ${
                    isLocalRecording
                        ? "w-10 h-10 bg-white rounded-md"
                        : "w-16 h-16 bg-red-500 rounded-full"
                }`}
            />
            <span className="sr-only">
                {isLocalRecording ? "Stop Recording" : "Start Recording"}
            </span>
        </button>
    );
};

export default RecordingButton;
