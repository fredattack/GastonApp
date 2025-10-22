import axiosClient from "../providers/apiClientProvider/axiosClient";

export default class RestModelRepository {
    constructor() {}

    async getModels(
        ownerId: string | null,
        collection: string,
    ): Promise<any[]> {
        if (!ownerId) {
            throw new Error("User not authenticated");
        }

        try {
            const response = await axiosClient.get(`/${collection}`, {
                params: { ownerId },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching models from ${collection}:`, error);
            throw error;
        }
    }

    async getModelById(
        id: string | null,
        collection: string,
    ): Promise<any | null> {
        if (!id) {
            throw new Error("Document ID is required");
        }

        try {
            const response = await axiosClient.get(`/${collection}/${id}`);
            return response.data;
        } catch (error) {
            console.error(
                `Error fetching model with ID ${id} from ${collection}:`,
                error,
            );
            throw error;
        }
    }

    async getModelsByOwner(
        ownerId: string | null,
        collection: string,
        initialFilters: Object = [],
    ): Promise<any[]> {
        if (!ownerId) {
            throw new Error("User not authenticated");
        }
        const filters = {
            ...initialFilters,
            ownerId,
        };

        try {
            const response = await axiosClient.get(`${collection}`, {
                params: filters,
            });
            return response.data;
        } catch (error) {
            console.error(
                `Error fetching models by owner from ${collection}:`,
                error,
            );
            throw error;
        }
    }

    async add(collection: string, eventData: any): Promise<string> {
        try {
            const response = await axiosClient.post(
                `/${collection}`,
                eventData,
            );
            return response.data.id;
        } catch (error) {
            console.error(`Error adding model to ${collection}:`, error);
            throw error;
        }
    }

    async update(
        collection: string,
        eventId: string,
        updatedData: any,
    ): Promise<void> {
        try {
            await axiosClient.put(`/${collection}/${eventId}`, updatedData);
        } catch (error) {
            console.error(
                `Error updating model with ID ${eventId} in ${collection}:`,
                error,
            );
            throw error;
        }
    }

    async delete(
        collection: string,
        model: any,
        withRecurrence: boolean,
    ): Promise<void> {
        const id = model.id ?? model.master_id;
        try {
            await axiosClient.delete(
                `/${collection}/${id}${
                    withRecurrence
                        ? "?with-recurrence=true"
                        : `?date=${model.start_date}`
                }`,
            );
        } catch (error) {
            console.error(
                `Error deleting model with ID ${id} from ${collection}:`,
                error,
            );
            throw error;
        }
    }
}
