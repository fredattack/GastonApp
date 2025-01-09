import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

interface DatePickerProps {
    label: string;
    onChange: (selectedDate: string | null) => void;
}

export default function DatePicker({ label, onChange }: DatePickerProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const daysContainerRef = useRef<HTMLDivElement | null>(null);
    const datepickerContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (daysContainerRef.current) {
            renderCalendar();
        }
    }, [currentDate, isCalendarOpen]);

    const renderCalendar = () => {
        console.log('currentDate',currentDate );
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const daysContainer = daysContainerRef.current;
        if (!daysContainer) return;
        daysContainer.innerHTML = "";

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement("div");
            daysContainer.appendChild(emptyDiv);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.className =
                "flex h-[38px] w-[38px] items-center justify-center rounded-[7px] border-[.5px] border-transparent text-dark hover:border-stroke hover:bg-gray-2 sm:h-[46px] sm:w-[47px] dark:text-white dark:hover:border-dark-3 dark:hover:bg-dark mb-2";
            dayDiv.textContent = i.toString();
            dayDiv.addEventListener("click", () => {

                const selectedDay = i < 10 ? `0${i}` : i;
                let selectedMonth = (month + 1) < 10 ? `0${month + 1}` : month + 1;
                const selectedDateValue = `${selectedDay}/${selectedMonth}/${year}`;

                setSelectedDate(selectedDateValue);

                onChange(selectedDateValue);

                daysContainer
                    .querySelectorAll("div")
                    .forEach((d) => d.classList.remove("bg-primary", "text-white"));
                dayDiv.classList.add("bg-primary", "text-white", "dark:text-white");
            });
            daysContainer.appendChild(dayDiv);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(
            (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() - 1))
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() + 1))
        );
    };

    const handleApply = () => {
        console.log('selectedDate', selectedDate);
        if (selectedDate) {
            setIsCalendarOpen(false);
        }
    };

    const handleCancel = () => {
        setSelectedDate(null);
        setIsCalendarOpen(false);
        onChange(null);
    };

    const handleToggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            datepickerContainerRef.current instanceof HTMLElement &&
            event.target &&
            !datepickerContainerRef.current.contains(event.target as Node) &&
            (event.target as HTMLElement).id !== "datepicker" &&
            (event.target as HTMLElement).id !== "toggleDatepicker"
        ) {
            setIsCalendarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-900">
                {label}
            </label>
            <section className="bg-white mt-2 dark:bg-dark">
                <div className="container">
                    <div className="mx-auto w-full max-w-[510px]">
                        <div className="relative mb-3">
                            <input
                                id="datepicker"
                                type="text"
                                placeholder="Pick a date"
                                className="h-12 w-full appearance-none rounded-lg border border-stroke bg-white pl-12 pr-4 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                value={selectedDate || ""}
                                readOnly
                                onClick={handleToggleCalendar}
                            />
                            <span
                                id="toggleDatepicker"
                                onClick={handleToggleCalendar}
                                className="absolute inset-y-0 flex h-12 w-12 items-center justify-center text-dark-5 cursor-pointer"
                            >
                <FontAwesomeIcon icon={faCalendarDays}  />
              </span>
                        </div>

                        {isCalendarOpen && (
                            <div
                                ref={datepickerContainerRef}
                                id="datepicker-container"
                                className="flex w-full flex-col rounded-xl bg-white p-4 shadow-four sm:p-[30px] dark:bg-dark-2 dark:shadow-box-dark"
                            >
                                <div className="flex items-center justify-between pb-4">
                                    <button
                                        id="prevMonth"
                                        className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[7px] border-[.5px] border-stroke bg-gray-2 text-dark hover:border-primary hover:bg-primary hover:text-white sm:h-[46px] sm:w-[46px] dark:border-dark-3 dark:bg-dark dark:text-white"
                                        onClick={handlePrevMonth}
                                    >
                                        &#8592;
                                    </button>
                                    <span
                                        id="currentMonth"
                                        className="text-xl font-medium capitalize text-dark dark:text-white"
                                    >
                    {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                  </span>
                                    <button
                                        id="nextMonth"
                                        className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[7px] border-[.5px] border-stroke bg-gray-2 text-dark hover:border-primary hover:bg-primary hover:text-white sm:h-[46px] sm:w-[46px] dark:border-dark-3 dark:bg-dark dark:text-white"
                                        onClick={handleNextMonth}
                                    >
                                        &#8594;
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 text-center text-sm font-medium sm:text-lg">
                                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                                        <span key={day} className="h-[38px] w-[38px] flex items-center justify-center">
                      {day}
                    </span>
                                    ))}
                                </div>

                                <div
                                    ref={daysContainerRef}
                                    id="days-container"
                                    className="grid grid-cols-7 text-center text-sm font-medium sm:text-lg"
                                ></div>

                                <div className="flex items-center space-x-3 pt-4 sm:space-x-5">
                                    <button
                                        id="cancelBtn"
                                        className="flex h-[50px] w-full items-center justify-center rounded-md bg-dark text-base font-medium text-white hover:bg-opacity-90"
                                        onClick={handleCancel}
                                    >
                                        Remove
                                    </button>
                                    <button
                                        id="applyBtn"
                                        className="flex h-[50px] w-full items-center justify-center rounded-md bg-primary text-base font-medium text-white hover:bg-blue-dark"
                                        onClick={handleApply}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
