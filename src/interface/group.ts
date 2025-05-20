export interface GroupMessage {
  id: number;
  content: string;
  createdAt: Date | string;
  senderName: string;
  groupId: number;
}

export interface IncomingGroupData {
  type: string;
  messages?: GroupMessage[];
  message?: GroupMessage;
  groupId?: number;
}
