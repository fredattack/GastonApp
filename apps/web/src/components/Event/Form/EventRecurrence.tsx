import React from "react";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    return (
        <div className="space-y-4 px-1">
            <Toggle
                label={t("event.recurring")}
                onChange={(e) => handleChange("is_recurring", e)}
                initialState={formData.is_recurring}
            />

            {formData.is_recurring && (
                <div className="space-y-4 pl-1">
                    <div className="grid grid-cols-2 gap-4">
                        <SingleSelect
                            label={t("event.frequency")}
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
                        <SingleSelect
                            label={t("event.every")}
                            options={transformOptions(["1", "2", "3"])}
                            value={
                                formData.recurrence?.frequency?.toString() ??
                                "1"
                            }
                            onChange={(value) =>
                                handelChangeRecurrence("frequency", value)
                            }
                        />
                    </div>
                    {formData.recurrence?.frequency_type ===
                        FrequencyTypes.Weekly && (
                        <MultiSelect
                            label={t("event.days")}
                            options={Days.asOptionArray()}
                            value={formData.recurrence?.days ?? []}
                            onChange={(value) =>
                                handelChangeRecurrence("days", value)
                            }
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default EventRecurrence;
