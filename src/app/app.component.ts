import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../service/websockets.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  sessionUser = '';
  senderName = '';
  receiverName = '';
  currentUser: string | null = null;

  messages: Array<{
    content: string;
    from: string;
    timestamp: Date;
    seen?: boolean;
  }> = [];

  newMessage = '';

  private messagesSub?: Subscription;

  constructor(private chatService: ChatService) {}

  startChat() {
    if (!this.senderName.trim() || !this.receiverName.trim()) return;
    this.currentUser = this.receiverName;
    this.chatService.connect(this.senderName, this.receiverName);
    this.sessionUser = this.senderName;
    this.messagesSub = this.chatService.messages$.subscribe((msgs) => {
      this.messages = msgs.map((m) => ({
        content: m.content,
        from: m.senderName,
        timestamp: new Date(m.createdAt),
        seen: true,
      }));
    });
  }

  sendMessage() {
    const content = this.newMessage.trim();
    if (!content) return;

    this.chatService.sendMessage(content, this.senderName);

    this.newMessage = '';
  }

  logoutChat() {
    this.currentUser = null;
    this.senderName = '';
    this.receiverName = '';
    this.messages = [];
    this.newMessage = '';

    this.messagesSub?.unsubscribe();
    this.chatService.closeConnection();
  }

  ngOnDestroy() {
    this.messagesSub?.unsubscribe();
    this.chatService.closeConnection();
  }
}
