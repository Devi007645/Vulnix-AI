import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChatMessage {
    content: string;
    role: string;
    timestamp: bigint;
}
export interface backendInterface {
    chat(prompt: string): Promise<string>;
    clearChatHistory(): Promise<void>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getOpenAIKey(): Promise<string | null>;
    isOpenAIKeyConfigured(): Promise<boolean>;
    saveChatMessage(role: string, content: string): Promise<void>;
    setOpenAIKey(key: string): Promise<void>;
}
