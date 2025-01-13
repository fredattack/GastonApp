import OpenAI from 'openai';
import axios, {
    AxiosInstance,
    AxiosResponse
} from 'axios';

export class OpenAiService {

    private apiClient: AxiosInstance;
    private endpoint: string;

    constructor() {
        const apiUrl="";
        const baseUrl = import.meta.env.VITE_API_URL + apiUrl;
        this.endpoint = "/ai";
        this.apiClient = axios.create({
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

   async sendPromptApi(messages: string): Promise<any> {
        try {
            const response: AxiosResponse = await this.apiClient.post(this.endpoint, {
                    prompt: messages,
                    filters:{
                    }
                });

            console.log('response sendPromptApi ++++++++',typeof response.data);
            console.log('response sendPromptApi ++++++++',response.data);
            return typeof response.data == 'string' ? JSON.parse(response.data) : response.data;

        } catch (error) {
            console.error("Error sending prompt to OpenAI:", error);
            throw new Error("Failed to fetch response from OpenAI");
        }
    }



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
