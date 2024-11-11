import React, {
    useState
} from 'react';

import PetsTable
// @ts-ignore
    from '@c/Pets/PetsTable';
import PetsCard
// @ts-ignore
    from '@c/Pets/PetsCard';
import ColumnSelector
// @ts-ignore
    from '@c/Shared/ColumnSelector';
import {
    useTranslation
} from 'react-i18next';

import IconMenuPages
    from '../../../components/Icon/Menu/IconMenuPages';
import IconMenuTables
    from '../../../components/Icon/Menu/IconMenuTables';
import DropdownMenu
    from '../../../components/Shared/DropdownMenu';

type Column = {
    accessor: string;
    title: string;
    render?: (row: any) => string;
};
const rowData = [
    {
        id: 1,
        ownerId: '01',
        name: 'Rex',
        species: 'Chien',
        breed: 'Golden Retriever',
        dateOfBirth: '2018-06-15',
        photo: 'https://example.com/photos/rex.jpg',
        tasks: ['task_01', 'task_02'],
        isActive: true,
        createdAt: '2024-11-10T09:00:00Z'
    },
    {
        id: 2,
        ownerId: '01',
        name: 'Bella',
        species: 'Chien',
        breed: 'Labrador Retriever',
        dateOfBirth: '2019-03-10',
        photo: 'https://example.com/photos/bella.jpg',
        tasks: ['task_03', 'task_04'],
        isActive: true,
        createdAt: '2024-11-10T09:15:00Z'
    },
    {
        id: 3,
        ownerId: '02',
        name: 'Max',
        species: 'Chien',
        breed: 'German Shepherd',
        dateOfBirth: '2017-12-22',
        photo: 'https://example.com/photos/max.jpg',
        tasks: ['task_05'],
        isActive: true,
        createdAt: '2024-11-10T09:30:00Z'
    },
    {
        id: 4,
        ownerId: '03',
        name: 'Lucy',
        species: 'Chien',
        breed: 'Bulldog',
        dateOfBirth: '2020-08-08',
        photo: 'https://example.com/photos/lucy.jpg',
        tasks: ['task_06', 'task_07'],
        isActive: true,
        createdAt: '2024-11-10T09:45:00Z'
    },
    {
        id: 5,
        ownerId: '01',
        name: 'Mimi',
        species: 'Chat',
        breed: 'Siamese',
        dateOfBirth: '2021-04-12',
        photo: 'https://example.com/photos/mimi.jpg',
        tasks: ['task_08'],
        isActive: true,
        createdAt: '2024-11-10T10:00:00Z'
    },
    {
        id: 6,
        ownerId: '02',
        name: 'Tom',
        species: 'Chat',
        breed: 'Maine Coon',
        dateOfBirth: '2019-11-25',
        photo: 'https://example.com/photos/tom.jpg',
        tasks: ['task_09'],
        isActive: true,
        createdAt: '2024-11-10T10:15:00Z'
    },
    {
        id: 7,
        ownerId: '03',
        name: 'Luna',
        species: 'Chat',
        breed: 'Persian',
        dateOfBirth: '2020-01-30',
        photo: 'https://example.com/photos/luna.jpg',
        tasks: ['task_10', 'task_11'],
        isActive: true,
        createdAt: '2024-11-10T10:30:00Z'
    },
    {
        id: 8,
        ownerId: '01',
        name: 'Simba',
        species: 'Chat',
        breed: 'Bengal',
        dateOfBirth: '2018-07-19',
        photo: 'https://example.com/photos/simba.jpg',
        tasks: ['task_12'],
        isActive: true,
        createdAt: '2024-11-10T10:45:00Z'
    },
    {
        id: 9,
        ownerId: '02',
        name: 'Shadow',
        species: 'Chat',
        breed: 'Sphinx',
        dateOfBirth: '2019-05-06',
        photo: 'https://example.com/photos/shadow.jpg',
        tasks: ['task_13', 'task_14'],
        isActive: true,
        createdAt: '2024-11-10T11:00:00Z'
    },
    {
        id: 10,
        ownerId: '03',
        name: 'Mochi',
        species: 'Chat',
        breed: 'British Short-hair',
        dateOfBirth: '2022-02-18',
        photo: 'https://example.com/photos/mochi.jpg',
        tasks: ['task_15'],
        isActive: true,
        createdAt: '2024-11-10T11:15:00Z'
    },
    {
        id: 11,
        ownerId: '01',
        name: 'Nala',
        species: 'Chat',
        breed: 'Russian Blue',
        dateOfBirth: '2020-10-20',
        photo: 'https://example.com/photos/nala.jpg',
        tasks: ['task_16'],
        isActive: true,
        createdAt: '2024-11-10T11:30:00Z'
    },
    {
        id: 12,
        ownerId: '02',
        name: 'Cleo',
        species: 'Chat',
        breed: 'Ragdoll',
        dateOfBirth: '2021-06-14',
        photo: 'https://example.com/photos/cleo.jpg',
        tasks: ['task_17'],
        createdAt: '2024-11-10T11:45:00Z'
    }
];

function Pets() {
    const { t } = useTranslation();

    const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('table');
    const [search, setSearch] = useState('');
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [pageSize, setPageSize] = useState(10);

    const filteredData = rowData.filter((pet) => (search ? pet.name.toLowerCase().includes(search.toLowerCase()) : true));
    const cols: Column[] = [
        {
            accessor: 'actions',
            title: 'action',
            // @ts-ignore
            render: ({ id }: {
                id: number
            }) => {

                let actions: Action[] = generateActions(id);
                return (<DropdownMenu
                    id={id}
                    actions={actions}
                    openingDirection={'left'}
                />);
            }
        },
        {
            accessor: 'photo',
            title: t('photo'),
            // @ts-ignore
            render: ({
                         photo,
                         name
                     }: {
                photo: string,
                name: string
            }) => (
                <img
                    src={photo}
                    alt={`${name}'s photo`}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%'
                    }}
                />
            )
        },
        {
            accessor: 'id',
            title: t('id')
        }, // Identifiant unique de l'animal
        {
            accessor: 'name',
            title: t('name')
        }, // Nom de l'animal
        {
            accessor: 'species',
            title: t('species')
        }, // Espèce (Chat ou Chien)
        {
            accessor: 'breed',
            title: t('breed')
        }, // Race
        {
            accessor: 'ownerId',
            title: t('owner_id')
        }, // Identifiant du propriétaire
        {
            accessor: 'dateOfBirth',
            title: t('birthdate')
        }, // Date de naissance
        {
            accessor: 'createdAt',
            title: t('created_at')
        }, // Date d'enregistrement
        {
            accessor: 'isActive',
            title: t('is_active'),
            // @ts-ignore
            render: ({ isActive }) => (
                <div
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${isActive ? 'bg-green-50 text-green-700 ring-green-600/10' : 'bg-red-50 text-red-700 ring-red-600/10'}`}
                    style={{ textTransform: 'capitalize' }}>
                    {isActive ? t('active') : t('inactive')}
                </div>
            )

        }, // Actif
        {
            accessor: 'tasks.length',
            title: t('number_of_tasks')
        } // Nombre de tâches associées
    ];

    const generateActions = (id: number) => {
        const pet = rowData.find((pet) => pet.id == id);
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

    // Method to handle edit
    const handleEdit = (id: number) => {
        console.log(`Editing animal with ID: ${id}`);
        // Add your logic to open an edit form/modal
    };

    // Method to toggle active/inactive status
    const toggleActiveStatus = (id: number) => {
        console.log(`Toggling active status for animal ID: ${id}`);
        // Add logic to toggle the animal's active status
    };

    // Method to set the animal as deceased
    const setDeceased = (id: number) => {
        console.log(`Setting animal ID: ${id} as deceased`);
        // Add your logic to update the deceased status
    };

    // Method to delete the animal
    const deleteAnimal = (id: number) => {
        console.log(`Deleting animal with ID: ${id}`);
        // Add logic to delete the animal
    };

    // Method to add a treatment
    const addTreatment = (id: number) => {
        console.log(`Adding treatment for animal ID: ${id}`);
        // Add logic to handle treatment addition
    };

    // Method to add a menu
    const addMenu = (id: number) => {
        console.log(`Adding menu for animal ID: ${id}`);
        // Add logic to handle menu addition
    };

    // Method to add a rendezvous
    const addRendezvous = (id: number) => {
        console.log(`Adding rendezvous for animal ID: ${id}`);
        // Add logic to handle rendezvous scheduling
    };


    return (
        <div>
            <div
                className="panel mt-6">
                <div
                    className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light capitalize">{t('my_pets')}</h5>
                    <div
                        className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                        <div
                            className="flex md:items-center md:flex-row flex-col gap-5">
                            {displayMode === 'table' && (
                                <ColumnSelector
                                    columns={cols}
                                    hiddenColumns={hiddenColumns}
                                    onToggleColumn={(col: string) => {
                                        console.log('Toggling column:', col);
                                        setHiddenColumns((prev: string[]) => {
                                            console.log('COL', col);
                                            const newHiddenColumns = prev.includes(col)
                                                ? prev.filter((c) => c !== col)
                                                : [...prev, col];
                                            console.log('newHiddenColumns', newHiddenColumns);
                                            return newHiddenColumns;
                                        });
                                    }}
                                />)
                            }
                            <div
                                className="text-right">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)} />
                            </div>
                            <button
                                onClick={() => setDisplayMode(displayMode === 'table' ? 'cards' : 'table')}
                                className="flex items-center hover:border font-semibold rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                            >
                                {displayMode === 'table' ?
                                    <IconMenuPages
                                        className="w-5 h-5" /> :
                                    <IconMenuTables
                                        className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
                {displayMode === 'table' ? (
                    <PetsTable
                        data={filteredData}
                        hiddenColumns={hiddenColumns}
                        columns={cols}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                        actions={(pet: Pet) => generateActions(pet.id)}
                    />
                ) : (
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
