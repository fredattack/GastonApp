import React from "react";

import SingleSelect from "../../Form/SingleSelect";
import Toggle from "../../Form/Toggle";
import MultiSelect from "../../Form/MultiSelect";

import { FrequencyTypes } from "../../../enums/FrequencyTypes";
import { Days } from "../../../enums/Days";

import { transformOptions } from "../../../helpers";

const EventRecurrence = ({
    formData,
    handleChange,
    handelChangeRecurrence,
}: {
    formData: any;
    handleChange: (field: string, value: any) => void;
    handelChangeRecurrence: (field: string, value: any) => void;
}) => {
    return (
        <div className="px-3 py-2 grid grid-cols-1 sm:grid-cols-6 gap-3">
            <div className="sm:col-span-6">
                <div className="mt-2">
                    <Toggle
                        label="Recurring"
                        onChange={(e) => handleChange("is_recurring", e)}
                    />
                </div>
            </div>

            {formData.is_recurring && (
                <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-2">
                            <SingleSelect
                                label="Frequency"
                                options={FrequencyTypes.asOptionArray()}
                                onChange={(value) =>
                                    handelChangeRecurrence(
                                        "frequency_type",
                                        value,
                                    )
                                }
                                value={
                                    formData.recurrence?.frequency_type?.toString() ??
                                    ""
                                }
                            />
                        </div>
                        <div className="col-span-2">
                            <SingleSelect
                                label="Every"
                                options={transformOptions(["1", "2", "3"])}
                                // @ts-ignore
                                value={formData.recurrence?.frequency ?? 1}
                                onChange={(value) =>
                                    handelChangeRecurrence("frequency", value)
                                }
                            />
                        </div>
                    </div>
                    {formData.recurrence?.frequency_type ===
                        FrequencyTypes.Weekly && (
                        <div className="col-span-3">
                            <MultiSelect
                                options={Days.asOptionArray()}
                                // @ts-ignore
                                value={formData.recurrence?.days ?? []}
                                onChange={(value) =>
                                    handelChangeRecurrence("days", value)
                                }
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventRecurrence;
