import React from "react";
import { useTranslation } from "react-i18next";

import SingleSelect from "../../Form/SingleSelect";
import Toggle from "../../Form/Toggle";
import MultiSelect from "../../Form/MultiSelect";

import { EventTypes } from "../../../enums/EventTypes";

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
        <div className="px-3 py-2 grid grid-cols-1 sm:grid-cols-6 gap-3">
            {/* Title */}
            <div className="relative">
                <label
                    htmlFor="name"
                    className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900 capitalize-first"
                >
                    {t("title")}
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
            </div>

            {/* Type */}
            <SingleSelect
                label={t("type")}
                options={EventTypes.asOptionArray()}
                value={formData.type}
                onChange={(value) => handleChange("type", value)}
            />
            {formData.type !== EventTypes.Feeding && (
                <MultiSelect
                    label={t("pets")}
                    options={petOptions}
                    value={formData.petId}
                    onChange={(value) => handleChange("petId", value)}
                />
            )}
            {/* #region toggle fullday */}
            {formData.type !== EventTypes.Feeding && (
                <div className="sm:col-span-6">
                    <Toggle
                        label={t("full_day")}
                        initialState={formData.is_full_day}
                        onChange={(e) => handleChange("is_full_day", e)}
                    />
                </div>
            )}
            {/* #region date start */}
            <div className="sm:col-span-3">
                <div className="relative">
                    <label
                        htmlFor="start_date"
                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900 capitalize-first"
                    >
                        {t("when")}
                    </label>

                    <input
                        id="start_date"
                        name="start_date"
                        type={formData.is_full_day ? "date" : "datetime-local"}
                        value={
                            formData.start_date
                                ? new Date(formData.start_date)
                                      .toISOString()
                                      .slice(0, formData.is_full_day ? 10 : 16) // 📅 Ajuste selon le type
                                : ""
                        }
                        onChange={(e) =>
                            handleChange("start_date", e.target.value)
                        }
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                    />
                </div>
            </div>
            {/* #region date end */}
            {!["feeding"].includes(formData.type) && (
                <div className="relative">
                    <label
                        htmlFor="end_date"
                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900 capitalize-first"
                    >
                        {t("end")}
                    </label>

                    <input
                        id="end_date"
                        name="end_date"
                        type={formData.is_full_day ? "date" : "datetime-local"}
                        value={
                            formData.end_date
                                ? new Date(formData.end_date)
                                      .toISOString()
                                      .slice(0, formData.is_full_day ? 10 : 16)
                                : ""
                        }
                        onChange={(e) =>
                            handleChange("end_date", e.target.value)
                        }
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                    />
                </div>
            )}
        </div>
    );
};

export default EventDetails;
