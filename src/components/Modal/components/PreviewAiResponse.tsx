import { usePets } from '../../../contexts/PetsContext';


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function PreviewAiResponse({ aiResponse }: any) {
    const { pets, refreshPets } = usePets();
    console.log('aiResponse', aiResponse );
    const eventForm = aiResponse.response
    console.log('eventForm', eventForm);

    const recurrenceDetails = [
        `Type de récurrence : ${eventForm.recurrence?.frequencyType}`,
        `Fréquence : ${eventForm.recurrence?.frequency} jour(s)`,
        `Date de fin : ${eventForm.recurrence?.endRecurrenceDate}`
    ];

    const generalDetails = [
        `Type : ${eventForm.type === 'medical' ? 'Médical' : eventForm.type}`,
        'Animal :'+ pets.find((pet) => pet.id == eventForm.petId)?.name || 'Inconnu' ,
        'Début : '+ new Date(eventForm.start_date).toLocaleString() || 'Inconnu',
        eventForm.end_date? `Fin : `+new Date(eventForm.end).toLocaleString() :null,
        `Récurrence : ${eventForm.is_recurring ? 'Oui' : 'Non'}`,
        `Toute la journée : ${eventForm.is_full_day ? 'Oui' : 'Non'}`
    ];

    return (
        <div
            className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">

            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                />
            </div>

            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold text-indigo-600">Aperçu de l'Événement</h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {eventForm.title}
                </p>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 sm:text-xl">
                {eventForm.notes}
            </p>

            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2">
                {/* Détails généraux */}
                <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:p-10">
                    <h3 className="text-indigo-600 text-base font-semibold">Détails de l'Événement</h3>
                    <ul className="mt-8 space-y-3 text-gray-600 text-sm">
                        {generalDetails.map((detail, index) => (
                            <li key={index} className="flex gap-x-3">
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Détails de la récurrence */}
                {eventForm.is_recurring && (
                    <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:p-10">
                        <h3 className="text-indigo-600 text-base font-semibold">Récurrence</h3>
                        <ul className="mt-8 space-y-3 text-gray-600 text-sm">
                            {recurrenceDetails.map((detail, index) => (
                                <li key={index} className="flex gap-x-3">
                                    {detail}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
