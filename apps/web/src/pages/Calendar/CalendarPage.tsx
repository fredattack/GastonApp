import React from 'react';
import EventCalendar from '../../components/Event/list/EventCalendar';

const CalendarPage: React.FC = () => {
    return (
        <div className="calendar-page">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Calendrier
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Gérez vos événements avec les vues jour, semaine et mois
                </p>
            </div>

            <EventCalendar />
        </div>
    );
};

export default CalendarPage;
