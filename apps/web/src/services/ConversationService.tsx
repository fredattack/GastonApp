import {
    conversationRepository,
    type ApiConversation,
    type ApiMessage,
} from "../repository/RestConversationRepository";

const LEGACY_STORAGE_KEY = "ai_conversations";

class ConversationService {
    private static instance: ConversationService;
    private cache: Conversation[] = [];
    private loaded = false;

    static getInstance(): ConversationService {
        if (!ConversationService.instance) {
            ConversationService.instance = new ConversationService();
        }

        return ConversationService.instance;
    }

    async getAll(): Promise<Conversation[]> {
        if (this.loaded) return this.cache;

        await this.migrateFromLocalStorage();

        try {
            const apiConversations = await conversationRepository.getAll();
            this.cache = apiConversations.map(this.fromApi);
            this.loaded = true;
            return this.cache;
        } catch (error) {
            console.error("Failed to load conversations:", error);
            return [];
        }
    }

    async getById(id: string): Promise<Conversation | null> {
        const conversations = await this.getAll();
        return conversations.find((conv) => conv.id === id) || null;
    }

    async create(title?: string): Promise<Conversation> {
        const apiConv = await conversationRepository.create({
            title: title || "Nouvelle conversation",
        });

        const conversation = this.fromApi(apiConv);
        this.cache = [conversation, ...this.cache];
        return conversation;
    }

    async delete(id: string): Promise<void> {
        await conversationRepository.delete(id);
        this.cache = this.cache.filter((c) => c.id !== id);
    }

    async addMessage(
        conversationId: string,
        message: Omit<Message, "id" | "timestamp">,
    ): Promise<Message> {
        const apiMessage = await conversationRepository.addMessage(
            conversationId,
            {
                role: message.role,
                content: message.content,
                metadata:
                    (message.metadata as Record<string, unknown>) || null,
            },
        );

        const newMessage = this.messageFromApi(apiMessage);

        // Update cache
        this.cache = this.cache.map((c) => {
            if (c.id !== conversationId) return c;

            const updated = {
                ...c,
                messages: [...c.messages, newMessage],
                updatedAt: new Date(),
            };

            // Auto-title on first user message
            if (
                updated.title === "Nouvelle conversation" &&
                updated.messages.length === 1
            ) {
                const autoTitle = this.generateTitle(message.content);
                updated.title = autoTitle;
                conversationRepository
                    .update(conversationId, { title: autoTitle })
                    .catch(() => {});
            }

            return updated;
        });

        return newMessage;
    }

    async updateMessage(
        conversationId: string,
        messageId: string,
        updates: Partial<Message>,
    ): Promise<void> {
        const updateData: Record<string, unknown> = {};
        if (updates.content !== undefined) updateData.content = updates.content;
        if (updates.metadata !== undefined)
            updateData.metadata = updates.metadata;

        if (Object.keys(updateData).length > 0) {
            await conversationRepository.updateMessage(
                conversationId,
                messageId,
                updateData as { content?: string; metadata?: Record<string, unknown> | null },
            );
        }

        // Update cache
        this.cache = this.cache.map((c) => {
            if (c.id !== conversationId) return c;
            return {
                ...c,
                messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, ...updates } : m,
                ),
                updatedAt: new Date(),
            };
        });
    }

    async updateConversation(
        id: string,
        data: { title?: string; isPinned?: boolean; tags?: string[] },
    ): Promise<void> {
        await conversationRepository.update(id, data);

        this.cache = this.cache.map((c) => {
            if (c.id !== id) return c;
            return {
                ...c,
                ...(data.title !== undefined && { title: data.title }),
                ...(data.isPinned !== undefined && {
                    isPinned: data.isPinned,
                }),
                ...(data.tags !== undefined && { tags: data.tags }),
                updatedAt: new Date(),
            };
        });
    }

    search(query: string): Conversation[] {
        const lowerQuery = query.toLowerCase();

        return this.cache.filter(
            (conv) =>
                conv.title.toLowerCase().includes(lowerQuery) ||
                conv.messages.some((msg) =>
                    msg.content.toLowerCase().includes(lowerQuery),
                ) ||
                conv.tags.some((tag) =>
                    tag.toLowerCase().includes(lowerQuery),
                ),
        );
    }

    invalidateCache(): void {
        this.loaded = false;
        this.cache = [];
    }

    // --- Migration from localStorage ---

    private async migrateFromLocalStorage(): Promise<void> {
        try {
            const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
            if (!stored) return;

            const legacyConversations: Record<string, Conversation> =
                JSON.parse(stored);
            const entries = Object.values(legacyConversations);

            if (entries.length === 0) {
                localStorage.removeItem(LEGACY_STORAGE_KEY);
                return;
            }

            for (const conv of entries) {
                try {
                    await conversationRepository.create({
                        title: conv.title || "Conversation importée",
                        messages: conv.messages.map((msg) => ({
                            role: msg.role,
                            content: msg.content,
                            metadata:
                                (msg.metadata as Record<string, unknown>) ||
                                null,
                        })),
                    });
                } catch {
                    // Skip conversations that fail to migrate
                }
            }

            localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch {
            // Don't block app if migration fails
        }
    }

    // --- Mapping ---

    private fromApi = (apiConv: ApiConversation): Conversation => {
        return {
            id: apiConv.id,
            title: apiConv.title,
            isPinned: apiConv.isPinned,
            tags: apiConv.tags || [],
            createdAt: new Date(apiConv.createdAt),
            updatedAt: new Date(apiConv.updatedAt),
            messages: (apiConv.messages || []).map(this.messageFromApi),
        };
    };

    private messageFromApi = (apiMsg: ApiMessage): Message => {
        return {
            id: apiMsg.id,
            role: apiMsg.role,
            content: apiMsg.content,
            metadata: apiMsg.metadata as Message["metadata"],
            timestamp: new Date(apiMsg.timestamp),
        };
    };

    private generateTitle(firstMessage: string): string {
        const maxLength = 50;
        if (firstMessage.length <= maxLength) {
            return firstMessage;
        }
        return `${firstMessage.substring(0, maxLength)}...`;
    }
}

export default ConversationService;
