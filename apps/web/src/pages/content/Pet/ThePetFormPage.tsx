import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Info,
    FirstAid,
    BowlFood,
    Images,
    CalendarDots,
    ClockCounterClockwise,
} from "@phosphor-icons/react";

import { useToast } from "../../../providers/ToastProvider";
import PetForm from "../../../components/Pets/form/PetForm";
import { usePets } from "../../../contexts/PetsContext";
import { modelService } from "../../../services";
import { logger } from "@/utils/logger";

const tabs = [
    { key: "infos", icon: Info },
    { key: "cares", icon: FirstAid },
    { key: "fooding", icon: BowlFood },
    { key: "galleries", icon: Images },
    { key: "events", icon: CalendarDots },
    { key: "timeline", icon: ClockCounterClockwise },
];

const ThePetFormPage = ({ pet }: { pet?: Pet }) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const { pets } = usePets();

    const [formData, setFormData] = useState<PetFormData>({
        birthDate: pet?.birthDate ?? "",
        created_at: pet?.created_at ?? "",
        id: pet?.id ?? null,
        isActive: pet?.isActive ?? true,
        name: pet?.name ?? "",
        order: pet?.order ?? 0,
        ownerId: pet?.ownerId ?? "",
        species: pet?.species ?? "dog",
        breed: "",
    });

    const [activeTab, setActiveTab] = useState("infos");

    useEffect(() => {
        if (id) {
            // Chercher le pet dans le contexte (deja charge) plutot que via API
            const found = pets.find((p) => String(p.id) === String(id));
            if (found) {
                setFormData({
                    birthDate: found.birthDate || "",
                    created_at: found.created_at || "",
                    id: found.id || null,
                    isActive: found.isActive ?? true,
                    name: found.name || "",
                    order: found.order || 0,
                    ownerId: found.ownerId || "",
                    species: found.species || "dog",
                    breed: found.breed || "",
                });
            }
        }
    }, [pet, id, pets]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value, type } = target;
        const { checked } = target as HTMLInputElement;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const addPet = async (petData: PetFormData) => {
        try {
            const data = {
                name: petData.name,
                species: petData.species,
                breed: petData.breed,
                birth_date: petData.birthDate,
                isActive: true,
            };
            const petId = await modelService.add("pets", data);
            logger.info("Pet successfully added with ID:", petId);
            addToast({ message: t("pets.added_success"), type: "success" });
            return petId;
        } catch (error) {
            console.error("Error adding pet:", error);
            addToast({ message: t("pets.add_error"), type: "error" });
            throw error;
        }
    };

    const updatePet = async (id: string, petData: PetFormData) => {
        try {
            const data = {
                name: petData.name,
                species: petData.species,
                breed: petData.breed,
                birth_date: petData.birthDate,
                isActive: petData.isActive,
            };
            await modelService.update("pets", id, data);
            logger.info("Pet successfully updated!");
            addToast({ message: t("pets.updated_success"), type: "success" });
        } catch (error) {
            console.error("Error updating pet:", error);
            addToast({ message: t("pets.update_error"), type: "error" });
            throw error;
        }
    };

    const handleCancel = () => {
        navigate("/content/pets");
    };

    const handleSubmit = async (formData: PetFormData) => {
        if (id) {
            try {
                await updatePet(id, formData);
                navigate("/content/pets");
            } catch (error) {
                console.error("Failed to update pet:", error);
            }
        } else {
            try {
                await addPet(formData);
                navigate("/content/pets");
            } catch (error) {
                console.error("Failed to add pet:", error);
            }
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "infos":
                return (
                    <PetForm
                        petFormData={formData}
                        onChange={handleChange}
                        onCancel={handleCancel}
                        onSubmit={(formData: any) =>
                            handleSubmit({ ...formData, ownerId: "" })
                        }
                        submitable
                    />
                );
            case "cares":
                return (
                    <div className="py-12 text-center text-lin-7">
                        <FirstAid size={40} className="mx-auto mb-3 text-lin-5" />
                        <p className="text-sm">{t("pets.tab_cares")} - Bientot disponible</p>
                    </div>
                );
            case "fooding":
                return (
                    <div className="py-12 text-center text-lin-7">
                        <BowlFood size={40} className="mx-auto mb-3 text-lin-5" />
                        <p className="text-sm">{t("pets.tab_fooding")} - Bientot disponible</p>
                    </div>
                );
            case "galleries":
                return (
                    <div className="py-12 text-center text-lin-7">
                        <Images size={40} className="mx-auto mb-3 text-lin-5" />
                        <p className="text-sm">{t("pets.tab_galleries")} - Bientot disponible</p>
                    </div>
                );
            case "events":
                return (
                    <div className="py-12 text-center text-lin-7">
                        <CalendarDots size={40} className="mx-auto mb-3 text-lin-5" />
                        <p className="text-sm">{t("pets.tab_events")} - Bientot disponible</p>
                    </div>
                );
            case "timeline":
                return (
                    <div className="py-12 text-center text-lin-7">
                        <ClockCounterClockwise size={40} className="mx-auto mb-3 text-lin-5" />
                        <p className="text-sm">{t("pets.tab_timeline")} - Bientot disponible</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const title = id ? t("pets.edit_title") : t("pets.create_title");

    return (
        <div className="py-6 pb-24 md:pb-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-5">
                <Link
                    to="/content/pets"
                    className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                    {t("pets.breadcrumb")}
                </Link>
                <span className="text-lin-6">/</span>
                <span className="text-lin-8">{title}</span>
            </nav>

            {/* Titre */}
            <h1 className="text-xl font-bold text-dark mb-6">{title}</h1>

            {/* Tabs (edit mode only) */}
            {id && (
                <div className="flex gap-1 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                                    isActive
                                        ? "bg-primary-400 text-white shadow-ds-sm"
                                        : "text-lin-7 hover:bg-lin-2 hover:text-dark"
                                }`}
                            >
                                <Icon size={18} weight={isActive ? "bold" : "regular"} />
                                {t(`pets.tab_${tab.key}`)}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Formulaire */}
            <div className="bg-white rounded-xl shadow-ds-sm p-6 md:p-8">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(formData);
                    }}
                >
                    {renderTabContent()}
                </form>
            </div>
        </div>
    );
};

export default ThePetFormPage;
