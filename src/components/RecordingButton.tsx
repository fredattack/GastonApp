import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

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
    return (
        <button
            onClick={toggleRecording}
            className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ease-in-out border ${
                isLocalRecording
                    ? "bg-white animate-pulse border-gray-700"
                    : "bg-gray-700 border-white"
            }`}
        >
            <div
                className={`absolute transition-all duration-300 flex justify-center items-center ${
                    isLocalRecording
                        ? "w-8 h-8 bg-red-500 rounded-md"
                        : "w-[60px] h-[60px] bg-white rounded-full"
                }`}
            >
                {!isLocalRecording && (
                    <FontAwesomeIcon
                        size="3x"
                        className="text-red-600"
                        icon={faCircle}
                    />
                )}
            </div>
            {/* <span className="sr-only"> */}
            {/*    {isLocalRecording ? "Stop Recording" : "Start Recording"} */}
            {/* </span> */}
        </button>
    );
};

export default RecordingButton;
