import React, { useState,useEffect } from 'react';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import ActionModal from '../Modal/ActionModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from '../../components/Dropdown';
import { faMicrophone, faKeyboard, faCalendarDays,faPlus } from '@fortawesome/free-solid-svg-icons';



const CTAButton = () => {
    const { isRecording, startRecording, stopRecording } = useSpeechRecognition();
    const [step, setStep] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transcription, setTranscription] = useState(''); // État local pour la transcription
    const [manualInput, setManualInput] = useState(false); // Différencier mode vocal et prompt
    const [viewMode, setViewMode] = useState(''); // Différencier mode vocal et prompt

    const [promptType, setPromptType] = useState<string | null>(null); // Différencier mode vocal et prompt

    useEffect(() => {
        setTranscription('');
        setManualInput(true);
        setIsModalOpen(true);
    }, [promptType]);

    const handleClose = () => {
        setIsModalOpen(false); // Fermer la modal
        setTranscription(''); // Réinitialise la transcription lorsque la modal est fermée
        setManualInput(false); // Réinitialise le mode manuel
    };

    const handleStartRecording = () => {
        setStep(0);
        setTranscription(''); // Réinitialise la transcription avant de commencer
        setManualInput(false); // Désactiver le mode manuel
        startRecording();
        setIsModalOpen(true); // Ouvrir la modal
    };

    const handlePromptInput = () => {
        try {
            setViewMode('edit');
            setStep(0);
            setTranscription('');
            setManualInput(true);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erreur dans handlePromptInput:', error);
        }
    };

    const handleModelInput = async (val:string) => {
        const newPromptType = val === 'event' ? 'createEvent' : 'createPet';
        setPromptType(newPromptType);

        setStep(1);
        setViewMode('edit');
        setTranscription('');
        setManualInput(true);
        setIsModalOpen(true);
    };

    return (
        <>
            <Dropdown
                placement={`bottom-end`}
                btnClassName="btn btn-primary dropdown-toggle flex items-center justify-center w-9 h-9 "
                button={
                    <>
                        <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                    </>
                }
            >
                <ul className="!min-w-[170px]">
                    <li>
                        <button
                            type="button"
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                                if (isRecording) {
                                    stopRecording();
                                } else {
                                    handleStartRecording();
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faMicrophone} />
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                            onClick={()=>handlePromptInput()}
                        >
                            <FontAwesomeIcon icon={faKeyboard} />
                            Manual Input
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleModelInput('event')}
                        >
                            <FontAwesomeIcon icon={faCalendarDays} />
                            Add Event
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleModelInput('Pet')}
                        >
                            <FontAwesomeIcon icon={faCalendarDays} />
                            Add Pet
                        </button>
                    </li>
                </ul>
            </Dropdown>

            { promptType &&
                <ActionModal
                    key={promptType}
                    initialStep={step} // Passer step comme prop
                    isOpen={isModalOpen}
                    onClose={handleClose} // Réinitialise et ferme la modal
                    transcription={transcription}
                    initialPromptType={promptType}
                    initialViewMode={viewMode}
                    setTranscription={setTranscription} // Met à jour la transcription
                    isManualInput={manualInput} // Passe le mode manuel ou vocal
                />}
        </>
    );
};

export default CTAButton;


