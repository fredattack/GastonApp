import ModelRepository from "../Repository/ModelRepository";

export default class ModelService {
    private modelRepository: ModelRepository;

    constructor() {
        this.modelRepository = new ModelRepository();
    }

    async getModels(collection: string) {
        const ownerId = this.getAuthenticatedOwnerId();
        const events = await this.modelRepository.getModelsByOwner(ownerId,collection);

        return events.map((event) => ({
            ...event,
        }));
    }

    async asOptions(collection: string) {
        try {
            const models = await this.getModels(collection);
            const mapModels = models.map((model) => ({
                //@ts-ignore
                value: model.id,
                //@ts-ignore
                label: model.name,
            }));
            return mapModels;

        } catch (error) {
            console.error("Error fetching options:", error);
            throw error;
        }
    }

    async add(collection:string,modelData: any) {
        // Format modelData if necessary
        const formattedData = {
            ...modelData,
            createdAt: new Date().toISOString(),
        };
        return await this.modelRepository.add(collection,formattedData);
    }

    async update(collection:string,eventId: string, updatedData: any) {
        // Format updatedData if necessary
        const formattedData = {
            ...updatedData,
            updatedAt: new Date().toISOString(),
        };
        await this.modelRepository.update(collection,eventId, formattedData);
    }

    async delete(collection:string,eventId: string) {
        await this.modelRepository.delete(collection,eventId);
    }
    private getAuthenticatedOwnerId(): string | null {
        // Placeholder for authentication logic; replace with your actual auth logic
        const authId = "vB6WiAAmU8PsKg9chwip"; // Replace with dynamic user auth
        return authId;
    }
}

