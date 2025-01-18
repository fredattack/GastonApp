import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconHorizontalDots from "../Icon/IconHorizontalDots";
import Dropdown from "../Dropdown";

// @ts-ignore
import { useIcons } from "../../providers/FontawesomeProvider";

const DropdownMenu: ({
    id,
    actions,
    openingDirection,
}: {
    id: number;
    actions: Action[];
    openingDirection?: string;
}) => React.JSX.Element = ({
    id,
    actions,
    openingDirection = "right",
}: {
    id: number;
    actions: Action[];
    openingDirection?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const icons = useIcons();
    return (
        <Dropdown
            offset={[0, 5]}
            placement={`${openingDirection == "left" ? "bottom-start" : "bottom-end"}`}
            btnClassName="text-black"
            // @ts-ignore
            button={<FontAwesomeIcon icon={icons.bars} />}
            // <IconHorizontalDots className="rotate-90 opacity-70 hover:opacity-100" />
        >
            <ul className="text-sm font-medium bg-white">
                {actions.map((action, index) => (
                    <li key={index} className="w-full">
                        <button
                            type="button"
                            onClick={() => action.onClick()}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    </li>
                ))}
            </ul>
        </Dropdown>
    );
};

export default DropdownMenu;
