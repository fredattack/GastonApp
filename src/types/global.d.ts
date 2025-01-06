declare global {
    interface Action {
        label: string;
        onClick: () => void;
    }
    interface Pet {
        id: string;
        ownerId: string;
        name: string;
        species: string;
        breed: string;
        birthDate: string;
        photo: string;
        tasks: string[];
        is_active: boolean;
        createdAt: string;
    }
}

// Required to make this a module and avoid errors in a global declaration file
export {};
