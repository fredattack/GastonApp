const PetDetails = ({
    formData,
    handleChange,
}: {
    formData: any;
    handleChange: (field: string, value: any) => void;
}) => (
    <div className="sm:col-span-6">
        <label className="block text-sm font-medium">Feeding Details</label>
        {formData.pets.map((pet: any, index: number) => (
            <div key={index} className="border p-4 rounded-md">
                <input
                    type="text"
                    value={pet.item}
                    onChange={(e) =>
                        handleChange(`pets[${index}].item`, e.target.value)
                    }
                    placeholder="Item"
                />
            </div>
        ))}
    </div>
);

export default PetDetails;
