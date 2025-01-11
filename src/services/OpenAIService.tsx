import OpenAI from 'openai';
export class OpenAiService {
    static async sendPrompt(messages: { role: string; content: string }[]): Promise<any> {
        try {
            const client = new OpenAI({
                apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                dangerouslyAllowBrowser: true
            });
            // On attend la réponse de l'API
            const response = await client.chat.completions.create({
                model: "gpt-4o",
                //@ts-ignore
                messages: messages
            });

            // Traitement de la réponse
            const content = response.choices[0]?.message?.content;
            if (content) {
                return this.getFitObject(content);
            } else {
                throw new Error("No content received from OpenAI.");
            }
        } catch (error) {
            console.error("Error sending prompt to OpenAI:", error);
            throw new Error("Failed to fetch response from OpenAI");
        }
    }

    private static getFitObject(content: string|null): any {
        // Traitement spécifique de la réponse si besoin
        return content;
    }
}
