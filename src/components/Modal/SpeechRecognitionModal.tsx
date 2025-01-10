import React, {
    useState,
    useEffect,
    useRef
} from 'react';

import EventForm
    from '../../components/Event/EventForm';
import StepOne
    from './components/StepOne';
import {
    removeMarkdown
} from '../../helpers';

interface SpeechRecognitionModalProps {
    initialStep: number;
    isOpen: boolean;
    onClose: () => void;
    transcription: string;
    isManualInput: boolean;
}

const SpeechRecognitionModal: React.FC<SpeechRecognitionModalProps> = ({
                                                                           initialStep,
                                                                           isOpen,
                                                                           onClose,
                                                                           transcription,
                                                                           isManualInput
                                                                       }) => {
    const [currentStep, setCurrentStep] = useState(initialStep);

    const [eventData, setEventData] = useState<EventFormData>({
        id: null,
        petId: '',
        type: '',
        startDate: '',
        title: '',
        endDate: '',
        isRecurring: false,
        isFullDay: false,
        recurrence: {
            frequencyType: '',
            frequency: 1,
            days: [],
            hasEndRecurrence: false,
            endRecurrenceDate: ''
        },
        notes: ''
    });
    const [petData, setPetData] = useState<PetFormData>({
        birthDate: '',// YYYY-MM-DD
        breed: '',
        createdAt: '', // YYYY-MM-DD hh:ii
        id: '', // null if new pet
        is_active:true, // default true
        name: '', // unique
        order: 1,  // last order of pets
        ownerId: '', //auth user id
        species:  'dog'
    });

    const eventFormRef = useRef<any>(null); // Référence pour EventForm
    const stepOneRef = useRef<any>(null); // Référence pour EventForm
    const [load, setLoad] = useState(false);
    const [promptType, setPromptType] = useState('');
    // Synchroniser initialStep avec currentStep
    useEffect(() => {
        setCurrentStep(initialStep);
    }, [initialStep]);
    const [prompt, setPrompt] = useState<string>('');
    if (!isOpen) return null;

    const handleNext = () => {

        console.log('handleNext', prompt);
        // if (currentStep < 2) setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

     async function handlePostSubmit(data:any) {
         setLoad(false);
         console.log('handlePostSubmit',JSON.parse( data ),currentStep);
let responseObject = JSON.parse( data );
         setPromptType(responseObject.requestType);
         console.log('responseObject.response', responseObject.response);
         if (currentStep === 0) {
             if(promptType == 'createEvent'){
                setEventData(responseObject.response)
             }
             if(promptType == 'createPet'){
                 setPetData(responseObject.response)
             }
             setCurrentStep(1);
         }
         console.log('eventData', eventData);
     }
    const handleSave = () => {
        setLoad(!load);
        if (currentStep === 2) return;
        if (currentStep === 0) {
            stepOneRef.current.handleSubmit();
            /*setCurrentStep(1);*/
            return;
        }
        if (currentStep === 1) {
            eventFormRef.current.handleSubmit(); // Appeler handleSubmit dans EventForm
        }

    };

    const handlePromptChange = (value: any) => {
        setPrompt(value);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center m-auto z-50">
            <div
                className="bg-white p-6 rounded-lg h-full w-[95vw] md:w-[50vw] max-h-[90vh] overflow-auto">
                {currentStep === 0 && (
                    <StepOne
                        ref={stepOneRef}
                        prompt={prompt}
                        isManualInput={true}
                        onSubmit={(data: any) => { handlePostSubmit(data); }}
                        onChange={handlePromptChange}
                        onCancel={handleBack} />
                )}
                {currentStep === 1 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Étape
                            2
                            :
                            analysée</h2>
                        <EventForm
                            event={eventData}
                            ref={eventFormRef}
                            onChange={(updatedData: any) => {
                                setEventData((prevData: any) => ({
                                    ...prevData,
                                    ...updatedData
                                }));
                            }}
                            onCancel={() => setCurrentStep(0)}
                        />
                        <p className="text-sm text-gray-600 mt-2">Modifiez
                            le
                            texte
                            si
                            nécessaire.</p>
                    </div>
                )}
                {currentStep === 2 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Étape
                            3
                            :
                            Confirmation</h2>
                        <p className="mb-4">Le
                            texte
                            suivant
                            sera
                            enregistré
                            :</p>
                        <textarea
                            className="w-full h-32 p-2 border rounded"
                            value={transcription}
                            readOnly
                        ></textarea>
                        <p className="text-sm text-gray-600 mt-2">Cliquez
                            sur
                            "Enregistrer"
                            pour
                            confirmer.</p>
                    </div>
                )}
                <div
                    className="flex justify-between mt-6">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                        >
                            Retour
                        </button>
                    )}
                    {currentStep < 2 && (
                        <button
                            onClick={handleNext}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Suivant
                        </button>
                    )}
                    {currentStep <= 1 && (
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            {load &&
                                <span
                                    className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                            }
                            Enregistrer
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};


export default SpeechRecognitionModal;
