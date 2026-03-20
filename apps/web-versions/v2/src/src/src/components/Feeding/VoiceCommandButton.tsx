import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import { feedingService } from "../../services/FeedingService";

type ButtonState = "idle" | "recording" | "processing" | "error";

interface VoiceCommandButtonProps {
    onCommandResult: (result: VoiceCommandResult) => void;
}

const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({ onCommandResult }) => {
    const [buttonState, setButtonState] = useState<ButtonState>("idle");
    const transcriptRef = useRef<string>("");
    const processingRef = useRef<boolean>(false);

    const handleTranscriptUpdate = useCallback((transcript: string) => {
        console.log("[Voice] transcript update:", transcript);
        transcriptRef.current = transcript;
    }, []);

    const { isRecording, startRecording, stopRecording } = useSpeechRecognition(handleTranscriptUpdate);

    const submitTranscript = useCallback(async (transcript: string) => {
        if (processingRef.current) {
            console.log("[Voice] already processing, skip");
            return;
        }

        const trimmed = transcript.trim();
        if (!trimmed) {
            console.log("[Voice] empty transcript, back to idle");
            setButtonState("idle");
            return;
        }

        console.log("[Voice] submitting transcript:", trimmed);
        processingRef.current = true;
        setButtonState("processing");

        try {
            const result = await feedingService.sendVoiceCommand(trimmed);
            console.log("[Voice] API result:", result);
            onCommandResult(result);
            setButtonState("idle");
        } catch (err) {
            console.error("[Voice] API error:", err);
            onCommandResult({
                status: "error",
                action: "voice_command",
                message: "Impossible de traiter la commande. Veuillez reessayer.",
            });
            setButtonState("error");
            setTimeout(() => setButtonState("idle"), 2000);
        } finally {
            processingRef.current = false;
        }
    }, [onCommandResult]);

    // Watch isRecording: when it transitions to false and we have a transcript, auto-submit
    const prevRecordingRef = useRef(false);
    useEffect(() => {
        const wasRecording = prevRecordingRef.current;
        prevRecordingRef.current = isRecording;

        if (wasRecording && !isRecording && buttonState === "recording") {
            console.log("[Voice] recording ended (browser auto-stop), transcript:", transcriptRef.current);
            submitTranscript(transcriptRef.current);
            transcriptRef.current = "";
        }
    }, [isRecording, buttonState, submitTranscript]);

    const handlePress = () => {
        console.log("[Voice] button pressed, state:", buttonState, "isRecording:", isRecording, "transcript so far:", transcriptRef.current);

        if (buttonState === "processing") {
            return;
        }

        if (buttonState === "recording") {
            console.log("[Voice] stopping recording manually, transcript:", transcriptRef.current);
            // Don't submit here — let the useEffect on isRecording handle it
            // This avoids the race condition where stopRecording() hasn't fired onend yet
            stopRecording();
            return;
        }

        // Start recording
        console.log("[Voice] starting recording...");
        transcriptRef.current = "";
        setButtonState("recording");
        startRecording("fr-FR");
    };

    const isDisabled = buttonState === "processing";

    const buttonClasses = [
        "relative flex items-center justify-center",
        "min-w-[44px] min-h-[44px] w-11 h-11 rounded-full",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
        "active:scale-95",
        isDisabled && "cursor-not-allowed opacity-70",
        !isDisabled && "cursor-pointer",
        buttonState === "recording"
            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/40"
            : buttonState === "error"
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type="button"
            className={buttonClasses}
            onClick={handlePress}
            disabled={isDisabled}
            aria-label={
                buttonState === "recording"
                    ? "Arreter l'enregistrement"
                    : buttonState === "processing"
                      ? "Traitement en cours"
                      : "Commande vocale"
            }
        >
            {buttonState === "recording" && (
                <>
                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-30" />
                </>
            )}

            {buttonState === "processing" ? (
                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : buttonState === "error" ? (
                <FontAwesomeIcon icon={faMicrophoneSlash} className="w-4 h-4" aria-hidden="true" />
            ) : (
                <FontAwesomeIcon
                    icon={faMicrophone}
                    className={`w-4 h-4 relative ${buttonState === "recording" ? "text-white" : ""}`}
                    aria-hidden="true"
                />
            )}
        </button>
    );
};

export default VoiceCommandButton;
