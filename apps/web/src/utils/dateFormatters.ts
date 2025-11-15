export function formatDateConversational(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const timeStr = d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Aujourd'hui
    if (d.toDateString() === now.toDateString()) {
        const hour = d.getHours();
        if (hour < 12) return `Aujourd'hui matin à ${timeStr}`;
        if (hour < 18) return `Aujourd'hui après-midi à ${timeStr}`;
        return `Aujourd'hui soir à ${timeStr}`;
    }

    // Demain
    if (d.toDateString() === tomorrow.toDateString()) {
        const hour = d.getHours();
        if (hour < 12) return `Demain matin à ${timeStr}`;
        if (hour < 18) return `Demain après-midi à ${timeStr}`;
        return `Demain soir à ${timeStr}`;
    }

    // Cette semaine (dans les 7 prochains jours)
    const diffDays = Math.ceil(
        (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays > 0 && diffDays <= 7) {
        const weekday = d.toLocaleDateString("fr-FR", { weekday: "long" });
        const hour = d.getHours();
        let timeOfDay = "";
        if (hour < 12) timeOfDay = "matin";
        else if (hour < 18) timeOfDay = "après-midi";
        else timeOfDay = "soir";

        return `${weekday} ${timeOfDay} à ${timeStr}`;
    }

    // Autre (date complète)
    return d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatDateShort(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatTimeOnly(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
