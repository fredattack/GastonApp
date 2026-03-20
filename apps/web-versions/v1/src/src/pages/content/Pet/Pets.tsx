import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { faPlus, faPaw } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePets } from "../../../contexts/PetsContext";
import PetsCard from "../../../components/Pets/index/PetsCard"; // @ts-ignore
import { useToast } from "../../../providers/ToastProvider";
import { useIcons } from "../../../providers/FontawesomeProvider";
import { modelService } from "../../../services";

type DeletionQueueItem = {
    id: string;
    timeout: NodeJS.Timeout | null;
    data: Pet | undefined;
};

const Pets = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const { pets, refreshPets } = usePets();

    const [deletionQueue, setDeletionQueue] = useState<DeletionQueueItem[]>([]);

    useEffect(() => {
        refreshPets();
    }, []);

    const filteredData = pets?.filter((pet) =>
        search ? pet.name.toLowerCase().includes(search.toLowerCase()) : true,
    );

    const generateActions = (id: number | string) => {
        const pet = pets.find((pet) => pet.id == id);
        return [
            {
                label: "Edit",
                onClick: () => handleEdit(id),
            },
            {
                label: pet?.isActive ? "Set Inactive" : "Set Active",
                onClick: () => toggleActiveStatus(id),
            },
            {
                label: "Set Deceased",
                onClick: () => setDeceased(id),
            },
            {
                label: "Delete",
                onClick: () => deleteAnimal(id),
            },
            {
                label: "Add Treatment",
                onClick: () => addTreatment(id),
            },
            {
                label: "Add Menu",
                onClick: () => addMenu(id),
            },
            {
                label: "Add Rendezvous",
                onClick: () => addRendezvous(id),
            },
        ];
    };

    const handleCreate = () => {
        navigate("/content/pets/create");
    };

    // Method to handle edit
    const handleEdit = (id: number | string) => {
        console.log(`Editing animal with ID: ${id}`);
        navigate(`/content/pets/${id}`);
        // Add your logic to open an edit form/modal
    };

    // Method to toggle active/inactive status
    const toggleActiveStatus = (id: number | string) => {
        console.log(`Toggling active status for animal ID: ${id}`);
        // Add logic to toggle the animal's active status
    };

    // Method to set the animal as deceased
    const setDeceased = (id: number | string) => {
        console.log(`Setting animal ID: ${id} as deceased`);
        // Add your logic to update the deceased status
    };

    // Method to delete the animal
    const deleteAnimal = async (id: number | string) => {
        console.log(`Preparing to delete animal with ID: ${id}`);

        // Sauvegarde temporaire de l'animal supprimé
        const petToDelete = pets.find((pet) => pet.id === id);

        if (!petToDelete) {
            addToast({ message: "Pet not found", type: "error" });
            return;
        }

        // Ajouter l'animal à la file d'attente
        setDeletionQueue((prevQueue: any) => [
            ...prevQueue,
            {
                id: String(id),
                timeout: null,
                data: petToDelete,
            },
        ]);

        const timeout = setTimeout(async () => {
            try {
                // ACTUALLY DELETE THE PET FROM DATABASE
                await modelService.delete("pets", petToDelete);

                console.log(`Animal with ID: ${id} successfully deleted.`);
                addToast({
                    message: "Pet deleted successfully",
                    type: "success",
                });

                // Supprimer l'animal de la file d'attente
                setDeletionQueue((prevQueue) =>
                    prevQueue.filter((item) => item.id !== String(id)),
                );

                // Refresh pet list from server
                refreshPets();
            } catch (error) {
                console.error(`Error deleting animal with ID: ${id}`, error);
                addToast({ message: "Failed to delete pet", type: "error" });

                // Remove from queue on error
                setDeletionQueue((prevQueue) =>
                    prevQueue.filter((item) => item.id !== String(id)),
                );
            }
        }, 10000); // 10 secondes

        setDeletionQueue((prevQueue) =>
            prevQueue.map((item) =>
                item.id === String(id)
                    ? {
                          ...item,
                          timeout,
                      }
                    : item,
            ),
        );
    };

    const undoDelete = (id: number | string) => {
        const item = deletionQueue.find((entry) => entry.id === id);
        console.log("item", item);
        if (item) {
            clearTimeout(item.timeout!);
            setDeletionQueue((prevQueue) =>
                prevQueue.filter((entry) => entry.id !== id),
            );
        }
    };
    // Method to add a treatment
    const addTreatment = (id: number | string) => {
        console.log(`Adding treatment for animal ID: ${id}`);
        // Add logic to handle treatment addition
    };

    // Method to add a menu
    const addMenu = (id: number | string) => {
        console.log(`Adding menu for animal ID: ${id}`);
        // Add logic to handle menu addition
    };

    // Method to add a rendezvous
    const addRendezvous = (id: number | string) => {
        console.log(`Adding rendezvous for animal ID: ${id}`);
        // Add logic to handle rendezvous scheduling
    };

    const icons = useIcons();

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-5 gap-5">
                    {/* Titre */}
                    <h5 className="font-semibold text-lg dark:text-white-light capitalize">
                        <FontAwesomeIcon icon={faPaw} /> {t("my_pets")}
                    </h5>

                    {/* Bouton et Search */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-2 w-full md:w-auto">
                        {/* Bouton */}
                        <button
                            onClick={handleCreate}
                            className="btn btn-primary self-end md:self-auto"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>

                        {/* Search Input */}
                        <div className="flex items-center justify-end w-full">
                            <input
                                type="text"
                                className="form-input w-full md:w-auto md:ml-2"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {// @ts-ignore
                        filteredData?.map((pet: Pet) => {
                            const actions = generateActions(pet.id);
                            return (
                                <PetsCard
                                    key={pet.id || Math.random()} // Utiliser une clé de secours
                                    pet={pet}
                                    actions={actions}
                                />
                            );
                        })}
                    </div>
                }
            </div>
        </div>
    );
};

export default Pets;
