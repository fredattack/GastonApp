import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEllipsisV,
    faPills,
    faShare,
    faUtensils,
    faWindowRestore,
} from "@fortawesome/free-solid-svg-icons";

export default function DisplaySettingsDropdown({
    viewMode,
    onChangeViewMode,
    onChangeViewStyle,
}: {
    viewMode: string;
    onChangeViewMode: (mode: string) => void;
    onChangeViewStyle: (mode: string) => void;
}) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-gray-500  hover:bg-gray-50">
                    <FontAwesomeIcon icon={faEllipsisV} className="w-5 h-5" />
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="py-1">
                    <MenuItem>
                        <div className="group p-2 ">
                            <div className="inline-flex align-middle w-full">
                                <button
                                    type="button"
                                    className={`group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none ${viewMode === "day" ? "border bg-gray-100" : ""}`}
                                    onClick={() => onChangeViewMode("day")}
                                >
                                    Day
                                </button>
                                <button
                                    type="button"
                                    className={`group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none ${viewMode === "week" ? "border bg-gray-200" : ""}`}
                                    onClick={() => onChangeViewMode("week")}
                                >
                                    Week
                                </button>
                                <button
                                    type="button"
                                    className={`group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none ${viewMode === "month" ? "border bg-gray-200" : ""}`}
                                    onClick={() => onChangeViewMode("month")}
                                >
                                    Month
                                </button>
                            </div>
                        </div>
                    </MenuItem>
                </div>
                <div className="py-1">
                    <MenuItem>
                        <div className="group">
                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => onChangeViewStyle("card")}
                            >
                                <FontAwesomeIcon
                                    icon={faWindowRestore}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                Default
                            </div>

                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => onChangeViewStyle("feeding")}
                            >
                                <FontAwesomeIcon
                                    icon={faUtensils}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                Repas
                            </div>

                            <div
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                onClick={() => onChangeViewStyle("care")}
                            >
                                {/* <DocumentDuplicateIcon */}
                                {/* aria-hidden="true" */}
                                {/* className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500" */}
                                {/* /> */}
                                <FontAwesomeIcon
                                    icon={faPills}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                Soins médicaux
                            </div>
                        </div>
                    </MenuItem>
                </div>

                <div className="py-1">
                    <MenuItem>
                        <div className="group">
                            <a
                                href="#"
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                                <FontAwesomeIcon
                                    icon={faShare}
                                    className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
                                />
                                {/* <UserPlusIcon aria-hidden="true" className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500" /> */}
                                Share
                            </a>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="group">
                            <a
                                href="#"
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                                Add to favorites
                            </a>
                        </div>
                    </MenuItem>
                </div>
                <div className="py-1">
                    <MenuItem>
                        <div className="group">
                            <a
                                href="#"
                                className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                                Delete
                            </a>
                        </div>
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    );
}
