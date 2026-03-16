import { useState, useRef } from "react";

const useSpeechRecognition = (onTranscriptionUpdate: any) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const recognitionRef = useRef<any>(null);

    const startRecording = (lang: string = "fr-FR") => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                "La reconnaissance vocale n'est pas prise en charge par votre navigateur.",
            );
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
            setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
            const newTranscript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join("");
            setTranscription((prev) => `${newTranscript}`.trim()); // Concaténer le texte
            onTranscriptionUpdate(newTranscript);
        };

        recognition.onerror = () => {
            setIsRecording(false);
        };

        recognition.onend = () => {
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
