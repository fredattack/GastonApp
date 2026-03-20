import { string } from "yup";

export function transformOptions(array: string[]): {
    label: string;
    value: string;
}[] {
    return array.map((item) => ({
        label: item,
        value: item,
    }));
}

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sumArray(array: number[]): number {
    return array.reduce((sum, num) => sum + num, 0);
}

export function updateNestedObject<T>(
    obj: T,
    path: string,
    value: any,
    type: string | null = null,
): T {
    if (typeof obj !== "object" || obj === null) {
        throw new TypeError("The first argument must be a non-null object.");
    }

    const keys = path.split(".");
    const lastKey = keys.pop()!;
    let current: any = obj;

    keys.forEach((key) => {
        if (current[key] === undefined || typeof current[key] !== "object") {
            current[key] = {}; // Crée un objet si nécessaire
        }

        current = current[key];
    });

    if (type === "array") {
        const old = current[lastKey];
        if (!current[lastKey]) {
            current[lastKey] = value;
        } else if (Array.isArray(value)) {
            if (value.some((el: any) => old.includes(el))) {
                current[lastKey] = old.filter((item: string) => {
                    return !value.includes(item);
                }); // Remove if exists
            } else {
                current[lastKey] = [...old, ...value]; // Add if not exists
            }
        } else {
            current[lastKey] = value;
        }
    } else {
        current[lastKey] = value;
    }
    console.log("obj", obj);
    return obj; // Retourne une copie immuable
}

export function removeMarkdown(text: string) {
    return (
        text
            // Remove code blocks and inline code
            .replace("```", "") // Remove code blocks
            .replace("```", "") // Remove code blocks
            .replace("json", "") // Remove code blocks
            .replace(/`{3}[\s\S]*?`{3}/g, "") // Multiline code blocks
            .replace(/`([^`]+)`/g, "$1") // Inline code

            // Remove images and links
            .replace(/!\[.*?\]\(.*?\)/g, "") // Images
            .replace(/\[([^\]]+)\]\((.*?)\)/g, "$1") // Links

            // Remove bold and italic
            .replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold
            .replace(/(\*|_)(.*?)\1/g, "$2") // Italic

            // Remove strikethrough
            .replace(/~~(.*?)~~/g, "$1")

            // Remove blockquotes
            .replace(/^>\s?/gm, "")

            // Remove headers
            .replace(/^#{1,6}\s*/gm, "")

            // Remove horizontal rules
            .replace(/-{3,}/g, "")

            // Remove unordered and ordered list markers
            .replace(/^\s*[-*+]\s+/gm, "")
            .replace(/^\s*\d+\.\s+/gm, "")

            // Remove extra spaces
            .replace(/\n{2,}/g, "\n")
            .trim()
    );
}
export function dateStartOfDay(date: Date) {
    const start_date = new Date(date.setHours(0, 0, 0, 0));
    return start_date;
}
export function dateEndOfDay(date: Date) {
    return new Date(date.setHours(23, 59, 59, 999));
}
// Attach helpers to the global `window` object
