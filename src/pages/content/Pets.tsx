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

    return (
        <div>


            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light capitalize">{t('my_pets')}</h5>
                    <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                        <div className="flex md:items-center md:flex-row flex-col gap-5">
                            <div className="dropdown">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                    btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                                    button={
                                        <>
                                            <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                                            <IconCaretDown className="w-5 h-5" />
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
                                                    <div className="flex items-center px-4 py-1">
                                                        <label className="cursor-pointer mb-0">
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
                                                            <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                                        </label>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="text-right">
                            <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'id', title: t('id'), sortable: true, hidden: hideCols.includes('id') },
                            {
                                accessor: 'name',
                                title: t('name'),
                                sortable: true,
                                hidden: hideCols.includes('name'),
                            },
                            {
                                accessor: 'species',
                                title: t('species'),
                                sortable: true,
                                hidden: hideCols.includes('species'),
                            },
                            {
                                accessor: 'breed',
                                title: t('breed'),
                                sortable: true,
                                hidden: hideCols.includes('breed'),
                            },
                            {
                                accessor: 'dateOfBirth',
                                title: t('birthdate'),
                                sortable: true,
                                hidden: hideCols.includes('dateOfBirth'),
                                render: ({ dateOfBirth }) => (
                                    <div>{new Date(dateOfBirth).toLocaleDateString()}</div>
                                ),
                            },
                            {
                                accessor: 'photo',
                                title: t('photo_url'),
                                sortable: false,
                                hidden: hideCols.includes('photo'),
                                render: ({ photo, name }) => (
                                    <img
                                        src={photo}
                                        alt={`${name}'s photo`}
                                        style={{ width: 50, height: 50, borderRadius: '50%' }}
                                    />
                                ),
                            },
                            {
                                accessor: 'tasks',
                                title: t('number_of_tasks'),
                                sortable: false,
                                hidden: hideCols.includes('tasks'),
                                render: ({ tasks }) => <div>{tasks.length} {t('tasks')}</div>,
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
                                ),
                            },
                            {
                                accessor: 'createdAt',
                                title: t('created_at'),
                                sortable: true,
                                hidden: hideCols.includes('createdAt'),
                                render: ({ createdAt }) => (
                                    <div>{new Date(createdAt).toLocaleDateString()}</div>
                                ),
                            },
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
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default Pets;
