import React
    , {
    forwardRef,useState,
    useImperativeHandle
} from 'react';

import { OpenAiService } from '../../../services/OpenAIService';
import axios from 'axios';
import PromptProvider
    from '../../../providers/PromptProvider';
import {
    modelService
} from '../../../services';
import {
    EventTypes
} from '../../../enums/EventTypes';
import {
    Days
} from '../../../enums/Days';
import {
    FrequencyTypes
} from '../../../enums/FrequencyTypes';
import {
    removeMarkdown
} from '../../../helpers';

interface StepOneProps {
    prompt: string;
    isManualInput: boolean;
    onSubmit: (response: any) => void;
    onChange: (value: string) => void
    onCancel: () => void;
}

const StepOne = forwardRef(({
                                onSubmit,
                                onCancel,
                                onChange,
                                isManualInput,
                            }: StepOneProps, ref) => {

    const [prompt, setPrompt] = useState<string>('');

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

        if (isManualInput) {
            setPrompt(e.target.value);
        }
    };

    async function initializeParameters() {
            return   {
                language: 'fr_FR',
                pets: await modelService.asOptions('pets'),
                users: await modelService.asOptions('users'),
                eventTypes: EventTypes.asOptionArray(),
                days: Days.asOptionArray(),
                frequencyTypes: FrequencyTypes.asOptionArray()
            };
        }
    async function sendPrompt(prompt: string) {
        const provider = new PromptProvider();
        const parameters = await initializeParameters();
        const formatedPrompt = provider.generatePrompt(prompt, parameters);


        try {
            // On attend la réponse de l'OpenAiService
            const responseFunction = await OpenAiService.sendPrompt([
                {
                    role: 'assistant',
                    content: formatedPrompt
                }
            ]);

            return responseFunction;  // Retourne la réponse traitée
        } catch (error) {
            console.error('Error while sending prompt:', error);
            throw error;
        }
    }



    const handleSubmit = async () => {
        const response = await sendPrompt(prompt);
        onSubmit(removeMarkdown(response));
    };

    useImperativeHandle(ref, () => ({
        handleSubmit
    }));

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                {isManualInput
                    ? 'Étape 1 : Saisissez votre texte'
                    : 'Étape 1 : Enregistrement'}
            </h2>
            <textarea
                className="w-full h-32 p-2 border rounded"
                value={prompt}
                onChange={handlePromptChange}
            ></textarea>
            <p className="text-sm text-gray-600 mt-2">
                {isManualInput
                    ? 'Saisissez votre texte dans la zone ci-dessus.'
                    : 'Parlez pour ajouter du texte.'}
            </p>
        </div>
    );

});
export default StepOne;
