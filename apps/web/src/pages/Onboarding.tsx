import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "@phosphor-icons/react";
import PetForm from "../components/Pets/form/PetForm";
import { usePets } from "../contexts/PetsContext";

const DEFAULT_PET_FORM: PetFormData = {
    id: null,
    name: "",
    species: "dog",
    breed: "",
    birthDate: "",
    isActive: true,
    ownerId: "",
    order: 0,
    created_at: "",
};

export default function Onboarding() {
    const navigate = useNavigate();
    const { refreshPets } = usePets();
    const [petFormData, setPetFormData] =
        useState<PetFormData>(DEFAULT_PET_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const petFormRef = useRef<{ handleSubmit: () => Promise<void> }>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        setPetFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await petFormRef.current?.handleSubmit();
            await refreshPets();
            navigate("/");
        } catch {
            // PetForm handles its own error toasts
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background:
                    "linear-gradient(135deg, var(--color-lin-2), var(--color-lin-0))",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "520px",
                    background: "var(--color-lin-0)",
                    borderRadius: "var(--radius-2xl)",
                    boxShadow: "var(--shadow-lg)",
                    padding: "var(--spacing-40) var(--spacing-32)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative circle */}
                <div
                    style={{
                        position: "absolute",
                        top: "-40px",
                        right: "-40px",
                        width: "160px",
                        height: "160px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-primary-50)",
                        opacity: 0.5,
                    }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Header */}
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "var(--spacing-32)",
                        }}
                    >
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "72px",
                                height: "72px",
                                borderRadius: "var(--radius-full)",
                                background:
                                    "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))",
                                marginBottom: "var(--spacing-16)",
                            }}
                        >
                            <PawPrint
                                size={36}
                                weight="bold"
                                style={{ color: "var(--color-primary-600)" }}
                            />
                        </div>
                        <h1
                            style={{
                                fontSize: "var(--font-size-h2)",
                                fontWeight: "var(--font-weight-bold)",
                                color: "var(--color-text-primary)",
                                marginBottom: "var(--spacing-8)",
                            }}
                        >
                            Bienvenue sur Gaston !
                        </h1>
                        <p
                            style={{
                                fontSize: "var(--font-size-body-m)",
                                color: "var(--color-text-secondary)",
                                lineHeight: "var(--line-height-relaxed)",
                            }}
                        >
                            Commencez par ajouter votre premier compagnon
                        </p>
                    </div>

                    {/* Pet Form */}
                    <div style={{ marginBottom: "var(--spacing-24)" }}>
                        <PetForm
                            ref={petFormRef}
                            petFormData={petFormData}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !petFormData.name.trim()}
                        style={{
                            width: "100%",
                            padding: "var(--spacing-16)",
                            background: "var(--color-primary-500)",
                            color: "white",
                            fontSize: "var(--font-size-body-m)",
                            fontWeight: "var(--font-weight-semibold)",
                            borderRadius: "9999px",
                            border: "none",
                            cursor:
                                isSubmitting || !petFormData.name.trim()
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                isSubmitting || !petFormData.name.trim()
                                    ? 0.5
                                    : 1,
                            transition: "all var(--transition-normal)",
                        }}
                    >
                        {isSubmitting
                            ? "Enregistrement..."
                            : "Ajouter mon compagnon"}
                    </button>
                </div>
            </div>
        </div>
    );
}
