import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPills,        // medical
    faHeart,        // care
    faBone,         // feeding
    faCalendarCheck,// appointment
    faDumbbell,     // training
    faUsers         // social
} from '@fortawesome/free-solid-svg-icons';

import { usePets } from '../../../contexts/PetsContext';

const EVENT_TYPE_STYLES = {
    medical: { icon: faPills, color: 'text-red-500', bg: 'red-500' },
    care: { icon: faHeart, color: 'text-pink-500', bg: 'pink-100' },
    feeding: { icon: faBone, color: 'text-yellow-500', bg: 'amber-500' },
    appointment: { icon: faCalendarCheck, color: 'text-blue-500', bg: 'blue-100' },
    training: { icon: faDumbbell, color: 'text-green-500', bg: 'green-100' },
    social: { icon: faUsers, color: 'text-purple-500', bg: 'purple-100' }
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const { pets, refreshPets } = usePets();

    const { title, type, startDate, endDate, notes } = event;
    const style = EVENT_TYPE_STYLES[type as keyof typeof EVENT_TYPE_STYLES] || {};

    return (
        <div className={`event-card p-4 border-2 border-${style.bg} rounded shadow-md`}>
            <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={style.icon} className={`text-xl ${style.color}`} />
                <h3 className={`text-lg font-bold ${style.color}`}>{title}</h3>
            </div>
            <p><strong>Animal :</strong> {pets.find((pet) => pet.id === event.petId)?.name || 'Inconnu'}</p>
            {/*<p><strong>Type :</strong> {type}</p>*/}
            <p><strong>Du :</strong> {startDate ? new Date(startDate).toLocaleDateString('fr-FR') + ' ' + new Date(startDate).toLocaleTimeString('fr-FR') : 'N/A'}</p>

            {event.type !== 'feeding' && <p>
                <strong>Au
                    :</strong> {endDate ? new Date(endDate).toLocaleDateString('fr-FR') : 'N/A'}
            </p>}
            <p className="italic">{notes}</p>
        </div>
    );
};

export default EventCard;
