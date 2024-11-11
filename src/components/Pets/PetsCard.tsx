import DropdownMenu
    from '../Shared/DropdownMenu';
import {
    useTranslation
} from 'react-i18next';

const PetCard = ({ pet ,actions}: { pet: Pet, actions:Action[] }) => {

    const { t } = useTranslation();
    return (
        <div key={pet.id} className="card relative border rounded-md shadow-lg p-6 flex flex-col items-center dark:bg-[#1b2e4b] dark:text-white-dark transition-all duration-300 hover:shadow-xl">
            {/* Dropdown Menu */}
            <div className="absolute top-0 right-0 mt-2 mr-2" >

            <DropdownMenu id={pet.id} actions={actions} />
            </div>

            {/* pet Info */}
            <img src={pet.photo} alt={`${pet.name}'s`} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-200 dark:border-gray-700" />
            <h3 className="text-lg font-semibold mb-2 capitalize text-center">{pet.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-bold capitalize">{t('species')}: </span>
                {pet.species}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-bold capitalize">{t('breed')}: </span>
                {pet.breed}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-bold capitalize">{t('birthdate')}: </span>
                {new Date(pet.dateOfBirth).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-bold capitalize">{t('owner_id')}: </span>
                {pet.ownerId}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400" />
            <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${pet.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {pet.isActive ? t('active') : t('inactive')}
            </div>
        </div>
    );
};

export default PetCard;
