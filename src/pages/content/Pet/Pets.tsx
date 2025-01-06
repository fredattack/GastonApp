import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useState, useEffect } from "react";



import PetsCard
// @ts-ignore
    from '@c/Pets/index/PetsCard';

import {
    useTranslation
} from 'react-i18next';
import { useNavigate } from 'react-router-dom';


function Pets() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [pets, setPets] = useState<Pet[]>([]);

    const fetchPets = async () => {
        try {
            // Create a query to fetch data sorted by 'order'
            const petsQuery = query(collection(db, "pets"), orderBy("order", "asc")); // Use 'desc' for descending order
            const querySnapshot = await getDocs(petsQuery);

            const petsList: Pet[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Pet[];

            setPets(petsList);
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const filteredData = pets.filter((pet) => (search ? pet.name.toLowerCase().includes(search.toLowerCase()) : true));

    const generateActions = (id: string) => {
        const pet = pets.find((pet) => pet.id == id);
        console.log('id', id);
        return [
            {
                label: 'Edit',
                onClick: () => handleEdit(id)
            },
            {
                label: pet?.isActive ? 'Set Inactive' : 'Set Active',
                onClick: () => toggleActiveStatus(id)
            },
            {
                label: 'Set Deceased',
                onClick: () => setDeceased(id)
            },
            {
                label: 'Delete',
                onClick: () => deleteAnimal(id)
            },
            {
                label: 'Add Treatment',
                onClick: () => addTreatment(id)
            },
            {
                label: 'Add Menu',
                onClick: () => addMenu(id)
            },
            {
                label: 'Add Rendezvous',
                onClick: () => addRendezvous(id)
            }
        ];
    };

    const handleCreate = () => {
        navigate('/content/pets/create');
    };

    // Method to handle edit
    const handleEdit = (id: string) => {
        console.log(`Editing animal with ID: ${id}`);
        navigate(`/content/pets/${id}`);
        // Add your logic to open an edit form/modal
    };

    // Method to toggle active/inactive status
    const toggleActiveStatus = (id: string) => {
        console.log(`Toggling active status for animal ID: ${id}`);
        // Add logic to toggle the animal's active status
    };

    // Method to set the animal as deceased
    const setDeceased = (id: string) => {
        console.log(`Setting animal ID: ${id} as deceased`);
        // Add your logic to update the deceased status
    };

    // Method to delete the animal
    const deleteAnimal = (id: string) => {
        console.log(`Deleting animal with ID: ${id}`);
        // Add logic to delete the animal
    };

    // Method to add a treatment
    const addTreatment = (id: string) => {
        console.log(`Adding treatment for animal ID: ${id}`);
        // Add logic to handle treatment addition
    };

    // Method to add a menu
    const addMenu = (id: string) => {
        console.log(`Adding menu for animal ID: ${id}`);
        // Add logic to handle menu addition
    };

    // Method to add a rendezvous
    const addRendezvous = (id: string) => {
        console.log(`Adding rendezvous for animal ID: ${id}`);
        // Add logic to handle rendezvous scheduling
    };


    return (
        <div>
            <div
                className="panel mt-6">

                <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-5 gap-5">
                    {/* Titre */}
                    <h5 className="font-semibold text-lg dark:text-white-light capitalize">
                        {t('my_pets')}
                    </h5>

                    {/* Bouton et Search */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-2 w-full md:w-auto">
                        {/* Bouton */}
                        <button
                            onClick={handleCreate}
                            className="btn btn-primary self-end md:self-auto"
                        >
                            +
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
                {(
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            // @ts-ignore
                            filteredData.map((pet: Pet) => {
                                let actions = generateActions(pet.id);

                                console.log(    'pet', pet);
                                return (
                                    <PetsCard
                                        key={pet.id || Math.random()} // Utiliser une clé de secours
                                        pet={pet}
                                        actions={actions}
                                    />
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pets;
