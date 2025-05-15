import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IncomingData, Message } from '../interface/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private ws!: WebSocket;

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private currentChatId: number | null = null;

  connect(senderName: string, receiverName: string): void {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          type: 'init',
          senderName,
          receiverName,
        })
      );
    };

    this.ws.onmessage = (event) => {
      const data: IncomingData = JSON.parse(event.data);

      if (data.type === 'history' && data.messages) {
        this.currentChatId = data.chatId || null;
        this.messagesSubject.next(data.messages);
      } else if (data.type === 'message' && data.message) {
        this.messagesSubject.next([
          ...this.messagesSubject.value,
          data.message,
        ]);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket cerrado');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(content: string, senderName: string): void {
    if (
      !this.ws ||
      this.ws.readyState !== WebSocket.OPEN ||
      !this.currentChatId
    ) {
      console.warn('WebSocket no está conectado o chat no iniciado');
      return;
    }

    const message = {
      type: 'message',
      chatId: this.currentChatId,
      content,
      senderName,
    };

    this.ws.send(JSON.stringify(message));
  }

  closeConnection() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
