import { useTranslation } from "react-i18next";
import DropdownMenu from "../../Shared/DropdownMenu";

const PetCard = ({ pet, actions }: { pet: Pet; actions: Action[] }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between border rounded-md shadow-md p-4 bg-white dark:bg-[#1b2e4b] dark:text-white-dark transition-all duration-300 hover:shadow-lg">
            {/* Image */}
            <img
                src={pet.photo || "https://via.placeholder.com/50"}
                alt={pet.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
            />

            {/* Info Section */}
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{pet.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {pet.breed}
                </p>
                {/* <p className={`text-sm ${pet.isActive ? 'text-green-600' : 'text-red-600'}`}> */}
                {/*    {pet.isActive ? t('online') : t('offline')} */}
                {/* </p> */}
            </div>

            {/* Icons Section */}
            <div className="flex items-center space-x-3">
                {/* Settings Icon */}
                <div>
                    <DropdownMenu id={Number(pet.id)} actions={actions} />
                </div>
            </div>
        </div>
    );
};

export default PetCard;
