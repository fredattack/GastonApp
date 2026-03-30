import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
    DotsThree,
    Pill,
    ShareNetwork,
    ForkKnife,
    SquaresFour,
} from "@phosphor-icons/react";

export default function DisplaySettingsDropdown({
    onChangeViewStyle,
}: {
    onChangeViewStyle: (mode: string) => void;
}) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full text-[#6B6B6B] hover:bg-lin-2 transition-colors">
                <DotsThree size={20} weight="bold" />
            </MenuButton>

            <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-[16px] bg-lin-0 shadow-ds-sm ring-1 ring-lin-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="p-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-[#9A9A8A] uppercase tracking-wider">
                        Affichage
                    </p>
                    <MenuItem>
                        <button
                            type="button"
                            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-sm text-[#4A4A3A] rounded-lg data-[focus]:bg-primary-50 transition-colors"
                            onClick={() => onChangeViewStyle("card")}
                        >
                            <SquaresFour size={18} className="text-[#9A9A8A]" />
                            Par défaut
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button
                            type="button"
                            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-sm text-[#4A4A3A] rounded-lg data-[focus]:bg-primary-50 transition-colors"
                            onClick={() => onChangeViewStyle("feeding")}
                        >
                            <ForkKnife size={18} className="text-[#9A9A8A]" />
                            Repas
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button
                            type="button"
                            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-sm text-[#4A4A3A] rounded-lg data-[focus]:bg-primary-50 transition-colors"
                            onClick={() => onChangeViewStyle("care")}
                        >
                            <Pill size={18} className="text-[#9A9A8A]" />
                            Soins médicaux
                        </button>
                    </MenuItem>
                </div>
                <div className="border-t border-lin-3 p-1">
                    <MenuItem>
                        <button
                            type="button"
                            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-sm text-[#4A4A3A] rounded-lg data-[focus]:bg-primary-50 transition-colors"
                        >
                            <ShareNetwork size={18} className="text-[#9A9A8A]" />
                            Partager
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    );
}
