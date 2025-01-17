import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class OpenAiService {
    private apiClient: AxiosInstance;

    private endpoint: string;

    constructor() {
        const apiUrl = '';
        const baseUrl = import.meta.env.VITE_API_URL + apiUrl;
        this.endpoint = '/ai';
        this.apiClient = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async sendPromptApi(messages: string): Promise<any> {
        try {
            console.log('messages', messages);
            const response: AxiosResponse = await this.apiClient.post(this.endpoint, {
                prompt: messages,
                filters: {},
            });
            return typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        } catch (error) {
            console.error('Error sending prompt to OpenAI:', error);
            throw new Error('Failed to fetch response from OpenAI');
        }
    }
}
