import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,} from 'react';
import {
    modelService
} from '../../../services';

const PetForm = forwardRef(({ petFormData , onSubmit, onChange, onCancel,submitable=false }: any, ref) => {
    const formatBirthDate = (birthDate: { seconds?: number } | string | null): string => {
        if (!birthDate) return '';
        if (typeof birthDate === 'string') return birthDate;
        if (birthDate.seconds) {
            return new Date(birthDate.seconds * 1000).toISOString().split('T')[0];
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('handleSubmit', petFormData);
        try {
            if (!petFormData.name || !petFormData.breed || !petFormData.species) {
                alert("Les champs name ,espece et race  sont obligatoires !");
                return;
            }

            if (petFormData.id) {
                // Mise à jour
                await modelService.update("pets", petFormData.id, petFormData);
                alert("Événement mis à jour avec succès !");
            } else {
                // Création
                const newId = await modelService.add("pets", petFormData);
                alert(`Animal créé avec succès ! ID : ${newId}`);
            }

            if (onSubmit) {
                onSubmit(petFormData);
            }
        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
            alert("Une erreur est survenue lors de la soumission.");
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    return (
        <div>
            <h6 className="text-lg font-bold mb-5">Informations générales</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="name">Nom*</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={petFormData.name}
                        onChange={onChange}
                        placeholder="Entrez le nom de l'animal"
                        className="form-input"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="species">Espèce*</label>
                    <select
                        id="species"
                        name="species"
                        value={petFormData.species}
                        onChange={onChange}
                        className="form-select text-white-dark"
                    >
                        <option value="dog">Chien</option>
                        <option value="cat">Chat</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="breed">Race</label>
                    <input
                        id="breed"
                        name="breed"
                        type="text"
                        value={petFormData.breed}
                        onChange={onChange}
                        placeholder="Entrez la race"
                        className="form-input"
                    />
                </div>

                <div>
                    <label htmlFor="birthDate">Date de naissance</label>
                    <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formatBirthDate(petFormData.birthDate ?? null)}
                        onChange={onChange}
                        className="form-input"
                    />
                </div>
                <div>
                    <label htmlFor="isActive" className="inline-flex items-center">
                        <input
                            id="isActive"
                            name="isActive"
                            type="checkbox"
                            checked={petFormData.isActive}
                            onChange={onChange}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Actif</span>
                    </label>
                </div>
            </div>

            {submitable && <div
                className="flex justify-end space-x-4 mt-5">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(petFormData);
                    }}
                    className="btn btn-primary">
                    Enregistrer
                </button>
            </div>}
        </div>
    );
});

export default PetForm;
