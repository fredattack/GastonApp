import { useTranslation } from "react-i18next";
import { Dog, Cat, PawPrint, type Icon } from "@phosphor-icons/react";

const speciesIcons: Record<string, Icon> = {
    dog: Dog,
    cat: Cat,
};

function getAge(birthDate?: string): number | null {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
    }
    return age >= 0 ? age : null;
}

const PetCard = ({ pet, actions, onEdit }: { pet: Pet; actions: any; onEdit?: () => void }) => {
    const { t } = useTranslation();
    const age = getAge(pet.birthDate);
    const SpeciesIcon = speciesIcons[pet.species] || PawPrint;

    const hasPhoto = pet.photo && !pet.photo.includes("placeholder");

    return (
        <div
            className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-ds-sm hover:shadow-ds-md transition-all duration-250 cursor-pointer"
            data-testid={`pet-card-${pet.name}`}
            onClick={onEdit}
        >
            {/* Avatar */}
            {hasPhoto ? (
                <img
                    src={pet.photo}
                    alt={pet.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-ds-xs flex-shrink-0"
                />
            ) : (
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center ring-2 ring-white shadow-ds-xs flex-shrink-0">
                    <SpeciesIcon size={28} weight="regular" className="text-primary-500" />
                </div>
            )}

            {/* Infos */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3
                        className="text-base font-semibold text-dark truncate"
                        data-testid="pet-card-name"
                    >
                        {pet.name}
                    </h3>
                    {/* Badge statut */}
                    {pet.isActive === false && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-lin-3 text-lin-8">
                            {t("pets.status_inactive")}
                        </span>
                    )}
                </div>
                <p className="text-sm text-lin-8 truncate">
                    {pet.breed}
                    {age !== null && (
                        <span className="text-lin-7">
                            {" "}
                            &middot; {age > 1 ? t("pets.years_old_plural", { age }) : t("pets.years_old", { age })}
                        </span>
                    )}
                </p>
            </div>

            {/* Actions menu */}
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <PetDropdown actions={actions} />
            </div>
        </div>
    );
};

// Dropdown inline pour éviter la dépendance au DropdownMenu Vristo
import { useState, useRef, useEffect } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";

const PetDropdown = ({ actions }: { actions: any[] }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-lin-2 transition-colors"
                aria-label="Actions"
            >
                <DotsThreeVertical size={20} weight="bold" className="text-lin-7" />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-ds-lg py-1.5 z-50 border border-lin-3">
                    {actions.map((action: any, index: number) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                action.onClick();
                                setOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-dark hover:bg-lin-1 transition-colors text-left"
                        >
                            {action.icon && <span className="text-lin-7">{action.icon}</span>}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PetCard;
