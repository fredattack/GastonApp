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
            console.log("Enregistrement vocal démarré...");
        };

        recognition.onresult = (event: any) => {
            const newTranscript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join("");
            setTranscription((prev) => `${newTranscript}`.trim()); // Concaténer le texte
            onTranscriptionUpdate(newTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error("Erreur de reconnaissance vocale : ", event.error);
        };

        recognition.onend = () => {
            setIsRecording(false);
            console.log("Enregistrement terminé.");
        };

        recognition.start();
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsRecording(false);
            console.log("Enregistrement manuel arrêté.");
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
