/**
 * Validation utilities for form inputs
 */

export interface ValidationError {
    field: string;
    message: string;
}

export interface PetValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * Validate pet form data
 */
export const validatePetForm = (data: PetFormData): PetValidationResult => {
    const errors: ValidationError[] = [];

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
        errors.push({
            field: "name",
            message: "Name is required",
        });
    } else if (data.name.trim().length < 2) {
        errors.push({
            field: "name",
            message: "Name must be at least 2 characters",
        });
    } else if (data.name.length > 50) {
        errors.push({
            field: "name",
            message: "Name must not exceed 50 characters",
        });
    } else if (!/^[a-zA-Z0-9\s\-']+$/.test(data.name)) {
        errors.push({
            field: "name",
            message: "Name contains invalid characters",
        });
    }

    // Species validation
    const validSpecies = ["dog", "cat", "bird", "rabbit", "other"];
    if (!data.species || data.species.trim().length === 0) {
        errors.push({
            field: "species",
            message: "Species is required",
        });
    } else if (!validSpecies.includes(data.species.toLowerCase())) {
        errors.push({
            field: "species",
            message: "Invalid species selected",
        });
    }

    // Breed validation
    if (!data.breed || data.breed.trim().length === 0) {
        errors.push({
            field: "breed",
            message: "Breed is required",
        });
    } else if (data.breed.length > 50) {
        errors.push({
            field: "breed",
            message: "Breed must not exceed 50 characters",
        });
    }

    // Birth date validation (optional but must be valid if provided)
    if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        const today = new Date();

        if (isNaN(birthDate.getTime())) {
            errors.push({
                field: "birthDate",
                message: "Invalid birth date format",
            });
        } else if (birthDate > today) {
            errors.push({
                field: "birthDate",
                message: "Birth date cannot be in the future",
            });
        } else {
            // Check if date is too far in the past (100 years)
            const hundredYearsAgo = new Date();
            hundredYearsAgo.setFullYear(today.getFullYear() - 100);

            if (birthDate < hundredYearsAgo) {
                errors.push({
                    field: "birthDate",
                    message: "Birth date seems unrealistic",
                });
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors: ValidationError[]): string => {
    return errors.map((err) => err.message).join(", ");
};

/**
 * Get validation error for specific field
 */
export const getFieldError = (
    errors: ValidationError[],
    field: string,
): string | undefined => {
    const error = errors.find((err) => err.field === field);
    return error?.message;
};