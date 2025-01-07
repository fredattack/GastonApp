import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    where
} from 'firebase/firestore';
import {
    db
} from '../../../../firebaseConfig';

import {
    useEffect,
    useState
} from 'react';

import PetsCard
// @ts-ignore
    from '@c/Pets/index/PetsCard';
import {
    useToast
} from '../../../providers/ToastProvider';

import {
    useTranslation
} from 'react-i18next';

import {
    useNavigate
} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useIcons } from '../../../providers/FontawesomeProvider';


type DeletionQueueItem = {
    id: string;
    timeout: NodeJS.Timeout | null;
    data: Pet | undefined;
};

function Pets() {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [pets, setPets] = useState<Pet[]>([]);
    const [deletionQueue, setDeletionQueue] = useState<DeletionQueueItem[]>([]);


    const fetchPets = async () => {
        try {
            const authId = 'vB6WiAAmU8PsKg9chwip';
            const ownerRef = doc(db, 'users', authId);
            const petsRef = collection(db, 'pets');
            const petsQuery = query(
                petsRef,
                where('owner_id', '==', ownerRef),
                orderBy('order', 'desc')
            );

            const querySnapshot = await getDocs(petsQuery);

            const petsList: Pet[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Pet[];

            setPets(petsList);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const filteredData = pets.filter((pet) => (search ? pet.name.toLowerCase().includes(search.toLowerCase()) : true));

    const generateActions = (id: string) => {
        const pet = pets.find((pet) => pet.id == id);
        return [
            {
                label: 'Edit',
                onClick: () => handleEdit(id)
            },
            {
                label: pet?.is_active ? 'Set Inactive' : 'Set Active',
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
    const deleteAnimal = async (id: string) => {
        console.log(`Deleting animal with ID: ${id}`);
        /*
                const petRef = doc(db, 'pets', id);
                deleteDoc(petRef)
                    .then(() => {
                        console.log(`Animal with ID: ${id} successfully deleted.`);
                        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
                    })
                    .catch((error) => {
                        console.error(`Error deleting animal with ID: ${id}`, error);
                    });*/
        console.log(`Preparing to delete animal with ID: ${id}`);

        // Sauvegarde temporaire de l'animal supprimé
        const petToDelete = pets.find((pet) => pet.id === id);

        // Ajouter l'animal à la file d'attente
        setDeletionQueue((prevQueue) => [
            ...prevQueue,
            {
                id,
                timeout: null,
                data: petToDelete
            }
        ]);


        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));

        const petRef = doc(db, 'pets', id);
        const petSnap = await getDoc(petRef);
        const petData = petSnap.data();

        addToast({
            message: `Animal ${petData?.name ?? 'Unknown'} successfully deleted.`,
            type: 'info',
            action: () => undoDelete(id),
            actionLabel: 'Undo'
        });

        const timeout = setTimeout(async () => {
            try {
                    await deleteDoc(petRef);
                    console.log(`Animal with ID: ${id} successfully deleted.`);

                // Supprimer l'animal de la file d'attente
                setDeletionQueue((prevQueue) =>
                    prevQueue.filter((item) => item.id !== id)
                );
            } catch (error) {
                console.error(`Error deleting animal with ID: ${id}`, error);
            }
        }, 10000); // 10 secondes


        setDeletionQueue((prevQueue) =>
            prevQueue.map((item) =>
                item.id === id ? {
                    ...item,
                    timeout
                } : item
            )
        );
    };

    const undoDelete = (id: string) => {

        const item = deletionQueue.find((entry) => entry.id === id);
        console.log('item', item);
        if (item) {
            clearTimeout(item.timeout!);
            setDeletionQueue((prevQueue) =>
                prevQueue.filter((entry) => entry.id !== id)
            );

            setPets((prevPets) => [...prevPets, item.data!].sort((a:Pet, b:Pet) => (b.order || 0) - (a.order || 0)));
        }
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

    const icons = useIcons();

    return (
        <div>
            <div
                className="panel mt-6">

                <div
                    className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-5 gap-5">
                    {/* Titre */}
                    <h5 className="font-semibold text-lg dark:text-white-light capitalize">
                        {/*// @ts-ignore*/}
                        <FontAwesomeIcon icon={icons.paw} />  {t('my_pets')}
                    </h5>

                    {/* Bouton et Search */}
                    <div
                        className="flex flex-col md:flex-row gap-4 md:gap-2 w-full md:w-auto">
                        {/* Bouton */}
                        <button
                            onClick={handleCreate}
                            className="btn btn-primary self-end md:self-auto"
                        >
                            +
                        </button>

                        {/* Search Input */}
                        <div
                            className="flex items-center justify-end w-full">
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
