import React, { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import EventForm from "../Event/Form/EventForm";
import PetForm from "../Pets/form/PetForm";
import StepOne from "./components/StepOne";
import PreviewAiResponse from "./components/PreviewAiResponse";
import RecordingButton from "../RecordingButton";
import { showConfirmUpdateEventAlert } from "../Alerts/confirmUpdateEventAlert";
import { transformAIResponseToEventForm } from "../../utils/aiTransformers";

interface SpeechRecognitionModalProps {
    event: Event | null;
    initialStep: number;
    isOpen: boolean;
    isRecording: boolean;
    onSwitchRecording: () => void;
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
    isRecording,
    onClose,
    onSwitchRecording,
    initialStep,
    transcription,
    initialViewMode,
    initialPromptType,
    isManualInput,
}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const [eventData, setEventData] = useState<EventFormData>({
        id: event?.id ?? null,
        master_id: event?.master_id ?? null,
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
        pets: event?.pets ?? [],
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

    const eventFormRef = useRef<{ handleSubmit: () => Promise<void> }>(null);
    const stepOneRef = useRef<{ handleSubmit: () => Promise<void> }>(null);
    const petRef = useRef<{ handleSubmit: () => Promise<void> }>(null);

    const [load, setLoad] = useState(false);
    const [prompt, setPrompt] = useState<string>(transcription);
    const [promptType, setPromptType] = useState(initialPromptType);
    const [viewMode, setViewMode] = useState(initialViewMode);
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);

    useEffect(() => {
        setCurrentStep(initialStep);
    }, [initialStep]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < 2) setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

    function handlePostSubmit(responseObject: AIResponse) {
        setLoad(false);
        setAiResponse(responseObject);
        setPromptType(responseObject.requestType);

        if (currentStep === 0) {
            if (responseObject.requestType === "createEvent") {
                const transformedData = transformAIResponseToEventForm(
                    responseObject.data,
                );
                setEventData(transformedData);
            }
            if (responseObject.requestType === "createPet") {
                setPetData(responseObject.data as unknown as PetFormData);
            }
            setCurrentStep(1);
            setViewMode("edit");
        }
    }

    function succesUpdate() {
        setLoad(false);
        onClose();
    }

    const handleSave = () => {
        setLoad(!load);
        if (currentStep === 2) return;
        if (currentStep === 0) {
            stepOneRef.current?.handleSubmit();
            return;
        }

        if (currentStep === 1) {
            setViewMode("edit");
            if (event?.id || event?.master_id) {
                showConfirmUpdateEventAlert(eventData, () => {
                    succesUpdate();
                });
                return;
            }
            if (promptType === "createPet") {
                petRef.current?.handleSubmit();
            }
            if (promptType === "createEvent") {
                eventFormRef.current?.handleSubmit();
            }
        }
        setLoad(!load);
    };

    const handlePromptChange = (value: string) => {
        setPrompt(value);
    };

    const handleRecallAi = () => {
        setLoad(!load);
        stepOneRef.current?.handleSubmit();
        setLoad(!load);
    };

    const handleSetEventData = (data: Partial<EventFormData>) => {
        setEventData((prevData) => ({
            ...prevData,
            ...data,
        }));
    };

    const shouldShowButton = (): boolean => {
        const isSpeechMode = viewMode === "speech" && !isRecording;
        const isWritingMode = viewMode === "write";
        const isEditingMode = viewMode === "edit";
        return (
            (currentStep <= 1 &&
                prompt.length > 0 &&
                (isSpeechMode || isWritingMode)) ||
            isEditingMode
        );
    };

    const buttonText =
        promptType && viewMode !== "edit" ? "Générer par IA" : "Enregistrer";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center m-auto z-50">
            <div className="bg-white p-6 rounded-lg w-[95vw] md:w-[50vw] max-h-[90vh] overflow-auto py-3">
                <div className="flex justify-end w-full">
                    <button
                        onClick={onClose}
                        className=" text-white-dark hover:text-dark dark:text-white dark:hover:text-white-dark"
                    >
                        <FontAwesomeIcon size="xl" icon={faTimes} />
                    </button>
                </div>
                <div className="mt-2">
                    {currentStep === 0 && (
                        <StepOne
                            ref={stepOneRef}
                            prompt={prompt}
                            isManualInput
                            onSubmit={handlePostSubmit}
                            onChange={handlePromptChange}
                            onCancel={handleBack}
                        />
                    )}
                    {currentStep === 1 &&
                        viewMode === "preview" &&
                        aiResponse && (
                            <PreviewAiResponse aiResponse={aiResponse} />
                        )}
                    {currentStep === 1 &&
                        promptType === "createEvent" &&
                        viewMode !== "preview" && (
                            <EventForm
                                event={eventData}
                                ref={eventFormRef}
                                onChange={handleSetEventData}
                                onSubmit={() => onClose()}
                                onCancel={() => setCurrentStep(0)}
                            />
                        )}
                    {currentStep === 1 &&
                        promptType === "createPet" &&
                        viewMode !== "preview" && (
                            <PetForm
                                petFormData={petData}
                                ref={petRef}
                                onChange={(updatedData) => {
                                    setEventData((prevData) => ({
                                        ...prevData,
                                        ...updatedData,
                                    }));
                                }}
                                onCancel={() => setCurrentStep(0)}
                            />
                        )}
                </div>
                <div className="flex justify-between items-center mt-6 ">
                    {currentStep <= 1 && viewMode == "speech" && (
                        <div>
                            <RecordingButton
                                isRecording={isRecording}
                                onClickButton={() => onSwitchRecording()}
                            />
                        </div>
                    )}
                    {shouldShowButton() && (
                        <button
                            onClick={handleSave}
                            className="bg-success text-white px-4 py-2 rounded max-h-[45px]"
                        >
                            {load && (
                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" />
                            )}
                            {buttonText}
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
                    {currentStep == 1 &&
                        viewMode === "edit" &&
                        !event?.id &&
                        !event?.master_id && (
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
