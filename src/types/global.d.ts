declare global {
    interface Action {
        icon: string;
        label: string;
        onClick: () => void;
    }
    interface Pet {
        birthDate: string;
        breed: string;
        createdAt: string;
        id: string;
        is_active: boolean;
        name: string;
        order: number;
        ownerId: string;
        species: string;
        photo: string;
        galerie: string[];
    }
}

// Required to make this a module and avoid errors in a global declaration file
export {};
