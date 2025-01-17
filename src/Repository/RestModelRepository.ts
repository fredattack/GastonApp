import axios
    from 'axios';



export default class RestModelRepository {
    private baseUrl: string;
    private apiClient: string;

    constructor() {
        const apiUrl="";
        const url = import.meta.env.VITE_API_URL + apiUrl;
    this.apiClient = axios.create({
        baseURL: url,
        withCredentials: true
    })
    }
    async getModels(ownerId: string | null, collection: string): Promise<any[]> {
        if (!ownerId) {
            throw new Error("User not authenticated");
        }
        console.log('this.apiClient', this.apiClient);
        try {
            const response = await this.apiClient.get(`/${collection}`, {
                params: { ownerId }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching models from ${collection}:`, error);
            throw error;
        }
    }

    async getModelById(id: string | null, collection: string): Promise<any | null> {
        if (!id) {
            throw new Error("Document ID is required");
        }

        try {
            const response = await axios.get(`${this.baseUrl}/${collection}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching model with ID ${id} from ${collection}:`, error);
            throw error;
        }
    }

    async getModelsByOwner(ownerId: string | null, collection: string,initialFilters:Object = []): Promise<any[]> {
        const url = import.meta.env.VITE_API_URL;
        const apiClient = axios.create({
            baseURL: url,
            withCredentials: true
        })
        console.log('url', url);
        if (!ownerId) {
            throw new Error("User not authenticated");
        }
        const filters = {
            ...initialFilters,
            ownerId
        };

        try {
            const response = await apiClient.get(`${collection}`, {
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching models by owner from ${collection}:`, error);
            throw error;
        }
    }

    async add(collection: string, eventData: any): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/${collection}`, eventData);
            return response.data.id;
        } catch (error) {
            console.error(`Error adding model to ${collection}:`, error);
            throw error;
        }
    }

    async update(collection: string, eventId: string, updatedData: any): Promise<void> {
        try {
            await axios.put(`${this.baseUrl}/${collection}/${eventId}`, updatedData);
        } catch (error) {
            console.error(`Error updating model with ID ${eventId} in ${collection}:`, error);
            throw error;
        }
    }

    async delete(collection: string, eventId: string): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/${collection}/${eventId}`);
        } catch (error) {
            console.error(`Error deleting model with ID ${eventId} from ${collection}:`, error);
            throw error;
        }
    }
}
