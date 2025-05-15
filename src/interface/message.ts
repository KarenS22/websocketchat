export interface Message {
  id: number;
  content: string;
  createdAt: Date | string;
  senderName: string;
  chatId: number;
}

export type WSMessage = InitMessage | HistoryMessage | ChatMessage;

interface InitMessage {
  type: 'init';
  senderName: string;
  receiverName: string;
}

interface HistoryMessage {
  type: 'history';
  chatId: number;
  messages: Message[];
}

interface ChatMessage {
  type: 'message';
  message: Message;
}

interface SendInitMessage {
  type: 'init';
  senderName: string;
  receiverName: string;
}

interface SendChatMessage {
  type: 'message';
  chatId: number;
  content: string;
  senderName: string;
}


export interface IncomingData {
  type: string;
  messages?: Message[];
  message?: Message;
  chatId?: number;
}