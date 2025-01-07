import React, { useState } from 'react';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import SpeechRecognitionModal from '../Modal/SpeechRecognitionModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faKeyboard } from '@fortawesome/free-solid-svg-icons';

const SpeechButton = () => {
    const { isRecording, startRecording, stopRecording } = useSpeechRecognition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transcription, setTranscription] = useState(''); // État local pour la transcription
    const [manualInput, setManualInput] = useState(false); // Différencier mode vocal et prompt

    const handleSave = () => {
        console.log("Texte final enregistré :", transcription);
        setIsModalOpen(false);
        setTranscription(''); // Réinitialise la transcription après sauvegarde
    };

    const handleClose = () => {
        setIsModalOpen(false); // Fermer la modal
        setTranscription(''); // Réinitialise la transcription lorsque la modal est fermée
        setManualInput(false); // Réinitialise le mode manuel
    };

    const handleStartRecording = () => {
        setTranscription(''); // Réinitialise la transcription avant de commencer
        setManualInput(false); // Désactiver le mode manuel
        startRecording();
        setIsModalOpen(true); // Ouvrir la modal
    };

    const handlePromptInput = () => {
        setTranscription(''); // Réinitialise la transcription
        setManualInput(true); // Activer le mode manuel
        setIsModalOpen(true); // Ouvrir la modal
    };

    return (
        <>
            <div className="flex gap-4">
                {/* Bouton pour l'enregistrement vocal */}
                <button
                    className={`flex items-center justify-center w-9 h-9 rounded-full ${
                            isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-amber-300 text-white hover:bg-amber-700'
                    }`}
                    onClick={() => {
                        if (isRecording) {
                            stopRecording();
                        } else {
                            handleStartRecording();
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faMicrophone} className="w-5 h-5" />
                </button>

                {/* Bouton pour l'entrée manuelle */}
                <button
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-lime-300 text-white hover:bg-lime-700"
                    onClick={handlePromptInput}
                >
                    <FontAwesomeIcon icon={faKeyboard} className="w-5 h-5" />
                </button>
            </div>

            <SpeechRecognitionModal
                isOpen={isModalOpen}
                onClose={handleClose} // Réinitialise et ferme la modal
                transcription={transcription}
                setTranscription={setTranscription} // Met à jour la transcription
                onSave={handleSave} // Sauvegarde la transcription
                //@ts-ignore
                isManualInput={manualInput} // Passe le mode manuel ou vocal
            />
        </>
    );
};

export default SpeechButton;


