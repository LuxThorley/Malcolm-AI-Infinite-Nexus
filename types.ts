
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
  error?: boolean;
  actionCard?: {
    type: string;
    title: string;
    data: Record<string, string>;
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

export interface CommandAction {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  action: () => void;
  section: 'Actions' | 'Navigation' | 'Suggestions';
}
