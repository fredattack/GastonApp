import React, { useState, useEffect } from "react";

const PetForm = ({ animal, onSubmit, onCancel }) => {
    // Initial state for the form
    const [formData, setFormData] = useState({
        name: "",
        species: "Chien",
        breed: "",
        dateOfBirth: "",
        photo: "",
        isActive: true,
    });

    // Pre-fill the form if editing an existing animal
    useEffect(() => {
        if (animal) {
            setFormData({
                name: animal.name || "",
                species: animal.species || "Chien",
                breed: animal.breed || "",
                dateOfBirth: animal.dateOfBirth || "",
                photo: animal.photo || "",
                isActive: animal.isActive ?? true,
            });
        }
    }, [animal]);

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.species) {
            alert("Veuillez remplir tous les champs obligatoires !");
            return;
        }
        onSubmit(formData); // Pass data to the parent
    };

    return (
        <div className="animal-form-container">
            <h2>{animal ? "Modifier un animal" : "Créer un animal"}</h2>
            <form onSubmit={handleSubmit} className="animal-form">
                {/* Name */}
                <div className="form-group">
                    <label htmlFor="name">Nom*</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Entrez le nom de l'animal"
                    />
                </div>

                {/* Species */}
                <div className="form-group">
                    <label htmlFor="species">Espèce*</label>
                    <select
                        id="species"
                        name="species"
                        value={formData.species}
                        onChange={handleChange}
                    >
                        <option value="Chien">Chien</option>
                        <option value="Chat">Chat</option>
                    </select>
                </div>

                {/* Breed */}
                <div className="form-group">
                    <label htmlFor="breed">Race</label>
                    <input
                        type="text"
                        id="breed"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        placeholder="Entrez la race (facultatif)"
                    />
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date de naissance</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>

                {/* Photo */}
                <div className="form-group">
                    <label htmlFor="photo">URL de la photo</label>
                    <input
                        type="url"
                        id="photo"
                        name="photo"
                        value={formData.photo}
                        onChange={handleChange}
                        placeholder="Entrez l'URL de la photo"
                    />
                </div>

                {/* Active Status */}
                <div className="form-group">
                    <label htmlFor="isActive">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        Actif
                    </label>
                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {animal ? "Enregistrer" : "Créer"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PetForm;
