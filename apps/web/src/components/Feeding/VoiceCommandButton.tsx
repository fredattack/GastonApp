import React, { useCallback, useEffect, useRef, useState } from "react";
import { Microphone, MicrophoneSlash, SpinnerGap } from "@phosphor-icons/react";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import { feedingService } from "../../services/FeedingService";
import { logger } from "@/utils/logger";

type ButtonState = "idle" | "recording" | "processing" | "error";

interface VoiceCommandButtonProps {
    onCommandResult: (result: VoiceCommandResult) => void;
}

const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
    onCommandResult,
}) => {
    const [buttonState, setButtonState] = useState<ButtonState>("idle");
    const transcriptRef = useRef<string>("");
    const processingRef = useRef<boolean>(false);

    const handleTranscriptUpdate = useCallback((transcript: string) => {
        logger.debug("[Voice] transcript update:", transcript);
        transcriptRef.current = transcript;
    }, []);

    const { isRecording, startRecording, stopRecording } = useSpeechRecognition(
        handleTranscriptUpdate,
    );

    const submitTranscript = useCallback(
        async (transcript: string) => {
            if (processingRef.current) {
                logger.debug("[Voice] already processing, skip");
                return;
            }

            const trimmed = transcript.trim();
            if (!trimmed) {
                logger.debug("[Voice] empty transcript, back to idle");
                setButtonState("idle");
                return;
            }

            logger.debug("[Voice] submitting transcript:", trimmed);
            processingRef.current = true;
            setButtonState("processing");

            try {
                const result = await feedingService.sendVoiceCommand(trimmed);
                logger.debug("[Voice] API result:", result);
                onCommandResult(result);
                setButtonState("idle");
            } catch (err) {
                console.error("[Voice] API error:", err);
                onCommandResult({
                    status: "error",
                    action: "voice_command",
                    message:
                        "Impossible de traiter la commande. Veuillez reessayer.",
                });
                setButtonState("error");
                setTimeout(() => setButtonState("idle"), 2000);
            } finally {
                processingRef.current = false;
            }
        },
        [onCommandResult],
    );

    // Watch isRecording: when it transitions to false and we have a transcript, auto-submit
    const prevRecordingRef = useRef(false);
    useEffect(() => {
        const wasRecording = prevRecordingRef.current;
        prevRecordingRef.current = isRecording;

        if (wasRecording && !isRecording && buttonState === "recording") {
            logger.debug(
                "[Voice] recording ended (browser auto-stop), transcript:",
                transcriptRef.current,
            );
            submitTranscript(transcriptRef.current);
            transcriptRef.current = "";
        }
    }, [isRecording, buttonState, submitTranscript]);

    const handlePress = () => {
        logger.debug(
            "[Voice] button pressed, state:",
            buttonState,
            "isRecording:",
            isRecording,
            "transcript so far:",
            transcriptRef.current,
        );

        if (buttonState === "processing") {
            return;
        }

        if (buttonState === "recording") {
            logger.debug(
                "[Voice] stopping recording manually, transcript:",
                transcriptRef.current,
            );
            stopRecording();
            return;
        }

        // Start recording
        logger.debug("[Voice] starting recording...");
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
                <SpinnerGap
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                />
            ) : buttonState === "error" ? (
                <MicrophoneSlash size={16} aria-hidden="true" />
            ) : (
                <Microphone
                    size={16}
                    className={`relative ${buttonState === "recording" ? "text-white" : ""}`}
                    aria-hidden="true"
                />
            )}
        </button>
    );
};

export default VoiceCommandButton;
