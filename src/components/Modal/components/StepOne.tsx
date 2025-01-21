import React, { forwardRef, useState, useImperativeHandle } from "react";

import { OpenAiService } from "../../../services/OpenAIService";

interface StepOneProps {
    prompt: string;
    isManualInput: boolean;
    onSubmit: (response: any) => void;
    onChange: (value: string) => void;
    onCancel: () => void;
}

const StepOne = forwardRef(
    (
        { prompt, onSubmit, onCancel, onChange, isManualInput }: StepOneProps,
        ref,
    ) => {
        const [localPrompt, setLocalPrompt] = useState<string>(prompt);

        const handlePromptChange = (
            e: React.ChangeEvent<HTMLTextAreaElement>,
        ) => {
            if (isManualInput) {
                setLocalPrompt(e.target.value);
            }
        };

        async function sendPrompt(prompt: string) {
            try {
                const openAiService = new OpenAiService();
                return await openAiService.sendPromptApi(prompt);
            } catch (error) {
                console.error("Error while sending prompt:", error);
                throw error;
            }
        }

        const handleSubmit = async () => {
            const response = await sendPrompt(localPrompt);
            onSubmit(response);
        };

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
                />
                <p className="text-sm text-gray-600 mt-2">
                    {isManualInput
                        ? "Saisissez votre texte dans la zone ci-dessus."
                        : "Parlez pour ajouter du texte."}
                </p>
            </div>
        );
    },
);
export default StepOne;
