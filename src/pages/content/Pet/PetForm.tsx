import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc,collection, addDoc,updateDoc,getDocs,query, where, orderBy } from "firebase/firestore";

import { db } from "../../../../firebaseConfig";
import { useToast } from "../../../providers/ToastProvider";


import PetFormInfo
// @ts-ignore
    from '@c/Pets/form/PetFormInfo';

//@ts-ignore
import {Pet} from "@/types/global";
interface PetData {
    name: string;
    species: string;
    breed: string;
    owner_id: string;
    birthDate: Date | string; // Date ou chaîne, selon le format attendu
    isActive: boolean;
}
const PetForm = ({ pet }: { pet?: Pet}) => {
const { addToast } = useToast();


    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        species: "",
        breed: "",
        birthDate: "",
        owner_id: "",
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
                    owner_id: petData.ownerId || "",
                    isActive: petData.isActive ?? true,
                });
            } else {
                console.log("No pet found with the given ID.");
            }
        } catch (error) {
            console.error("Error fetching pet data:", error);
        }
    };

    useEffect(() => {
        if (pet) {
            setFormData({
                name: pet.name || "",
                species: pet.species || "Chien",
                breed: pet.breed || "",
                birthDate: pet.birthDate || "",
                owner_id: pet.ownerId || "",
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
    const addPet = async (petData:PetData) => {
        try {
            const authId = "vB6WiAAmU8PsKg9chwip";

            const petsRef = collection(db, "pets");
            const ownerRef = doc(db, "users", authId);

            const petsQuery = query(
                petsRef,
                where("owner_id", "==", ownerRef),
                orderBy("order", "desc")
            );
            const querySnapshot = await getDocs(petsQuery);

            const maxOrder = querySnapshot.docs.length > 0
                ? querySnapshot.docs[0].data().order
                : 0;

            // Calculer la nouvelle valeur pour "order"
            const newOrder = maxOrder? maxOrder + 1 : 1;

            const data = {
                name: petData.name,
                species: petData.species,
                breed: petData.breed,
                birth_date: petData.birthDate, // Assurez-vous que c'est au bon format
                isActive: true,
                owner_id : ownerRef,
                created_at: new Date(), // Ajoute une date de création
                order:newOrder,
            };
            const docRef = await addDoc(collection(db, "pets"), data);

            console.log("Pet successfully added with ID:", docRef.id);
            addToast({
                message: "Pet successfully added!",
                type: "success",
            })
            return docRef.id;
        } catch (error) {
            console.error("Error adding pet:", error);
            throw error;
        }
    };
    const updatePet = async (id:string, petData:PetData) => {
        try {
            // Référence au document dans Firestore
            const petRef = doc(db, "pets", id);

            // Mise à jour des champs du document
            await updateDoc(petRef, {
                name: petData.name,
                species: petData.species,
                breed: petData.breed,
                birth_date: petData.birthDate, // Assurez-vous que c'est au bon format
                isActive: petData.isActive,
                updated_at: new Date(), // Ajoute une date de mise à jour
            });

            console.log("Pet successfully updated!");
            addToast({
                message: "Pet successfully updated!",
                type: "success",
            })
        } catch (error) {
            console.error("Error updating pet:", error);
            throw error;
        }
    };

    const handleCancel = () => {
        navigate("/content/pets");
    };
    const handleSubmit = async (formData :PetData) => {

        if (id) {
            try {
                await updatePet(id, formData);
                console.log("Pet successfully updated!");
                navigate("/content/pets"); // Redirection après mise à jour
            } catch (error) {
                console.error("Failed to update pet:", error);
            }
        } else {

            try {
                await addPet(formData);
                console.log("Pet successfully added!");
                navigate("/content/pets");
            } catch (error) {
                console.error("Failed to add pet:", error);
            }
        }
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
                        onSubmit={handleSubmit}
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
                        handleSubmit(formData);
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
