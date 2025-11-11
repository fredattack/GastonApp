import React, {
    forwardRef,
    useState,
    useImperativeHandle,
    useCallback,
} from "react";

import { OpenAiService } from "../../../services/OpenAIService";

interface StepOneProps {
    prompt: string;
    isManualInput: boolean;
    onSubmit: (response: AIResponse) => void;
    onChange: (value: string) => void;
    onCancel: () => void;
}

const StepOne = forwardRef(
    (
        { prompt, onSubmit, onCancel, onChange, isManualInput }: StepOneProps,
        ref,
    ) => {
        const [localPrompt, setLocalPrompt] = useState<string>(prompt);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const handlePromptChange = useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const newValue = e.target.value;
                setLocalPrompt(newValue);
                onChange(newValue);
                setError(null);
            },
            [onChange],
        );

        const sendPrompt = useCallback(
            async (promptText: string): Promise<AIResponse> => {
                const openAiService = OpenAiService.getInstance();
                return openAiService.sendPromptApi(promptText);
            },
            [],
        );

        const handleSubmit = useCallback(async () => {
            if (!localPrompt.trim()) {
                setError("Veuillez entrer un message");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await sendPrompt(localPrompt);
                onSubmit(response);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Une erreur est survenue lors de l'envoi du message";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }, [localPrompt, sendPrompt, onSubmit]);

        useImperativeHandle(ref, () => ({
            handleSubmit,
        }));

        return (
            <div>
                <h2 className="text-xl font-bold mb-4">
                    {isManualInput
                        ? "Étape 1 : Saisissez votre texte"
                        : "Étape 1 : Enregistrement"}
                </h2>
                <textarea
                    className="w-full h-32 p-2 border rounded"
                    value={localPrompt}
                    onChange={handlePromptChange}
                    disabled={isLoading}
                    placeholder="Entrez votre message..."
                />
                {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
                {isLoading && (
                    <div className="text-blue-500 text-sm mt-2">
                        Envoi en cours...
                    </div>
                )}
            </div>
        );
    },
);
export default StepOne;
