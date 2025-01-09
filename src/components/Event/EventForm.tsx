import React, {
    useState,
    useEffect
} from 'react';

import SingleSelect
    from '../Form/SingleSelect';

import {
    doc,
    collection,
    getDocs,
    query,
    where,
    orderBy
} from 'firebase/firestore';

import {
    db
} from '../../../firebaseConfig';


import {
    transformOptions,
    updateNestedObject
} from '../../helpers';
import {
    EventTypes
} from '../../enums/EventTypes';

import Toggle
    from '../Form/Toggle';


import {
    FrequencyTypes
} from '../../enums/FrequencyTypes';
import {
    DaysOfWeek
} from '../../enums/Days';
import MultiSelect
    from '../Form/MultiSelect';

export default function EventForm({
                                      initialData: event = {} as Event,
                                      onChange
                                  }: {
    initialData?: Event;
    onSubmit?: (data: EventFormData) => void;
    onChange?: (data: EventFormData) => void;
    onCancel?: () => void;
})
{

    const [eventFormData, setEventFormData] = useState<EventFormData>({
        petId: event?.petId || '',
        type: event?.type || '',
        startDate: event?.startDate || '',
        title: event?.title || '',
        endDate: event?.endDate || '',
        isRecurring: event?.isRecurring || false,
        isFullDay: event?.isFullDay || false,
        recurrence: {
            frequencyType: event?.recurrence?.frequencyType || '',
            frequency: event?.recurrence?.frequency || 1,
            days: event?.recurrence?.days || [],
            hasEndRecurrence: event?.recurrence?.hasEndRecurrence || false,
            endRecurrenceDate: event?.recurrence?.endRecurrenceDate || ''
        },
        notes: event?.notes || ''
    });
    const [petOptions, setPetOptions] = useState<{
        value: string;
        label: string
    }[]>([]);

    useEffect(() => {
        // Fetch the pet options from Firestore
        const fetchPets = async () => {
            try {
                const authId = 'vB6WiAAmU8PsKg9chwip';
                const ownerRef = doc(db, 'users', authId);
                const petsRef = collection(db, 'pets');
                const petsQuery = query(
                    petsRef,
                    where('owner_id', '==', ownerRef),
                    orderBy('order', 'desc')
                );

                const querySnapshot = await getDocs(petsQuery);
                const options = querySnapshot.docs.map((doc) => ({
                    value: doc.id,
                    label: doc.data().name
                }));
                setPetOptions(options);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        fetchPets();
    }, []);

    useEffect(() => {
        console.log('isRecurring changed:', eventFormData.isRecurring, eventFormData.recurrence);
        if (!eventFormData.isRecurring) {
            setEventFormData((prev) => ({
                ...prev,
                recurrence: {
                    frequencyType: event?.recurrence?.frequencyType || '',
                    frequency: event?.recurrence?.frequency || 1,
                    days: event?.recurrence?.days || [],
                    hasEndRecurrence: event?.recurrence?.hasEndRecurrence || false,
                    endRecurrenceDate: event?.recurrence?.endRecurrenceDate || ''
                }
            }));
            console.log('recurrence:', eventFormData.recurrence);
        }
    }, [eventFormData.isRecurring]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('handleSubmit ', eventFormData);
    };

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
                    <button
                        type="button"
                        onClick={() => handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)}>test
                    </button>
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
                                <SingleSelect
                                    label="Pet"
                                    placeholder="Select a pet"
                                    options={petOptions}
                                    value={eventFormData.petId}
                                    onChange={(e) => handleChange('petId', e)}
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
                            {/* #region toggle dropdown date */}
                            {/*<div className="sm:col-span-3 ">
                                bb
                        <Dropdown
                                        placement={`${true ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="btn btn-outline-primary dropdown-toggle"
                                        button={
                                            <>
                                                Action
                                                <span>
                            <svg>...</svg>
                        </span>
                                            </>
                                        }
                                    >
                                        <ul className="!min-w-[170px]">
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

                            </div>*/}
                            {/* #region toggle fullday */}
                            <div
                                className="sm:col-span-6">
                                <Toggle
                                    label="full day"
                                    initialState={eventFormData.isFullDay}
                                    onChange={(e) => handleChange('isFullDay', e)}
                                />
                            </div>
                            {/* #region date start*/}
                            <div
                                className="sm:col-span-3">
                                <label
                                    htmlFor="startDate"
                                    className="block text-sm/6 font-medium text-gray-900">
                                    Start
                                    Date
                                </label>
                                <div
                                    className="mt-2">
                                    <input
                                        id="endDate"
                                        name="startDate"
                                        type={eventFormData.isFullDay ? 'date' : 'datetime-local'}
                                        value={eventFormData.startDate instanceof Date ? eventFormData.startDate.toISOString().split('T')[0] : eventFormData.startDate}
                                        onChange={(e) => handleChange('startDate', e)}

                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            {/* #region date end*/}
                            <div
                                className="sm:col-span-3">
                                <label
                                    htmlFor="endDate"
                                    className="block text-sm/6 font-medium text-gray-900">
                                    End
                                    Date
                                </label>
                                <div
                                    className="mt-2">
                                    <input
                                        id="endDate"
                                        name="endDate"
                                        type={eventFormData.isFullDay ? 'date' : 'datetime-local'}
                                        value={eventFormData.endDate instanceof Date ? eventFormData.endDate.toISOString().split('T')[0] : eventFormData.endDate}
                                        onChange={(e) => handleChange('endDate', e)}
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
                                        onChange={(e) => handleChange('isRecurring', e)}

                                    />

                                </div>
                            </div>

                            {eventFormData.isRecurring && (
                                <div
                                    className="sm:col-span-6">
                                    <label
                                        htmlFor="frequencyType"
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
                                                onChange={(value) => handelChangeRecurrence('frequencyType', value)}
                                                value={eventFormData.recurrence?.frequencyType?.toString() ?? ''}
                                            />
                                        </div>

                                    </div>
                                    {eventFormData.recurrence?.frequencyType === FrequencyTypes.Weekly &&
                                        (
                                            <div
                                                className="mt-2 grid grid-cols-4 gap-4">
                                                <div
                                                    className="col-span-3">
                                                    <MultiSelect
                                                        options={DaysOfWeek.asOptionArray()}
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
                                                    onChange={(value) => handleChangeNested('recurrence.hasEndRecurrence', value)} />

                                            </div>
                                        </div>


                                            { eventFormData.recurrence?.hasEndRecurrence === true &&

                                        <div
                                            className="col-span-3">
                                            <label
                                                htmlFor="endDate"
                                                className="block text-sm/6 font-medium text-gray-900">
                                                End
                                                Date
                                            </label>
                                                <div
                                                    className="mt-2">
                                                    <input
                                                        id="endDate"
                                                        name="endDate"
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


}
