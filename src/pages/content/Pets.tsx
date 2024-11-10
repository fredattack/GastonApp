import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconBell from '../../components/Icon/IconBell';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import {
    useTranslation
} from 'react-i18next';
import IconMenuTables
    from '../../components/Icon/Menu/IconMenuTables';
import IconMenuElements
    from '../../components/Icon/Menu/IconMenuElements';
import IconMenuContacts
    from '../../components/Icon/Menu/IconMenuContacts';
import IconMenuPages
    from '../../components/Icon/Menu/IconMenuPages';

const rowData  = [
    {
        id: "01",
        ownerId: "01",
        name: "Rex",
        species: "Chien",
        breed: "Golden Retriever",
        dateOfBirth: "2018-06-15",
        photo: "https://example.com/photos/rex.jpg",
        tasks: ["task_01", "task_02"],
        isActive: true,
createdAt: "2024-11-10T09:00:00Z"
    },
    {
        id: "02",
        ownerId: "01",
        name: "Bella",
        species: "Chien",
        breed: "Labrador Retriever",
        dateOfBirth: "2019-03-10",
        photo: "https://example.com/photos/bella.jpg",
        tasks: ["task_03", "task_04"],
        isActive: true,
createdAt: "2024-11-10T09:15:00Z"
    },
    {
        id: "03",
        ownerId: "02",
        name: "Max",
        species: "Chien",
        breed: "German Shepherd",
        dateOfBirth: "2017-12-22",
        photo: "https://example.com/photos/max.jpg",
        tasks: ["task_05"],
        isActive: true,
createdAt: "2024-11-10T09:30:00Z"
    },
    {
        id: "04",
        ownerId: "03",
        name: "Lucy",
        species: "Chien",
        breed: "Bulldog",
        dateOfBirth: "2020-08-08",
        photo: "https://example.com/photos/lucy.jpg",
        tasks: ["task_06", "task_07"],
        isActive: true,
createdAt: "2024-11-10T09:45:00Z"
    },
    {
        id: "05",
        ownerId: "01",
        name: "Mimi",
        species: "Chat",
        breed: "Siamese",
        dateOfBirth: "2021-04-12",
        photo: "https://example.com/photos/mimi.jpg",
        tasks: ["task_08"],
        isActive: true,
createdAt: "2024-11-10T10:00:00Z"
    },
    {
        id: "06",
        ownerId: "02",
        name: "Tom",
        species: "Chat",
        breed: "Maine Coon",
        dateOfBirth: "2019-11-25",
        photo: "https://example.com/photos/tom.jpg",
        tasks: ["task_09"],
        isActive: true,
createdAt: "2024-11-10T10:15:00Z"
    },
    {
        id: "07",
        ownerId: "03",
        name: "Luna",
        species: "Chat",
        breed: "Persian",
        dateOfBirth: "2020-01-30",
        photo: "https://example.com/photos/luna.jpg",
        tasks: ["task_10", "task_11"],
        isActive: true,
createdAt: "2024-11-10T10:30:00Z"
    },
    {
        id: "08",
        ownerId: "01",
        name: "Simba",
        species: "Chat",
        breed: "Bengal",
        dateOfBirth: "2018-07-19",
        photo: "https://example.com/photos/simba.jpg",
        tasks: ["task_12"],
        isActive: true,
createdAt: "2024-11-10T10:45:00Z"
    },
    {
        id: "09",
        ownerId: "02",
        name: "Shadow",
        species: "Chat",
        breed: "Sphynx",
        dateOfBirth: "2019-05-06",
        photo: "https://example.com/photos/shadow.jpg",
        tasks: ["task_13", "task_14"],
        isActive: true,
createdAt: "2024-11-10T11:00:00Z"
    },
    {
        id: "10",
        ownerId: "03",
        name: "Mochi",
        species: "Chat",
        breed: "British Shorthair",
        dateOfBirth: "2022-02-18",
        photo: "https://example.com/photos/mochi.jpg",
        tasks: ["task_15"],
        isActive: true,
createdAt: "2024-11-10T11:15:00Z"
    },
    {
        id: "11",
        ownerId: "01",
        name: "Nala",
        species: "Chat",
        breed: "Russian Blue",
        dateOfBirth: "2020-10-20",
        photo: "https://example.com/photos/nala.jpg",
        tasks: ["task_16"],
        isActive: true,
createdAt: "2024-11-10T11:30:00Z"
    },
    {
        id: "12",
        ownerId: "02",
        name: "Cleo",
        species: "Chat",
        breed: "Ragdoll",
        dateOfBirth: "2021-06-14",
        photo: "https://example.com/photos/cleo.jpg",
        tasks: ["task_17"],
        createdAt: "2024-11-10T11:45:00Z"
    }
];


const Pets = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Column Chooser Table'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // show/hide
    const [page, setPage] = useState(1);
    const [displayMode, setDisplayMode] = useState('cards');
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const [hideCols, setHideCols] = useState<any>(['age', 'dateOfBirth', 'isActive']);

    const formatDate = (date: any) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    const showHideColumns = (col: any, value: any) => {
        if (hideCols.includes(col)) {
            setHideCols((col: any) => hideCols.filter((d: any) => d !== col));
        } else {
            setHideCols([...hideCols, col]);
        }
    };

    const cols = [
        { accessor: 'id', title: t('id') }, // Identifiant unique de l'animal
        { accessor: 'name', title: t('name') }, // Nom de l'animal
        { accessor: 'species', title: t('species') }, // Espèce (Chat ou Chien)
        { accessor: 'breed', title: t('breed') }, // Race
        { accessor: 'ownerId', title: t('owner_id') }, // Identifiant du propriétaire
        { accessor: 'dateOfBirth', title: t('birthdate') }, // Date de naissance
        { accessor: 'photo', title: t('photo_url') }, // URL de la photo
        { accessor: 'createdAt', title: t('created_at') }, // Date d'enregistrement
        { accessor: 'isActive', title: t('is_active') }, // Actif
        { accessor: 'tasks.length', title: t('number_of_tasks') }, // Nombre de tâches associées
    ];
    const [dropdownOpen, setDropdownOpen] = useState({});

    // Toggle the dropdown visibility for the given animal ID
    const toggleDropdown = (id) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle the specific dropdown
        }));
    };

    // Method to handle edit
    const handleEdit = (id) => {
        console.log(`Editing animal with ID: ${id}`);
        // Add your logic to open an edit form/modal
    };

    // Method to toggle active/inactive status
    const toggleActiveStatus = (id) => {
        console.log(`Toggling active status for animal ID: ${id}`);
        // Add logic to toggle the animal's active status
    };

    // Method to set the animal as deceased
    const setDeceased = (id) => {
        console.log(`Setting animal ID: ${id} as deceased`);
        // Add your logic to update the deceased status
    };

    // Method to delete the animal
    const deleteAnimal = (id) => {
        console.log(`Deleting animal with ID: ${id}`);
        // Add logic to delete the animal
    };

    // Method to add a treatment
    const addTreatment = (id) => {
        console.log(`Adding treatment for animal ID: ${id}`);
        // Add logic to handle treatment addition
    };

    // Method to add a menu
    const addMenu = (id) => {
        console.log(`Adding menu for animal ID: ${id}`);
        // Add logic to handle menu addition
    };

    // Method to add a rendezvous
    const addRendezvous = (id) => {
        console.log(`Adding rendezvous for animal ID: ${id}`);
        // Add logic to handle rendezvous scheduling
    };

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item) => {
                return (
                    item.id.toString().includes(search.toLowerCase()) || // Recherche par ID
                    item.name.toLowerCase().includes(search.toLowerCase()) || // Recherche par nom
                    item.species.toLowerCase().includes(search.toLowerCase()) || // Recherche par espèce (Chat/Chien)
                    item.breed.toLowerCase().includes(search.toLowerCase()) || // Recherche par race
                    item.ownerId.toLowerCase().includes(search.toLowerCase()) || // Recherche par ID du propriétaire
                    item.dateOfBirth.toLowerCase().includes(search.toLowerCase()) || // Recherche par date de naissance
                    (item.photo && item.photo.toLowerCase().includes(search.toLowerCase())) || // Recherche par URL de photo
                    item.createdAt.toLowerCase().includes(search.toLowerCase()) || // Recherche par date d'enregistrement
                    (item.tasks.length.toString().includes(search.toLowerCase())) // Recherche par nombre de tâches
                );

            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    // @ts-ignore
    return (
        <div>


            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light capitalize">{t('my_pets')}</h5>
                    <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                        <div className="flex md:items-center md:flex-row flex-col gap-5">

                            {displayMode === 'table' &&
                                <div
                                    className="dropdown">
                                    <Dropdown
                                        placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                        btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                                        button={
                                            <>
                                                <span
                                                    className="ltr:mr-1 rtl:ml-1">Columns</span>
                                                <IconCaretDown
                                                    className="w-5 h-5" />
                                            </>
                                        }
                                    >
                                        <ul className="!min-w-[140px]">
                                            {cols.map((col, i) => {
                                                return (
                                                    <li
                                                        key={i}
                                                        className="flex flex-col"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <div
                                                            className="flex items-center px-4 py-1">
                                                            <label
                                                                className="cursor-pointer mb-0">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!hideCols.includes(col.accessor)}
                                                                    className="form-checkbox"
                                                                    defaultValue={col.accessor}
                                                                    onChange={(event: any) => {
                                                                        setHideCols(event.target.value);
                                                                        showHideColumns(col.accessor, event.target.checked);
                                                                    }}
                                                                />
                                                                <span
                                                                    className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                                            </label>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Dropdown>
                                </div>}
                        </div>
                        <div className="text-right">
                            <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        {/* Toggle between Table and Cards */}
                        <button
                            onClick={() => setDisplayMode(displayMode === 'table' ? 'cards' : 'table')}
                            className="flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                        >
                            {displayMode === 'table' ? (
                                <>
                                    <IconMenuPages className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    <IconMenuTables className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
                { displayMode === 'table' &&
                    <div
                        className="datatables">
                        <DataTable
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                {
                                    accessor: 'actions',
                                    title: t('actions'),
                                    render: (record) => (
                                        <div className="relative">
                                            <button
                                                className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                                                onClick={() => toggleDropdown(record.id)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v.01M12 12v.01M12 18v.01"
                                                    />
                                                </svg>
                                            </button>
                                            {dropdownOpen[record.id] && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#24324A] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-300">
                                                        <li>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => handleEdit(record.id)}
                                                            >
                                                                {t('edit')}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => toggleActiveStatus(record.id)}
                                                            >
                                                                {record.isActive ? t('set_inactive') : t('set_active')}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => setDeceased(record.id)}
                                                            >
                                                                {t('set_deceased')}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => deleteAnimal(record.id)}
                                                            >
                                                                {t('delete')}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => addTreatment(record.id)}
                                                            >
                                                                {t('add_treatment')}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => addMenu(record.id)}
                                                            >
                                                                {t('add_menu')}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => addRendezvous(record.id)}
                                                            >
                                                                {t('add_rendezvous')}
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    accessor: 'id',
                                    title: t('id'),
                                    sortable: true,
                                    hidden: hideCols.includes('id')
                                },
                                {
                                    accessor: 'name',
                                    title: t('name'),
                                    sortable: true,
                                    hidden: hideCols.includes('name')
                                },
                                {
                                    accessor: 'species',
                                    title: t('species'),
                                    sortable: true,
                                    hidden: hideCols.includes('species')
                                },
                                {
                                    accessor: 'breed',
                                    title: t('breed'),
                                    sortable: true,
                                    hidden: hideCols.includes('breed')
                                },
                                {
                                    accessor: 'dateOfBirth',
                                    title: t('birthdate'),
                                    sortable: true,
                                    hidden: hideCols.includes('dateOfBirth'),
                                    render: ({ dateOfBirth }) => (
                                        <div>{new Date(dateOfBirth).toLocaleDateString()}</div>
                                    )
                                },
                                {
                                    accessor: 'photo',
                                    title: t('photo_url'),
                                    sortable: false,
                                    hidden: hideCols.includes('photo'),
                                    render: ({
                                                 photo,
                                                 name
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
                                    accessor: 'tasks',
                                    title: t('number_of_tasks'),
                                    sortable: false,
                                    hidden: hideCols.includes('tasks'),
                                    render: ({ tasks }) =>
                                        <div>{tasks.length} {t('tasks')}</div>
                                },
                                {
                                    accessor: 'isActive',
                                    title: t('is_active'),
                                    sortable: true,
                                    hidden: hideCols.includes('isActive'),
                                    render: ({ isActive }) => (
                                        <div
                                            className={isActive ? 'text-success' : 'text-danger'}
                                            style={{ textTransform: 'capitalize' }}
                                        >
                                            {isActive ? t('active') : t('inactive')}
                                        </div>
                                    )
                                },
                                {
                                    accessor: 'createdAt',
                                    title: t('created_at'),
                                    sortable: true,
                                    hidden: hideCols.includes('createdAt'),
                                    render: ({ createdAt }) => (
                                        <div>{new Date(createdAt).toLocaleDateString()}</div>
                                    )
                                }
                            ]}
                            highlightOnHover
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({
                                                 from,
                                                 to,
                                                 totalRecords
                                             }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>}
                {displayMode === 'cards' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recordsData.map((animal) => (
                            <div
                                key={animal.id}
                                className="card relative border rounded-md shadow-lg p-6 flex flex-col items-center dark:bg-[#1b2e4b] dark:text-white-dark transition-all duration-300 hover:shadow-xl"
                            >
                                {/* Dropdown Menu */}
                                <div
                                    className="absolute top-3 right-3">
                                    <div
                                        className="relative">
                                        <button
                                            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                                            onClick={() => toggleDropdown(animal.id)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 6v.01M12 12v.01M12 18v.01"
                                                />
                                            </svg>
                                        </button>
                                        {dropdownOpen[animal.id] && (
                                            <div
                                                className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#24324A] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-300">
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => handleEdit(animal.id)}
                                                        >
                                                            {t('edit')}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => toggleActiveStatus(animal.id)}
                                                        >
                                                            {animal.isActive ? t('set_inactive') : t('set_active')}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => setDeceased(animal.id)}
                                                        >
                                                            {t('set_deceased')}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => deleteAnimal(animal.id)}
                                                        >
                                                            {t('delete')}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => addTreatment(animal.id)}
                                                        >
                                                            {t('add_treatment')}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => addMenu(animal.id)}
                                                        >
                                                            {t('add_menu')}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => addRendezvous(animal.id)}
                                                        >
                                                            {t('add_rendezvous')}
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Animal Info */}
                                <img
                                    src={animal.photo}
                                    alt={`${animal.name}'s photo`}
                                    className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-200 dark:border-gray-700"
                                />
                                <h3 className="text-lg font-semibold mb-2 capitalize text-center">{animal.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-bold capitalize">{t('species')}: </span>{animal.species}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-bold capitalize">{t('breed')}: </span>{animal.breed}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-bold capitalize">{t('birthdate')}: </span>
                                    {new Date(animal.dateOfBirth).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-bold capitalize">{t('owner_id')}: </span>{animal.ownerId}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                </p>
                                <div
                                    className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                                        animal.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {animal.isActive ? t('active') : t('inactive')}
                                </div>
                            </div>


                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Pets;
