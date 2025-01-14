import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from 'react';

import { modelService } from "../../services";

import SingleSelect
    from '../Form/SingleSelect';

import Toggle
    from '../Form/Toggle';
import {
    transformOptions,
} from '../../helpers';

import MultiSelect
    from '../Form/MultiSelect';
import {
    EventTypes
} from '../../enums/EventTypes';

import {
    FrequencyTypes
} from '../../enums/FrequencyTypes';

import {
    Days
} from '../../enums/Days';

import {
    useToast
} from '../../providers/ToastProvider';

const EventForm = forwardRef(({ event , onSubmit, onChange, onCancel }: any, ref) => {
    const { addToast } = useToast();

    const [eventFormData, setEventFormData] = useState<EventFormData>({
        id: event?.id || null,
        petId: event?.petId || '',
        type: event?.type || '',
        start_date: event?.start_date || '',
        title: event?.title || '',
        end_date: event?.end_date || '',
        is_recurring: event?.is_recurring || false,
        is_full_day: event?.is_full_day || false,
        recurrence: {
            frequency_type: event?.recurrence?.frequency_type || '',
            frequency: event?.recurrence?.frequency || 1,
            days: event?.recurrence?.days || [],
            end_date: event?.recurrence?.end_date || '',
            occurences: event?.recurrence?.occurences || 0
        },
        notes: event?.notes || ''
    });
    const [petOptions, setPetOptions] = useState<{
        value: string;
        label: string
    }[]>([]);
    const [isLoadingPets, setIsLoadingPets] = useState<boolean>(true); // ⚡️ Ajout de l'état de chargement

    useEffect(() => {
        // Fetch the pet options from Firestore
        const fetchPets = async () => {
            try {
                const pets = await modelService.asOptions("pets");
                setPetOptions(pets);
            } catch (error) {
                console.error("Error fetching pets:", error);
            } finally {
                setIsLoadingPets(false); // ✅ Arrêter le chargement après la récupération
            }
        };

        fetchPets();
    }, []);

    useEffect(() => {
        if (!eventFormData.is_recurring) {
            setEventFormData((prev) => ({
                ...prev,
                recurrence: {
                    frequency_type: event?.recurrence?.frequency_type || '',
                    frequency: event?.recurrence?.frequency || 1,
                    days: event?.recurrence?.days || [],
                    end_date: event?.recurrence?.end_date || '',
                    occurences: event?.recurrence?.occurences || 0
                }
            }));
        }
    }, [eventFormData.is_recurring]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        try {
            if (!eventFormData.type || !eventFormData.start_date) {
                alert("Les champs Type et Date de début sont obligatoires !");
                return;
            }

            if (eventFormData.id) {
                // Mise à jour
                await modelService.update("events", eventFormData.id, eventFormData);
                addToast({
                    message: 'Event successfully created!',
                    type: 'success'
                });
            } else {
                // Création
                const newId = await modelService.add("events", eventFormData);
                addToast({
                    message: 'Event successfully created!',
                    type: 'success'
                });
            }

            if (onSubmit) {
                onSubmit(eventFormData);
            }
        } catch (error) {
            console.error("Erreur lors de la soumission :", error);
            alert("Une erreur est survenue lors de la soumission.");
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    function handleChange(key: string, e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | string | boolean) {
        setEventFormData((prev) => ({
            ...prev,
            [key]: typeof e === 'object' && 'target' in e ? e.target.value : e
        }));

        if (onChange) {
            onChange(eventFormData);
        }
    }

    function handelChangeRecurrence(key: string, value: string | string[] | number | boolean) {
        setEventFormData((prev) => ({
            ...prev,
            recurrence: {
                ...prev.recurrence,
                key: value
            }
        }));

        if (onChange) {
            onChange(eventFormData);
        }
    }

    if (isLoadingPets) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading pets...</p>
            </div>
        );
    }
    return (
        <div
            className="space-y-10 divide-y divide-gray-900/10 mb-3">
            <div
                className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                <div
                    className="px-4 sm:px-0">
                    <h2 className="text-base/7 font-semibold text-gray-900">Event
                        Details</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Fill
                        in
                        the
                        details
                        for
                        the
                        event
                        below.</p>
                </div>

                <form
                    className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
                >

                    <div
                        className="px-4 py-6 sm:p-8">
                        <div
                            className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* #region select title*/}
                            <div
                                className="sm:col-span-6">

                                <label
                                    htmlFor="title">Title</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={eventFormData.title.toString()}
                                    onChange={(e) => handleChange('title', e)}
                                    placeholder="Entrez la title"
                                    className="form-input"
                                />

                            </div>
                            {/* #region select pet*/}
                            <div
                                className="sm:col-span-3">
                                <MultiSelect
                                    label="Pet"
                                    placeholder="Select a pet"
                                    options={petOptions}
                                    //@ts-ignore
                                    value={eventFormData.pets ?? []}
                                    onChange={(e) => handleChange('pets', e as unknown as string)}
                                />
                            </div>
                            {/* #region select type*/}
                            <div
                                className="sm:col-span-3">
                                <SingleSelect
                                    label={'Event Type'}
                                    placeholder="Select event type"
                                    options={EventTypes.asOptionArray()}
                                    value={eventFormData.type}
                                    onChange={(e) => handleChange('type', e)}

                                    required={true}
                                />

                            </div>
                            {/* #region toggle fullday */}
                            <div
                                className="sm:col-span-6">
                                <Toggle
                                    label="full day"
                                    initialState={eventFormData.is_full_day}
                                    onChange={(e) => handleChange('is_full_day', e)}
                                />
                            </div>
                            {/* #region date start*/}
                            <div
                                className="sm:col-span-3">
                                <label
                                    htmlFor="start_date"
                                    className="block text-sm/6 font-medium text-gray-900">
                                    Start
                                    Date
                                </label>
                                <div
                                    className="mt-2">
                                    <input
                                        id="end_date"
                                        name="start_date"
                                        type={eventFormData.is_full_day ? 'date' : 'datetime-local'}
                                        value={
                                            eventFormData.start_date
                                                ? new Date(eventFormData.start_date)
                                                    .toISOString()
                                                    .slice(0, eventFormData.is_full_day ? 10 : 16) // 📅 Ajuste selon le type
                                                : ''
                                        }
                                        onChange={(e) => handleChange('start_date', e)}

                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            {/* #region date end*/}
                            <div
                                className="sm:col-span-3">
                                <label
                                    htmlFor="end_date"
                                    className="block text-sm/6 font-medium text-gray-900">
                                    End
                                    Date
                                </label>
                                <div
                                    className="mt-2">
                                    <input
                                        id="end_date"
                                        name="end_date"
                                        type={eventFormData.is_full_day ? 'date' : 'datetime-local'}
                                        value={
                                            eventFormData.end_date
                                                ? new Date(eventFormData.start_date)
                                                    .toISOString()
                                                    .slice(0, eventFormData.is_full_day ? 10 : 16) // 📅 Ajuste selon le type
                                                : ''
                                        }
                                        onChange={(e) => handleChange('end_date', e)}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            {/* recurence*/}
                            <div
                                className="sm:col-span-6">
                                <div
                                    className="mt-2">
                                    <Toggle
                                        label="Recurring"
                                        onChange={(e) => handleChange('is_recurring', e)}

                                    />

                                </div>
                            </div>

                            {eventFormData.is_recurring && (
                                <div
                                    className="sm:col-span-6">
                                    <label
                                        htmlFor="frequency_type"
                                        className="block text-sm/6 font-medium text-gray-900">
                                        Recurrence
                                        Details
                                    </label>
                                    <div
                                        className="mt-2 grid grid-cols-4 gap-4">
                                        <div
                                            className="colspan-1">
                                            <SingleSelect
                                                options={transformOptions(['1', '2', '3'])}
                                                //@ts-ignore
                                                value={eventFormData.recurrence?.days ?? []}
                                                onChange={(value) => handelChangeRecurrence('frequency', value)}
                                            />
                                        </div>
                                        <div
                                            className="col-span-2">
                                            <SingleSelect
                                                placeholder="Select a frequency"
                                                options={FrequencyTypes.asOptionArray()}
                                                onChange={(value) => handelChangeRecurrence('frequency_type', value)}
                                                value={eventFormData.recurrence?.frequency_type?.toString() ?? ''}
                                            />
                                        </div>

                                    </div>
                                    {eventFormData.recurrence?.frequency_type === FrequencyTypes.Weekly &&
                                        (
                                            <div
                                                className="mt-2 grid grid-cols-4 gap-4">
                                                <div
                                                    className="col-span-3">
                                                    <MultiSelect
                                                        options={Days.asOptionArray()}
                                                        //@ts-ignore
                                                        value={eventFormData.recurrence?.days ?? []}
                                                        onChange={(value) => handelChangeRecurrence('days', value)}
                                                        // onChange={(value) => handleChangeNested('recurrence.days', value)}
                                                    />
                                                </div>


                                            </div>)}
                                    {/* <div
                                        className="mt-2 grid grid-cols-4 gap-4">
                                        <div
                                            className="col-span-3">
                                            <div
                                                className="mt-2">
                                                <Toggle
                                                    label="until"
                                                    onChange={(value) => handleChangeNested('recurrence.has_end_reccurence', value)} />

                                            </div>
                                        </div>


                                            { eventFormData.recurrence?.has_end_reccurence === true &&

                                        <div
                                            className="col-span-3">
                                            <label
                                                htmlFor="end_date"
                                                className="block text-sm/6 font-medium text-gray-900">
                                                End
                                                Date
                                            </label>
                                                <div
                                                    className="mt-2">
                                                    <input
                                                        id="end_date"
                                                        name="end_date"
                                                        type={'date'}
                                                        value={eventFormData.recurrence?.endRecurrenceDate instanceof Date ? eventFormData.recurrence?.endRecurrenceDate.toISOString().split('T')[0] : eventFormData.recurrence?.endRecurrenceDate}
                                                        onChange={(e) => handleChangeNested('recurrence.endRecurrenceDate', e.target.value)}
                                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                    />
                                                </div>
                                            <p className="text-gray-500">Date of the last event of the serie</p>
                                        </div>}


                                    </div>*/}
                                </div>
                            )}

                            {/* #region notes*/}
                            <div
                                className="sm:col-span-6">
                                <label
                                    htmlFor="notes"
                                    className="block text-sm/6 font-medium text-gray-900">
                                    Notes
                                </label>
                                <div
                                    className="mt-2">
                  <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={eventFormData.notes}
                      onChange={(e) => handleChange('notes', e)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );


});

export default EventForm;
