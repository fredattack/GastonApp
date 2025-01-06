import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

import PetFormInfo
// @ts-ignore
    from '@c/Pets/form/PetFormInfo';

//@ts-ignore
import {Pet} from "@/types/global";

const PetForm = ({ pet, onSubmit }: { pet?: Pet; onSubmit: (formData: any) => void }) => {

    const { id } = useParams();

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        species: "",
        breed: "",
        birthDate: "",
        isActive: true,
    });
    const [activeTab, setActiveTab] = useState("infos");
    const fetchPetById = async (id:string) => {
        try {
            const petRef = doc(db, "pets", id); // Accès au document Pet par ID
            const petSnap = await getDoc(petRef);

            if (petSnap.exists()) {
                const petData = petSnap.data();
                setFormData({
                    name: petData.name || "",
                    species: petData.species || "dog",
                    breed: petData.breed || "",
                    birthDate: petData.birth_date || "",
                    isActive: petData.isActive ?? true,
                });
            } else {
                console.log("No pet found with the given ID.");
            }
        } catch (error) {
            console.error("Error fetching pet data:", error);
        }
    };

    // Pré-remplir les champs si un pet est fourni ou si l'ID est présent
    useEffect(() => {
        if (pet) {
            setFormData({
                name: pet.name || "",
                species: pet.species || "Chien",
                breed: pet.breed || "",
                birthDate: pet.birthDate || "",

                isActive: pet.isActive ?? true,
            });
        } else if (id) {
            fetchPetById(id);
            console.log(`Fetching pet data for ID: ${id}`);
        }
    }, [pet, id]);

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

    let title = id ? "Modifier un animal" : "Créer un animal";
    return (
        <div className="pet-form-container">
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <a href="#" className="text-primary hover:underline">
                        Animaux
                    </a>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{title}</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">
                        {title}
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
