import ModelRepository from "../repository/RestModelRepository";

/**
 * Service class for managing pets (models) in the application.
 * Provides business logic layer between UI components and the data repository.
 *
 * @class ModelService
 * @example
 * ```typescript
 * const modelService = new ModelService();
 * const pets = await modelService.getModels('models');
 * ```
 */
export default class ModelService {
    private modelRepository: ModelRepository;

    /**
     * Creates an instance of ModelService.
     * Initializes the ModelRepository for data access.
     */
    constructor() {
        this.modelRepository = new ModelRepository();
    }

    /**
     * Retrieves a single model (pet) by ID from a specific collection.
     *
     * @param {string} collection - The collection name (e.g., 'models', 'pets')
     * @param {string} id - The unique identifier of the model
     * @returns {Promise<any>} The model data
     * @throws {Error} If the model is not found or if there's a database error
     *
     * @example
     * ```typescript
     * const pet = await modelService.getModel('models', 'pet_123');
     * console.log(pet.name); // "Max"
     * ```
     */
    async getModel(collection: string, id: string) {
        try {
            const model = await this.modelRepository.getModelById(
                id,
                collection,
            );
            if (!model) {
                throw new Error(
                    `Model with ID ${id} not found in collection ${collection}`,
                );
            }

            return {
                ...model,
            };
        } catch (error) {
            console.error(`Error fetching model with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Retrieves all models (pets) for the authenticated user.
     *
     * @param {string} collection - The collection name (e.g., 'models', 'pets')
     * @returns {Promise<any[]>} Array of models belonging to the authenticated user
     * @throws {Error} If there's an error fetching the models
     *
     * @example
     * ```typescript
     * const pets = await modelService.getModels('models');
     * pets.forEach(pet => console.log(pet.name));
     * ```
     */
    async getModels(collection: string) {
        const ownerId = this.getAuthenticatedOwnerId();
        const events: any = await this.modelRepository.getModelsByOwner(
            ownerId,
            collection,
        );

        return events?.data?.map((event: any) => ({
            ...event,
        }));
    }

    /**
     * Formats models as options for select/dropdown components.
     * Transforms model data into {value, label} format.
     *
     * @param {string} collection - The collection name
     * @returns {Promise<Array<{value: string, label: string}>>} Array of option objects
     * @throws {Error} If there's an error fetching the models
     *
     * @example
     * ```typescript
     * const petOptions = await modelService.asOptions('models');
     * // Returns: [{ value: 'pet_123', label: 'Max' }, { value: 'pet_456', label: 'Luna' }]
     * ```
     */
    async asOptions(collection: string) {
        try {
            const models = await this.getModels(collection);

            return models.map((model: any) => ({
                // @ts-ignore
                value: model.id,
                // @ts-ignore
                label: model.name,
            }));
        } catch (error) {
            console.error("Error fetching options:", error);
            throw error;
        }
    }

    /**
     * Adds a new model (pet) to the collection.
     * Automatically sets the creation timestamp.
     *
     * @param {string} collection - The collection name
     * @param {any} modelData - The model data to create
     * @returns {Promise<string>} The ID of the newly created model
     * @throws {Error} If there's an error creating the model
     *
     * @example
     * ```typescript
     * const newPetId = await modelService.add('models', {
     *   name: 'Max',
     *   species: 'dog',
     *   breed: 'Golden Retriever',
     *   birthDate: '2020-05-15'
     * });
     * ```
     */
    async add(collection: string, modelData: any) {
        // Format modelData if necessary
        const formattedData = {
            ...modelData,
            created_at: new Date().toISOString(),
        };
        return this.modelRepository.add(collection, formattedData);
    }

    /**
     * Updates an existing model (pet) in the collection.
     * Automatically sets the update timestamp.
     *
     * @param {string} collection - The collection name
     * @param {string} eventId - The ID of the model to update
     * @param {any} updatedData - The updated model data
     * @returns {Promise<void>}
     * @throws {Error} If the model doesn't exist or if there's an update error
     *
     * @example
     * ```typescript
     * await modelService.update('models', 'pet_123', {
     *   name: 'Max Jr.',
     *   breed: 'Golden Retriever Mix'
     * });
     * ```
     */
    async update(collection: string, eventId: string, updatedData: any) {
        // Format updatedData if necessary
        const formattedData = {
            ...updatedData,
            updatedAt: new Date().toISOString(),
        };
        await this.modelRepository.update(collection, eventId, formattedData);
    }

    /**
     * Deletes a model (pet) from the collection.
     * Optionally deletes all associated recurring events.
     *
     * @param {string} collection - The collection name
     * @param {any} model - The model object to delete (must contain id or master_id)
     * @param {boolean} [withRecurrence=false] - Whether to delete associated recurring events
     * @returns {Promise<void>}
     * @throws {Error} If the model doesn't exist or if there's a deletion error
     *
     * @example
     * ```typescript
     * // Delete pet and all its recurring events
     * await modelService.delete('models', { id: 'pet_123' }, true);
     *
     * // Delete pet only
     * await modelService.delete('models', { id: 'pet_123' }, false);
     * ```
     */
    async delete(
        collection: string,
        model: any,
        withRecurrence: boolean = false,
    ) {
        await this.modelRepository.delete(collection, model, withRecurrence);
    }

    /**
     * Gets the authenticated user's owner ID.
     *
     * @private
     * @returns {string | null} The owner ID of the authenticated user
     *
     * @todo Replace with actual authentication logic from Firebase Auth
     * @todo Remove hardcoded value once authentication is implemented
     */
    private getAuthenticatedOwnerId(): string | null {
        // Placeholder for authentication logic; replace with your actual auth logic
        const authId = "1"; // Replace with dynamic user auth
        return authId;
    }
}
