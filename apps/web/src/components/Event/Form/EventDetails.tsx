import React from "react";
import { useTranslation } from "react-i18next";

import SingleSelect from "../../Form/SingleSelect";
import Toggle from "../../Form/Toggle";
import MultiSelect from "../../Form/MultiSelect";

import { EventTypes } from "../../../enums/EventTypes";

const inputClasses =
    "block w-full bg-lin-1 border-2 border-lin-5 rounded-[12px] px-4 py-3 text-base text-[#1A1A1A] font-nunito min-h-[48px] placeholder:text-[#8E8E8E] hover:border-lin-6 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors duration-150";

const EventDetails = ({
    formData,
    handleChange,
    petOptions,
}: {
    formData: any;
    handleChange: (key: string, value: any) => void;
    petOptions: any;
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-5 px-1">
            {/* Title - Full width */}
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-[#4A4A4A] mb-2"
                >
                    {t("event.title")}
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder={t("event.title")}
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className={inputClasses}
                />
            </div>

            {/* Type + Pets - Side by side on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SingleSelect
                    label={t("event.type")}
                    options={EventTypes.asOptionArray()}
                    value={formData.type}
                    onChange={(value) => handleChange("type", value)}
                />

                {![EventTypes.Feeding, EventTypes.Medical].includes(
                    formData.type,
                ) && (
                    <MultiSelect
                        label={t("event.pets")}
                        options={petOptions}
                        value={formData.petId}
                        onChange={(value) => handleChange("petId", value)}
                    />
                )}
            </div>

            {/* Full day toggle */}
            {formData.type !== EventTypes.Feeding && (
                <Toggle
                    label={t("event.full_day")}
                    initialState={formData.is_full_day}
                    onChange={(e) => handleChange("is_full_day", e)}
                />
            )}

            {/* Dates - Side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="start_date"
                        className="block text-sm font-semibold text-[#4A4A4A] mb-2"
                    >
                        {t("event.start_date")}
                    </label>
                    <input
                        id="start_date"
                        name="start_date"
                        type={formData.is_full_day ? "date" : "datetime-local"}
                        value={
                            formData.start_date
                                ? new Date(formData.start_date)
                                      .toISOString()
                                      .slice(
                                          0,
                                          formData.is_full_day ? 10 : 16,
                                      )
                                : ""
                        }
                        onChange={(e) =>
                            handleChange("start_date", e.target.value)
                        }
                        className={inputClasses}
                    />
                </div>

                {!["feeding"].includes(formData.type) && (
                    <div>
                        <label
                            htmlFor="end_date"
                            className="block text-sm font-semibold text-[#4A4A4A] mb-2"
                        >
                            {t("event.end_date")}
                        </label>
                        <input
                            id="end_date"
                            name="end_date"
                            type={
                                formData.is_full_day ? "date" : "datetime-local"
                            }
                            value={
                                formData.end_date
                                    ? new Date(formData.end_date)
                                          .toISOString()
                                          .slice(
                                              0,
                                              formData.is_full_day ? 10 : 16,
                                          )
                                    : ""
                            }
                            onChange={(e) =>
                                handleChange("end_date", e.target.value)
                            }
                            className={inputClasses}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
