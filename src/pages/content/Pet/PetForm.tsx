import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PetFormInfo
// @ts-ignore
    from '@c/Pets/form/PetFormInfo';

const PetForm = ({ animal, onSubmit }: { animal?: { name?: string; species?: string; breed?: string; dateOfBirth?: string; photo?: string; isActive?: boolean }; onSubmit: (formData: any) => void }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        species: "Chien",
        breed: "",
        dateOfBirth: "",
        photo: "",
        isActive: true,
    });
    const [activeTab, setActiveTab] = useState("infos");

    // Pré-remplir les champs si un animal est fourni ou si l'ID est présent
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
        } else if (id) {
            console.log(`Fetching animal data for ID: ${id}`);
            // Logique pour récupérer les données d'un animal par ID
        }
    }, [animal, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCancel = () => {
        navigate("/content/pets");
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "infos":
                return (
                    <PetFormInfo
                        formData={formData}
                        handleChange={handleChange}
                        onCancel={handleCancel}
                        onSubmit={onSubmit}
                    />
                );
            case "cares":
                return <div><h6>Cares</h6>Section des soins.</div>;
            case "fooding":
                return <div><h6>Fooding</h6>Section de l'alimentation.</div>;
            case "galleries":
                return <div><h6>Galleries</h6>Galeries de photos.</div>;
            case "events":
                return <div><h6>Events</h6>Événements associés.</div>;
            case "timeline":
                return <div><h6>Timeline</h6>Chronologie des événements.</div>;
            default:
                return null;
        }
    };

    return (
        <div className="pet-form-container">
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <a href="#" className="text-primary hover:underline">
                        Animaux
                    </a>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{id ? "Modifier un animal" : "Créer un animal"}</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">
                        {id ? "Modifier un animal" : "Créer un animal"}
                    </h5>
                </div>

                {id && (
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        {["infos", "cares", "fooding", "galleries", "events", "timeline"].map((tab) => (
                            <li className="inline-block" key={tab}>
                                <button
                                    onClick={() => handleTabClick(tab)}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${
                                        activeTab === tab ? "!border-primary text-primary" : ""
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(formData);
                    }}
                    className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 bg-white dark:bg-black"
                >
                    {renderTabContent()}
                </form>
            </div>
        </div>
    );
};

export default PetForm;
