import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IncomingGroupData, GroupMessage } from '../interface/group';

@Injectable({
  providedIn: 'root',
})
export class GroupChatService {
  private ws!: WebSocket;

  private messagesSubject = new BehaviorSubject<GroupMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private currentGroupId: number | null = null;

  connect(senderName: string, groupId: number): void {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          type: 'init-group',
          senderName,
          groupId,
        })
      );
    };

    this.ws.onmessage = (event) => {
      const data: IncomingGroupData = JSON.parse(event.data);

      if (data.type === 'history-group' && data.messages) {
        this.currentGroupId = data.groupId || null;
        this.messagesSubject.next(data.messages);
      } else if (data.type === 'group-message' && data.message) {
        this.messagesSubject.next([
          ...this.messagesSubject.value,
          data.message,
        ]);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket grupo cerrado');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error grupo:', error);
    };
  }

  sendMessage(content: string, senderName: string): void {
    if (
      !this.ws ||
      this.ws.readyState !== WebSocket.OPEN ||
      !this.currentGroupId
    ) {
      console.warn('WebSocket no está conectado o grupo no iniciado');
      return;
    }

    const message = {
      type: 'group-message',
      groupId: this.currentGroupId,
      content,
      senderName,
    };

    this.ws.send(JSON.stringify(message));
  }

  closeConnection(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}
