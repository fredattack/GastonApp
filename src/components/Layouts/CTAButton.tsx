import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMicrophone,
    faKitMedical,
    faKeyboard,
    faCalendarDays,
    faPaw,
    faPlus,
    faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import ActionModal from "../Modal/ActionModal";

import { useMessage } from "../../contexts/MessageContext";
import { EventTypes } from "../../enums/EventTypes";

const CTAButton = () => {
    const { handelOpenModal } = useMessage();
    const { registerHandelOpenModal } = useMessage();

    const [localEvent, setLocalEvent] = useState<Event | null>(null);
    const [step, setStep] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transcription, setTranscription] = useState(""); // État local pour la transcription
    const [manualInput, setManualInput] = useState(false); // Différencier mode vocal et prompt
    const [viewMode, setViewMode] = useState(""); // Différencier mode vocal et prompt

    const [promptType, setPromptType] = useState<string | null>(null); // Différencier mode vocal et prompt
    useEffect(() => {
        registerHandelOpenModal(localHandleModelInput);
    }, []);

    useEffect(() => {
        setTranscription("");
        setManualInput(true);
        setIsModalOpen(true);
    }, [promptType]);

    useEffect(() => {
        if (localEvent) {
            setPromptType("createEvent");
            setStep(1);
            setViewMode("edit");
            setTranscription("");
            setManualInput(true);
            setIsModalOpen(true);
        }
    }, [localEvent]);

    const handleTranscriptionUpdate = (newTranscription: string) => {
        setTranscription(newTranscription);
    };

    const { isRecording, startRecording, stopRecording } = useSpeechRecognition(
        handleTranscriptionUpdate,
    );

    const handleClose = () => {
        setIsModalOpen(false); // Fermer la modal
        setTranscription(""); // Réinitialise la transcription lorsque la modal est fermée
        setManualInput(false); // Réinitialise le mode manuel
        setLocalEvent(null);
    };

    const handleStartRecording = () => {
        setPromptType("newPrompt");
        setViewMode("speech");
        setStep(0);
        setTranscription(""); // Réinitialise la transcription avant de commencer
        setManualInput(false); // Désactiver le mode manuel
        startRecording();
        setIsModalOpen(true); // Ouvrir la modal
    };

    const handleSwitchRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handlePromptInput = () => {
        try {
            setPromptType("newPrompt");
            setViewMode("write");
            setStep(0);
            setTranscription("");
            setManualInput(true);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Erreur dans handlePromptInput:", error);
        }
    };

    const localHandleModelInput = async (
        model: string,
        vmode: string = "edit",
        event: Event | null = null,
    ) => {
        if (model === "feeding" || model === "care") {
            // @ts-ignore
            const newEvent: Event = {
                id: "",
                master_id: "",
                petId: "",
                title: "",
                is_full_day: false,
                type:
                    model === "feeding"
                        ? EventTypes.Feeding
                        : EventTypes.Medical,
                start_date: new Date(),
                is_recurring: false,
                created_at: new Date(),
                pets: [],
                is_done: false,
                end_date: undefined,
                notes: undefined,
                recurrence: undefined,
                event_items: [], // Adding required property
            };
            await setLocalEvent(newEvent);
            return;
        }
        if (event) {
            await setLocalEvent(event);
            return;
        }

        const newPromptType = model !== "pet" ? "createEvent" : "createPet";
        setPromptType(newPromptType);
        setStep(1);
        setViewMode(vmode);
        setTranscription("");
        setManualInput(true);
        console.log("localEvent", localEvent);
        setIsModalOpen(true);
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="btn btn-primary text-white w-10 h-10 P-0 rounded-full bg-primary ">
                    <FontAwesomeIcon size="xl" icon={faPlus} />
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="py-1">
                    <MenuItem>
                        <div className="group">
                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => {
                                    if (isRecording) {
                                        stopRecording();
                                    } else {
                                        handleStartRecording();
                                    }
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faMicrophone}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                {isRecording
                                    ? "Stop Recording"
                                    : "Start Recording"}
                            </div>

                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => handlePromptInput()}
                            >
                                <FontAwesomeIcon
                                    icon={faKeyboard}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                Manual Input
                            </div>
                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => localHandleModelInput("feeding")}
                            >
                                <FontAwesomeIcon
                                    icon={faUtensils}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                Add Feeding
                            </div>
                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => localHandleModelInput("care")}
                            >
                                <FontAwesomeIcon
                                    icon={faKitMedical}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                Add Care
                            </div>
                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => localHandleModelInput("event")}
                            >
                                <FontAwesomeIcon
                                    icon={faCalendarDays}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                Add Event
                            </div>

                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => localHandleModelInput("Pet")}
                            >
                                <FontAwesomeIcon
                                    icon={faPaw}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                Add Pet
                            </div>
                        </div>
                    </MenuItem>
                </div>
            </MenuItems>

            {promptType && (
                <ActionModal
                    key={
                        promptType +
                        localEvent +
                        transcription +
                        isRecording +
                        viewMode
                    }
                    event={localEvent}
                    initialStep={step}
                    isOpen={isModalOpen}
                    isRecording={isRecording}
                    onSwitchRecording={handleSwitchRecording}
                    onClose={handleClose}
                    transcription={transcription}
                    initialPromptType={promptType}
                    initialViewMode={viewMode}
                    setTranscription={setTranscription}
                    isManualInput={manualInput}
                />
            )}
        </Menu>
    );
};

export default CTAButton;
