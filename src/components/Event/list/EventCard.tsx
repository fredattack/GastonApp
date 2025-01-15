import React, {
    useState
} from 'react';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    faAngleDown,
    faAngleUp,
    faPills,        // medical
    faHeart,        // care
    faBone,         // feeding
    faCalendarCheck,// appointment
    faDumbbell,     // training
    faUsers,
    faClock,
    faEllipsisH         // social
} from '@fortawesome/free-solid-svg-icons';
import Dropdown
    from '../../Dropdown';

const EVENT_TYPE_STYLES = {
    medical: {
        icon: faPills,
        color: 'text-red-200',
        bg: 'red-200'
    },
    care: {
        icon: faHeart,
        color: 'text-pink-500',
        bg: 'pink-100'
    },
    feeding: {
        icon: faBone,
        color: 'text-lime-500',
        bg: 'lime-500'
    },
    appointment: {
        icon: faCalendarCheck,
        color: 'text-blue-500',
        bg: 'blue-100'
    },
    training: {
        icon: faDumbbell,
        color: 'text-green-500',
        bg: 'green-100'
    },
    social: {
        icon: faUsers,
        color: 'text-purple-500',
        bg: 'purple-100'
    }
};
import {
    useIcons
} from '../../../providers/FontawesomeProvider';

const EventCard: React.FC<{
    event: Event
}> = ({ event }) => {
    const icons = useIcons();

    const {
        title,
        type,
        startDate,
        endDate,
        notes
    } = event;

    const [isExpanded, setIsExpanded] = useState(false);

    const style = EVENT_TYPE_STYLES[type as keyof typeof EVENT_TYPE_STYLES] || {};
    return (
        <>
            <div
                className=" overflow-visible flex flex-col rounded-sm border ">
                <a href="#"></a>
                <div
                    className="relative">
                    <a href="#">
                        {/* <img className="w-full"
                     src="https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500"
                     alt="Sunset in the mountains" />*/}
                        <div
                            className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                        </div>
                    </a>
                    <a href="#!">
                    </a>
                </div>
                <div
                    className={`mb-auto border  grid grid-cols-12`}>
                    <div
                        className="text-xs flex items-center justify-center  col-span-2 hover:bg-white  transition duration-500 ease-in-out">
                        <FontAwesomeIcon
                            icon={style.icon}
                            className={`text-xl ${style.color}`} />
                    </div>
                    <div
                        className="col-span-8 px-3">
                        <a href="#"
                           className="font-medium  hover:text-indigo-600 transition duration-500 ease-in-out inline-block ">{title}</a>
                        <p className="text-gray-500 text-sm">
                            {event.pets.map((pet) => pet.name).join(',') || 'Inconnu'}
                        </p>
                    </div>
                    <div
                        className="text-xs flex items-center justify-center  transition duration-500 ease-in-out"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <FontAwesomeIcon
                            icon={isExpanded ? faAngleUp : faAngleDown}
                            className="text-gray-500" />
                    </div>

                </div>
                {isExpanded &&
                    <div
                        className="px-6 py-4 mb-auto text-sm">
                        <p className="text-xs">
                            <strong>Du
                                :</strong> {startDate ? new Date(startDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' }) + ' ' + new Date(startDate).toLocaleTimeString('fr-FR', { timeZone: 'UTC' }) : 'N/A'}
                        </p>

                        {event.type !== 'feeding' &&
                            <p className="text-xs">
                                <strong>Au
                                    :</strong> {endDate ? new Date(endDate).toLocaleDateString('fr-FR') : 'N/A'}
                            </p>}
                        <p className="italic text-xs">{notes}</p>

                    </div>}

                <div
                    className="grid grid-cols-12 bg-gray-100">
                    <div
                        className="p-2 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center col-span-2">

                        <FontAwesomeIcon
                            icon={faClock}
                            className="mr-2" />
                    </div>
                    <div className="p-2 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center col-span-8">
                        <span
                            className="ml-1">{startDate ? new Date(startDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' }) + ' ' + new Date(startDate).toLocaleTimeString('fr-FR', { timeZone: 'UTC' }) : 'N/A'}</span>
                    </div>


                    <div
                        className="dropdown flex justify-center items-center ">
                        <Dropdown
                            placement={`top-end`}
                            btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
                            button={
                                <FontAwesomeIcon
                                    icon={faEllipsisH}
                                    className="m-auto" />
                            }
                        >
                            <ul className="!min-w-[170px] z-50">
                                <li>
                                    <button
                                        type="button">Action
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button">Another
                                        action
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button">Something
                                        else
                                        here
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button">Separated
                                        link
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                </div>
            </div>


        </>
    );
};

export default EventCard;
