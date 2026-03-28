import axiosClient from "../providers/apiClientProvider/axiosClient";

interface ApiConversation {
    id: string;
    title: string;
    isPinned: boolean;
    tags: string[];
    messages: ApiMessage[];
    createdAt: string;
    updatedAt: string;
}

interface ApiMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    metadata: Record<string, unknown> | null;
    timestamp: string;
}

class RestConversationRepository {
    private basePath = "/conversations";

    async getAll(): Promise<ApiConversation[]> {
        const response = await axiosClient.get(this.basePath);
        return response.data;
    }

    async getById(id: string): Promise<ApiConversation> {
        const response = await axiosClient.get(`${this.basePath}/${id}`);
        return response.data;
    }

    async create(data: {
        title?: string;
        messages?: Array<{
            role: string;
            content: string;
            metadata?: Record<string, unknown> | null;
        }>;
    }): Promise<ApiConversation> {
        const response = await axiosClient.post(this.basePath, data);
        return response.data;
    }

    async update(
        id: string,
        data: { title?: string; isPinned?: boolean; tags?: string[] },
    ): Promise<ApiConversation> {
        const response = await axiosClient.put(
            `${this.basePath}/${id}`,
            data,
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await axiosClient.delete(`${this.basePath}/${id}`);
    }

    async addMessage(
        conversationId: string,
        message: {
            role: string;
            content: string;
            metadata?: Record<string, unknown> | null;
        },
    ): Promise<ApiMessage> {
        const response = await axiosClient.post(
            `${this.basePath}/${conversationId}/messages`,
            message,
        );
        return response.data;
    }

    async updateMessage(
        conversationId: string,
        messageId: string,
        data: { content?: string; metadata?: Record<string, unknown> | null },
    ): Promise<ApiMessage> {
        const response = await axiosClient.put(
            `${this.basePath}/${conversationId}/messages/${messageId}`,
            data,
        );
        return response.data;
    }
}

export const conversationRepository = new RestConversationRepository();
export type { ApiConversation, ApiMessage };
