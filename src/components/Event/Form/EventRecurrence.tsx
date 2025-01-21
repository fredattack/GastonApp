import SingleSelect from "../../Form/SingleSelect";

import { FrequencyTypes } from "../../../enums/FrequencyTypes";

const EventRecurrence = ({
    formData,
    handleChange,
}: {
    formData: any;
    handleChange: (field: string, value: any) => void;
}) => (
    <div className="sm:col-span-6">
        <label className="block text-sm font-medium">Recurrence Details</label>
        <SingleSelect
            options={FrequencyTypes.asOptionArray()}
            value={formData.recurrence.frequency_type}
            onChange={() =>
                handleChange("recurrence", { ...formData.recurrence })
            }
        />
    </div>
);

export default EventRecurrence;
