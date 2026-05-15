/* eslint-disable */

export interface ChatMessage {
    content: string;
    role: "user" | "assistant";
    timestamp: number;
}

export interface backendInterface {
    chat(prompt: string): Promise<string>;
    clearChatHistory(): Promise<void>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getGeminiKey(): Promise<string | null>;
    isGeminiKeyConfigured(): Promise<boolean>;
    saveChatMessage(role: string, content: string): Promise<void>;
    setGeminiKey(key: string): Promise<void>;
}

export class Backend implements backendInterface {
    private baseUrl = '/api';

    async chat(prompt: string): Promise<string> {
        const response = await fetch(`${this.baseUrl}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.content;
    }

    async clearChatHistory(): Promise<void> {
        await fetch(`${this.baseUrl}/history`, { method: 'DELETE' });
    }

    async getChatHistory(): Promise<Array<ChatMessage>> {
        const response = await fetch(`${this.baseUrl}/history`);
        return await response.json();
    }

    async getGeminiKey(): Promise<string | null> {
        return null;
    }

    async isGeminiKeyConfigured(): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/key-configured`);
        const data = await response.json();
        return data.configured;
    }

    async saveChatMessage(role: string, content: string): Promise<void> {
    }

    async setGeminiKey(key: string): Promise<void> {
        await fetch(`${this.baseUrl}/key`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key })
        });
    }
}

export const createActor = () => new Backend();
