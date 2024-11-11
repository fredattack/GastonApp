import React, { useState } from 'react';
const DropdownMenu: ({   id, actions }: {
    id: number;
    actions: Action[]
}) => React.JSX.Element = ({ id, actions }: { id: number, actions: Action[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
            {/* Bouton pour ouvrir/fermer le menu */}
            <button className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none" onClick={toggleDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v.01M12 12v.01M12 18v.01" />
                </svg>
            </button>
            {/* Menu déroulant */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#24324A] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                    onClick={(e) => e.stopPropagation()} // Empêche la fermeture du menu lorsqu'on clique dessus
                >
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-300">
                        {actions.map((action:Action, index:number) => (
                            <li key={`${id}-${index}`}>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {
                                        action.onClick();
                                        setIsOpen(false); // Fermer le menu après avoir cliqué sur une action
                                    }}
                                >
                                    {action.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default DropdownMenu;
