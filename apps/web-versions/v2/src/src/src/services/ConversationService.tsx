const STORAGE_KEY = "ai_conversations";
const MAX_CONVERSATIONS = 50;

// Helper function to generate UUID
const uuidv4 = () => crypto.randomUUID();

class ConversationService {
    private static instance: ConversationService;

    static getInstance(): ConversationService {
        if (!ConversationService.instance) {
            ConversationService.instance = new ConversationService();
        }

        return ConversationService.instance;
    }

    getAll(): Conversation[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return [];

            const conversations = JSON.parse(stored);

            return Object.values(conversations).map((conv: unknown) =>
                this.deserializeConversation(conv as Conversation),
            );
        } catch (error) {
            console.error("Failed to load conversations:", error);
            return [];
        }
    }

    getById(id: string): Conversation | null {
        const conversations = this.getAll();
        return conversations.find((conv) => conv.id === id) || null;
    }

    save(conversation: Conversation): void {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const conversations: Record<string, Conversation> = stored
                ? JSON.parse(stored)
                : {};

            conversations[conversation.id] = conversation;

            if (Object.keys(conversations).length > MAX_CONVERSATIONS) {
                this.pruneOldest(conversations);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
        } catch (error) {
            console.error("Failed to save conversation:", error);
            throw new Error("Failed to save conversation");
        }
    }

    delete(id: string): void {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return;

            const conversations: Record<string, Conversation> =
                JSON.parse(stored);
            delete conversations[id];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
        } catch (error) {
            console.error("Failed to delete conversation:", error);
        }
    }

    create(title?: string): Conversation {
        const conversation: Conversation = {
            id: uuidv4(),
            title: title || "New Conversation",
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isPinned: false,
            tags: [],
        };

        this.save(conversation);
        return conversation;
    }

    addMessage(
        conversationId: string,
        message: Omit<Message, "id" | "timestamp">,
    ): Message {
        const conversation = this.getById(conversationId);
        if (!conversation) {
            throw new Error("Conversation not found");
        }

        const newMessage: Message = {
            ...message,
            id: uuidv4(),
            timestamp: new Date(),
        };

        conversation.messages.push(newMessage);
        conversation.updatedAt = new Date();

        if (
            conversation.title === "New Conversation" &&
            conversation.messages.length === 1
        ) {
            conversation.title = this.generateTitle(message.content);
        }

        this.save(conversation);
        return newMessage;
    }

    updateMessage(
        conversationId: string,
        messageId: string,
        updates: Partial<Message>,
    ): void {
        const conversation = this.getById(conversationId);
        if (!conversation) {
            throw new Error("Conversation not found");
        }

        const messageIndex = conversation.messages.findIndex(
            (m) => m.id === messageId,
        );
        if (messageIndex === -1) {
            throw new Error("Message not found");
        }

        conversation.messages[messageIndex] = {
            ...conversation.messages[messageIndex],
            ...updates,
        };
        conversation.updatedAt = new Date();

        this.save(conversation);
    }

    search(query: string): Conversation[] {
        const allConversations = this.getAll();
        const lowerQuery = query.toLowerCase();

        return allConversations.filter(
            (conv) =>
                conv.title.toLowerCase().includes(lowerQuery) ||
                conv.messages.some((msg) =>
                    msg.content.toLowerCase().includes(lowerQuery),
                ) ||
                conv.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
        );
    }

    private generateTitle(firstMessage: string): string {
        const maxLength = 50;
        if (firstMessage.length <= maxLength) {
            return firstMessage;
        }

        return `${firstMessage.substring(0, maxLength)}...`;
    }

    private pruneOldest(conversations: Record<string, Conversation>): void {
        const conversationsArray = Object.values(conversations);

        conversationsArray.sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
        );

        const toKeep = conversationsArray
            .slice(0, MAX_CONVERSATIONS - 10)
            .reduce(
                (acc, conv) => {
                    acc[conv.id] = conv;
                    return acc;
                },
                {} as Record<string, Conversation>,
            );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(toKeep));
    }

    private deserializeConversation(conv: Conversation): Conversation {
        return {
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
            })),
        };
    }

    clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    }
}

export default ConversationService;
