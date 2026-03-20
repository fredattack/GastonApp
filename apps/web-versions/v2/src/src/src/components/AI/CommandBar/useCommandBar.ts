import { useState, useEffect, useCallback } from "react";

interface UseCommandBarReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

const useCommandBar = (): UseCommandBarReturn => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                toggle();
            }
            if (e.key === "Escape" && isOpen) {
                e.preventDefault();
                close();
            }
        };

        const handleCustomOpen = () => open();

        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("open-command-bar", handleCustomOpen);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("open-command-bar", handleCustomOpen);
        };
    }, [isOpen, toggle, close, open]);

    return { isOpen, open, close, toggle };
};

export default useCommandBar;
