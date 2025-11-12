
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: Role;
  text: string;
  id: string;
  file?: {
    url: string; // data URL for display
    type: string; // MIME type
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}
