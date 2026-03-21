import { useState, useRef } from "react";
import { logger } from "@/utils/logger";

const useSpeechRecognition = (onTranscriptionUpdate: any, onError?: (message: string) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const recognitionRef = useRef<any>(null);

    const startRecording = (lang: string = "fr-FR") => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            const message = "La reconnaissance vocale n'est pas prise en charge par votre navigateur.";
            if (onError) {
                onError(message);
            } else {
                console.warn(message);
            }
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;
        recognition.duration = 500000;

        recognitionRef.current = recognition;

        recognition.onstart = () => {
            logger.debug("[SpeechRecognition] onstart fired");
            setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
            logger.debug("[SpeechRecognition] onresult fired, results:", event.results.length);
            const newTranscript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join("");
            logger.debug("[SpeechRecognition] transcript:", newTranscript);
            setTranscription(`${newTranscript}`.trim());
            onTranscriptionUpdate(newTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error("[SpeechRecognition] onerror:", event.error, event.message);
            setIsRecording(false);
        };

        recognition.onend = () => {
            logger.debug("[SpeechRecognition] onend fired");
            setIsRecording(false);
        };

        recognition.start();
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsRecording(false);
        }
    };

    return {
        isRecording,
        transcription,
        startRecording,
        stopRecording,
    };
};

export default useSpeechRecognition;
