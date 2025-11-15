import React from "react";
import HeroSection from "../components/Home/HeroSection";
import QuickActions from "../components/Home/QuickActions";
import PetCards from "../components/Home/PetCards";
import TodayTimeline from "../components/Home/TodayTimeline";

/**
 * Page d'accueil - Design Apple-style, mobile-first
 * Interface ultra-intuitive pour utilisateurs non techniques
 */
const Index: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Message d'accueil personnalisé */}
            <HeroSection />

            {/* Actions rapides - 4 grandes cartes */}
            <QuickActions />

            {/* Mes animaux - Aperçu horizontal scrollable */}
            <PetCards />

            {/* Événements du jour - Timeline chronologique */}
            <TodayTimeline />
        </div>
    );
};

export default Index;
