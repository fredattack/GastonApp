import React, { useState } from 'react';

interface SpeechRecognitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transcription: string;
    setTranscription: (value: string) => void;
    onSave: () => void;
    isManualInput: boolean;
}

const SpeechRecognitionModal: React.FC<SpeechRecognitionModalProps> = ({
                                                                           isOpen,
                                                                           onClose,
                                                                           transcription,
                                                                           setTranscription,
                                                                           onSave,
                                                                           isManualInput,
                                                                       }) => {
    const [step, setStep] = useState(0);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step < 2) setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep((prev) => prev - 1);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                {step === 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            {isManualInput ? 'Étape 1 : Saisissez votre texte' : 'Étape 1 : Enregistrement'}
                        </h2>
                        <textarea
                            className="w-full h-32 p-2 border rounded"
                            value={transcription}
                            onChange={(e) => {
                                if (isManualInput) {
                                    setTranscription(e.target.value); // Mettre à jour pour l'entrée manuelle
                                }
                            }}
                            readOnly={!isManualInput} // Lecture seule sauf pour l'entrée manuelle
                        ></textarea>
                        <p className="text-sm text-gray-600 mt-2">
                            {isManualInput
                                ? 'Saisissez votre texte dans la zone ci-dessus.'
                                : 'Parlez pour ajouter du texte.'}
                        </p>
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Étape 2 : Modification</h2>
                        <textarea
                            className="w-full h-32 p-2 border rounded"
                            value={transcription}
                            onChange={(e) => setTranscription(e.target.value)} // Permet la modification
                        ></textarea>
                        <p className="text-sm text-gray-600 mt-2">Modifiez le texte si nécessaire.</p>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Étape 3 : Confirmation</h2>
                        <p className="mb-4">Le texte suivant sera enregistré :</p>
                        <textarea
                            className="w-full h-32 p-2 border rounded"
                            value={transcription}
                            readOnly
                        ></textarea>
                        <p className="text-sm text-gray-600 mt-2">Cliquez sur "Enregistrer" pour confirmer.</p>
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    {step > 0 && (
                        <button
                            onClick={handleBack}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                        >
                            Retour
                        </button>
                    )}
                    {step < 2 && (
                        <button
                            onClick={handleNext}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Suivant
                        </button>
                    )}
                    {step === 2 && (
                        <button
                            onClick={onSave}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Enregistrer
                        </button>
                    )}
                    <button
                        onClick={onClose} // Ferme la modal
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
