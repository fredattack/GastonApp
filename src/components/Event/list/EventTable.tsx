import React from "react";

const EventsTable = ({
    groupedEvents,
}: {
    groupedEvents: {
        pet: {
            name: string;
            pivot?: {
                item?: string;
                quantity?: number;
            };
        };
        events: {
            id: string;
        }[];
    }[];
}) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Item
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Quantity
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {Object.values(
                                    groupedEvents as {
                                        pet: any;
                                        events: any[];
                                    }[],
                                ).map(({ pet, events }) =>
                                    events.map((event) => (
                                        <tr key={event.id}>
                                            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                                                {pet.name}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                                                {pet.pivot?.item || "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {pet.pivot?.quantity || "N/A"}
                                            </td>
                                        </tr>
                                    )),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsTable;
