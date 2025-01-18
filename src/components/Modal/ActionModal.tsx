import React, { useEffect, useRef, useState, useContext } from "react";

import EventForm from "../Event/EventForm";
import PetForm from "../Pets/form/PetForm";
import StepOne from "./components/StepOne";
import PreviewAiResponse from "./components/PreviewAiResponse";

import { useMessage } from "../../contexts/MessageContext"; // ✅ Use the custom hook

type Events = {
    message: string;
};

interface SpeechRecognitionModalProps {
    event: Event | null;
    initialStep: number;
    isOpen: boolean;
    onClose: () => void;
    transcription: string;
    initialPromptType: string;
    initialViewMode: string;
    setTranscription: React.Dispatch<React.SetStateAction<string>>; // Ajout de cette ligne
    isManualInput: boolean;
}

const ActionModal: React.FC<SpeechRecognitionModalProps> = ({
    event,
    isOpen,
    onClose,
    initialStep,
    transcription,
    initialViewMode,
    initialPromptType,
    isManualInput,
}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const [eventData, setEventData] = useState<EventFormData>({
        id: event?.id ?? null,
        petId: event?.petId ?? "",
        type: event?.type ?? "",
        start_date: event?.start_date ?? "",
        title: event?.title ?? "",
        end_date: event?.end_date ?? "",
        is_recurring: event?.is_recurring ?? false,
        is_full_day: event?.is_full_day ?? false,
        is_done: event?.is_done ?? false,
        recurrence: event?.recurrence ?? {
            frequency_type: "",
            frequency: 1,
            days: [],
            end_date: "",
            occurrences: 1,
        },
        notes: event?.notes ?? "",
    });

    const [petData, setPetData] = useState<PetFormData>({
        birthDate: "", // YYYY-MM-DD
        breed: "",
        created_at: "", // YYYY-MM-DD hh:ii
        id: "", // null if new pet
        isActive: true, // default true
        name: "", // unique
        order: 1, // last order of pets
        ownerId: "", // auth user id
        species: "dog",
    });

    const eventFormRef = useRef<any>(null); // Référence pour EventForm
    const stepOneRef = useRef<any>(null); // Référence pour setOne
    const petRef = useRef<any>(null); // Référence pour petForm

    const [load, setLoad] = useState(false);
    const [prompt, setPrompt] = useState<string>("");
    const [promptType, setPromptType] = useState(initialPromptType);
    const [viewMode, setViewMode] = useState(initialViewMode);
    const [aiResponse, setAiResponse] = useState(Object);

    useEffect(() => {
        setCurrentStep(initialStep);
    }, [initialStep]);

    if (!isOpen) return null;

    const handleNext = () => {
        console.log("handleNext", prompt);
        if (currentStep < 2) setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

    async function handlePostSubmit(responseObject: any) {
        setLoad(false);
        await setAiResponse(responseObject);
        await setPromptType(responseObject.requestType);

        if (currentStep == 0) {
            if (responseObject.requestType == "createEvent") {
                await setEventData(responseObject?.response);
            }
            if (responseObject.requestType == "createPet") {
                setPetData(responseObject?.response);
            }
            setCurrentStep(1);
        }
    }

    const handleSave = () => {
        setLoad(!load);
        if (currentStep === 2) return;
        if (currentStep === 0) {
            stepOneRef.current.handleSubmit();
            /* setCurrentStep(1); */
            return;
        }

        if (currentStep === 1) {
            setViewMode("edit");
            if (promptType == "createPet") {
                petRef.current.handleSubmit(); // Appeler handleSubmit dans PetForm
            }
            if (promptType == "createEvent") {
                eventFormRef.current.handleSubmit(); // Appeler handleSubmit dans EventForm
            }
        }
        setLoad(!load);
    };

    const handlePromptChange = (value: any) => {
        setPrompt(value);
    };

    const handleRecallAi = () => {
        setLoad(!load);
        stepOneRef.current.handleSubmit();
        setLoad(!load);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center m-auto z-50">
            <div className="bg-white p-6 rounded-lg  w-[95vw] md:w-[50vw] max-h-[90vh] overflow-auto">
                <div className="float-right">
                    <button
                        onClick={onClose}
                        className="btn btn-outline-dark px-4 py-2"
                    >
                        X
                    </button>
                </div>
                <div>
                    {currentStep === 0 && (
                        <StepOne
                            ref={stepOneRef}
                            prompt={prompt}
                            isManualInput
                            onSubmit={(data: any) => {
                                handlePostSubmit(data);
                            }}
                            onChange={handlePromptChange}
                            onCancel={handleBack}
                        />
                    )}
                    {currentStep === 1 &&
                        viewMode === "preview" &&
                        aiResponse && (
                            <div>
                                {aiResponse.length && (
                                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                                        {JSON.stringify(aiResponse, null, 2)}
                                    </pre>
                                )}
                                <PreviewAiResponse aiResponse={aiResponse} />
                            </div>
                        )}
                    {currentStep === 1 &&
                        promptType === "createEvent" &&
                        viewMode != "preview" && (
                            <div>
                                {aiResponse.length && (
                                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                                        {JSON.stringify(aiResponse, null, 2)}
                                    </pre>
                                )}

                                <EventForm
                                    event={eventData}
                                    ref={eventFormRef}
                                    onChange={(updatedData: any) => {
                                        setEventData((prevData: any) => ({
                                            ...prevData,
                                            ...updatedData,
                                        }));
                                    }}
                                    onSubmit={() => onClose()}
                                    onCancel={() => setCurrentStep(0)}
                                />
                            </div>
                        )}

                    {currentStep === 1 &&
                        promptType === "createPet" &&
                        viewMode != "preview" && (
                            <div>
                                <PetForm
                                    petFormData={petData}
                                    ref={petRef}
                                    onChange={(updatedData: any) => {
                                        setEventData((prevData: any) => ({
                                            ...prevData,
                                            ...updatedData,
                                        }));
                                    }}
                                    onCancel={() => setCurrentStep(0)}
                                />

                                <p className="text-sm text-gray-600 mt-2">
                                    Modifiez le texte si nécessaire.
                                </p>
                            </div>
                        )}
                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                Étape 3 : Confirmation
                            </h2>
                            <p className="mb-4">
                                Le texte suivant sera enregistré :
                            </p>
                            <textarea
                                className="w-full h-32 p-2 border rounded"
                                value={transcription}
                                readOnly
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                Cliquez sur "Enregistrer" pour confirmer.
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex justify-between mt-6">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                        >
                            Retour
                        </button>
                    )}
                    {currentStep <= 1 && (
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            {load && (
                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" />
                            )}
                            {promptType ? "Générer" : "Enregistrer"}
                        </button>
                    )}

                    {currentStep == 1 && (
                        <button
                            onClick={handleRecallAi}
                            className="bg-amber-300 text-white px-4 py-2 rounded"
                        >
                            {load && (
                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" />
                            )}
                            reCall AI
                        </button>
                    )}
                    {currentStep == 1 && viewMode === "preview" && (
                        <button
                            onClick={() => setViewMode("edit")}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            edit form
                        </button>
                    )}
                    {currentStep == 1 && viewMode === "edit" && (
                        <button
                            onClick={() => setViewMode("preview")}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            preview
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
