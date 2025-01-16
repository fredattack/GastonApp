import React, {
    useState
} from 'react';


interface EventSummaryProps {
    events: EventFormData[]|Event[];
}
const PERIODES = {
    MORNING: 'morning',
    AFTERNOON: 'afternoon',
    OTHER: 'other',
    EVENING: 'evening',
    ALL: 'all'
};
const EventSummary: React.FC<EventSummaryProps> = ({ events }) => {
    const [periode, setPeriode] = useState(PERIODES.ALL);
    console.log('Events', events);

    const isInPeriod = (start_date: Date|string) => {
        const date = new Date(start_date);
        // console.log('date', date);
        switch (periode) {
            case PERIODES.MORNING:
                return date.getHours() >= 6 && date.getHours() < 12;
            case PERIODES.AFTERNOON:
                return date.getHours() >= 12 && date.getHours() < 17;
            case PERIODES.EVENING:
                return date.getHours() >= 17 && date.getHours() < 20;
            case PERIODES.OTHER:
                return date.getHours() >= 20 || date.getHours() < 6;
            default:
                return true;
        }

    }

    const groupedEvents = (events as Event[]).filter((event) => isInPeriod(event.start_date)).reduce((acc, event) => {
        event.pets.forEach((pet) => {
            if (!acc[pet.id]) {
                acc[pet.id] = { pet, events: [] };
            }
            if (isInPeriod(event.start_date)) {
                acc[pet.id].events.push(event);
            }
        });
        return acc;
    }, {} as Record<string, { pet: Pet; events: Event[] }>);

    const handleSetPeriode = (periode: string) => () => {
        setPeriode(periode);
    }

    console.log('groupedEvents', groupedEvents);
    return (
        <div
            className="event-summary">

            <span
                className="isolate inline-flex rounded-md shadow-sm m-auto py-2">
                  <button
                      type="button"
                      className={`btn-sm relative inline-flex items-center rounded-l-md px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.MORNING ? 'bg-gray-300' : 'bg-white'}`}
                      onClick={handleSetPeriode(PERIODES.MORNING)}
                  >
                      Morning</button>
                  <button
                      type="button"
                      className={`btn-sm relative inline-flex items-center  px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.AFTERNOON ? 'bg-gray-300' : 'bg-white'}`}
                      onClick={handleSetPeriode(PERIODES.AFTERNOON)}
                  >
                      Afternoon</button>
                <button
                    type="button"
                    className={`btn-sm relative inline-flex items-center  px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.EVENING ? 'bg-gray-300' : 'bg-white'}`}
                    onClick={handleSetPeriode(PERIODES.EVENING)}
                >
                    Evening</button>
                  <button
                      type="button"
                      className={`btn-sm relative inline-flex items-center  px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.OTHER ? 'bg-gray-300' : 'bg-white'}`}
                      onClick={handleSetPeriode(PERIODES.OTHER)}
                  >
                      Other</button>
                <button
                    type="button"
                    className={`btn-sm relative inline-flex items-center rounded-r-md px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.ALL ? 'bg-gray-300' : 'bg-white'}`}
                    onClick={handleSetPeriode(PERIODES.ALL)}
                >
                      All</button>
            </span>
            <div
                className="pet-summary  p-4 rounded-md shadow-md mb-4  border border-lime-300">
                {Object.values(groupedEvents).map(({
                                                       pet,
                                                       events
                                                   }) => (
                    <div
                        key={pet.id}
                        className="pet-summary">


                        <div
                            className="flex items-center">

                            <div>
                                <h3 className="text-lg font-bold">{pet.name}</h3>
                            </div>
                        </div>
                        <div
                            className="event-details flex justify-end">
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    className="event-item">
                                    {/*<h4 className="text-md font-semibold">{event.title}</h4>*/}
                                    {event.notes &&
                                        <p className="text-sm italic">{event.notes}</p>}
                                    {event.event_items && event.event_items.length > 0 && (
                                        <ul className="list-disc pl-5 mt-2">
                                            {event.event_items.map(item => (
                                                <li key={item.id}>
                                                    {item.type === 'food' && (
                                                        <span>Repas : {item.quantity} {item.unit}</span>
                                                    )}
                                                    {item.notes && (
                                                        <p className="text-sm italic">Note: {item.notes}</p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>


                    </div>
                ))}
            </div>
            </div>
            );
            };

            export
            default
            EventSummary;
