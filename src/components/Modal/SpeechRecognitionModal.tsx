import React, {
    useState,
    useEffect,
    useRef
} from 'react';

import EventForm
    from '../../components/Event/EventForm'; // Adaptez le chemin en fonction de l'emplacement du fichier

interface SpeechRecognitionModalProps {
    initialStep: number;
    isOpen: boolean;
    onClose: () => void;
    transcription: string;
    setTranscription: (value: string) => void;
    isManualInput: boolean;
}

const SpeechRecognitionModal: React.FC<SpeechRecognitionModalProps> = ({
                                                                           initialStep,
                                                                           isOpen,
                                                                           onClose,
                                                                           transcription,
                                                                           setTranscription,
                                                                           isManualInput
                                                                       }) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [eventData, setEventData] = useState<EventFormData>({
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

    const eventFormRef = useRef<any>(null); // Référence pour EventForm

    // Synchroniser initialStep avec currentStep
    useEffect(() => {
        setCurrentStep(initialStep);
    }, [initialStep]);

    if (!isOpen) return null;

    const handleNext = () => {
        console.log('handleNext', eventData);
        // if (currentStep < 2) setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

    const handleSave = () => {
        console.log('handleSave',eventFormRef);
        eventFormRef.current.handleSubmit(); // Appeler handleSubmit dans EventForm
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center m-auto z-50">
            <div
                className="bg-white p-6 rounded-lg h-full w-[95vw] md:w-[50vw] max-h-[90vh] overflow-auto">
                {currentStep === 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            {isManualInput
                                ? 'Étape 1 : Saisissez votre texte'
                                : 'Étape 1 : Enregistrement'}
                        </h2>
                        <textarea
                            className="w-full h-32 p-2 border rounded"
                            value={transcription}
                            onChange={(e) => {
                                if (isManualInput) {
                                    setTranscription(e.target.value);
                                }
                            }}
                        ></textarea>
                        <p className="text-sm text-gray-600 mt-2">
                            {isManualInput
                                ? 'Saisissez votre texte dans la zone ci-dessus.'
                                : 'Parlez pour ajouter du texte.'}
                        </p>
                    </div>
                )}
                {currentStep === 1 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Étape
                            2
                            :
                            analysée</h2>
                        <EventForm
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
                    {currentStep === 1 && (
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
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
