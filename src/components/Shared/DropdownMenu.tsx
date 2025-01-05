import React, { useState } from 'react';
import IconHorizontalDots
    from '../Icon/IconHorizontalDots';
import Dropdown
    from '../Dropdown';

interface Action {
    label: string;
    onClick: () => void;
}

const DropdownMenu: ({ id, actions, openingDirection }: {
    id: number;
    actions: Action[];
    openingDirection?: string;
}) => React.JSX.Element = ({ id, actions, openingDirection = 'right' }: { id: number, actions: Action[], openingDirection?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    return (
        <Dropdown
            offset={[0, 5]}
            placement={`${openingDirection == 'left' ? 'bottom-start' : 'bottom-end'}`}
            btnClassName="text-primary"
            button={<IconHorizontalDots className="rotate-90 opacity-70 hover:opacity-100" />}
        >
            <ul className="text-sm font-medium bg-white">
                {actions.map((action, index) => (

                <li key={index}>
                    <button type="button" onClick={() => action.onClick()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {action.label}
                    </button>
                </li>
                ))}
            </ul>
        </Dropdown>
    );
};

export default DropdownMenu;
