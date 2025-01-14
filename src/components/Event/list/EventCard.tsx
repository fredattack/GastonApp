import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPills,        // medical
    faHeart,        // care
    faBone,         // feeding
    faCalendarCheck,// appointment
    faDumbbell,     // training
    faUsers,
    faEllipsisH         // social
} from '@fortawesome/free-solid-svg-icons';
import Dropdown
    from '../../Dropdown';
import { usePets } from '../../../contexts/PetsContext';

const EVENT_TYPE_STYLES = {
    medical: { icon: faPills, color: 'text-red-500', bg: 'red-500' },
    care: { icon: faHeart, color: 'text-pink-500', bg: 'pink-100' },
    feeding: { icon: faBone, color: 'text-lime-500', bg: 'lime-500' },
    appointment: { icon: faCalendarCheck, color: 'text-blue-500', bg: 'blue-100' },
    training: { icon: faDumbbell, color: 'text-green-500', bg: 'green-100' },
    social: { icon: faUsers, color: 'text-purple-500', bg: 'purple-100' }
};
    import { useIcons } from '../../../providers/FontawesomeProvider';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const { pets, refreshPets } = usePets();
    const icons = useIcons();

    const { title, type, startDate, endDate, notes } = event;

    const style = EVENT_TYPE_STYLES[type as keyof typeof EVENT_TYPE_STYLES] || {};
    return (
        <>
        <div className=" overflow-hidden flex flex-col rounded-sm border">
            <a href="#"></a>
            <div className="relative"><a href="#">
               {/* <img className="w-full"
                     src="https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;w=500"
                     alt="Sunset in the mountains" />*/}
                    <div
                        className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                    </div>
            </a>
                <a href="#!">
                    <div
                        className="text-xs absolute top-0 right-0  px-4 py-2 mt-3 mr-3 hover:bg-white  transition duration-500 ease-in-out">
                        <FontAwesomeIcon
                            icon={style.icon}
                            className={`text-xl ${style.color}`} />
                    </div>
                </a>
            </div>
            <div className={`px-3 py-2 mb-auto border bg-white`}>
                <a href="#"
                   className="font-medium inline-block hover:text-indigo-600 transition duration-500 ease-in-out inline-block ">{event.title}</a>
                <p className="text-gray-500 text-sm">
                    {event.pets.map((pet) => pet.name).join(',') || 'Inconnu'}
                </p>
            </div>
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

            </div>
            <div
                className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                <a href="#"
                   className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                    <svg
                        height="13px"
                        width="13px"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        //@ts-ignore
                         y="0px" viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }}
                         xml:space="preserve">
                        <g>
                            <g>
                                <path
                                    d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z">
                                </path>
                            </g>
                        </g>
                    </svg>
                    <span className="ml-1">{startDate ? new Date(startDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' }) + ' ' + new Date(startDate).toLocaleTimeString('fr-FR', { timeZone: 'UTC' }) : 'N/A'}</span>
                </a>

                <a href="#" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">

                    <span
                        className="ml-1"><div
                        className="dropdown">
    <Dropdown
        placement={`top-end`}
        btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black dark:text-white-dark hover:text-primary dark:hover:text-primary"
        button={
            <FontAwesomeIcon icon={faEllipsisH}  className="m-auto"/>
        }
    >
        <ul className="!min-w-[170px]">
            <li>
                <button
                    type="button">Action</button>
            </li>
            <li>
                <button
                    type="button">Another action</button>
            </li>
            <li>
                <button
                    type="button">Something else here</button>
            </li>
            <li>
                <button
                    type="button">Separated link</button>
            </li>
        </ul>
    </Dropdown>
</div></span>
                </a>
            </div>
        </div>


        </>
    );
};

export default EventCard;
