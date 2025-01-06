import React from "react";

const PetFormInfo = ({
    formData,
    handleChange,
    onCancel,
    onSubmit,
}: {
    formData: {
        name: string;
        species: string;
        breed?: string;
        birthDate?: { seconds: number; nanoseconds?: number };
        isActive: boolean;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCancel: () => void;
    onSubmit: (formData: {
        name: string;
        species: string;
        breed?: string;
        birthDate?: { seconds: number; nanoseconds?: number };
        isActive: boolean;
    }) => void;
}) => {
    const formatBirthDate = (birthDate: { seconds?: number } | string | null): string => {
        if (!birthDate) return '';
        if (typeof birthDate === 'string') return birthDate;
        if (birthDate.seconds) {
            return new Date(birthDate.seconds * 1000).toISOString().split('T')[0];
        }
        return '';
    };
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
                        value={formData.name}
                        onChange={handleChange}
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
                        value={formData.species}
                        onChange={handleChange}
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
                        value={formData.breed}
                        onChange={handleChange}
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
                        value={formatBirthDate(formData.birthDate ?? null)}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div>
                    <label htmlFor="isActive" className="inline-flex items-center">
                        <input
                            id="isActive"
                            name="isActive"
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Actif</span>
                    </label>
                </div>
            </div>
            <div className="flex justify-end space-x-4 mt-5">
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
                        onSubmit(formData);
                    }}
                    className="btn btn-primary">
                    Enregistrer
                </button>
            </div>
        </div>
    );
};

export default PetFormInfo;
