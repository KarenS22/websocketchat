import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../service/websockets.service';
import { GroupChatService } from '../service/groupChatService.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  sessionUser = '';
  senderName = '';
  receiverName = '';
  currentUser: string | null = null;

  isGroupChat = false;
  groupIdInput = '';
  currentGroupId: number | null = null;
  groupName = '';

  messages: Array<{
    content: string;
    from: string;
    timestamp: Date;
    seen?: boolean;
  }> = [];

  newMessage = '';

  private messagesSub?: Subscription;

  constructor(
    private chatService: ChatService,
    private groupChatService: GroupChatService
  ) {}

  setChatMode(isGroup: boolean) {
    this.logoutChat();
    this.isGroupChat = isGroup;
  }

  startChat() {
    if (!this.senderName.trim() || !this.receiverName.trim()) return;
    this.currentUser = this.receiverName;
    this.groupName = '';
    this.chatService.connect(this.senderName, this.receiverName);
    this.sessionUser = this.senderName;

    this.messagesSub?.unsubscribe();
    this.messagesSub = this.chatService.messages$.subscribe((msgs) => {
      this.messages = msgs.map((m) => ({
        content: m.content,
        from: m.senderName,
        timestamp: new Date(m.createdAt),
        seen: true,
      }));
    });
  }

  startGroupChat() {
    if (!this.senderName.trim() || !this.groupIdInput.trim()) return;

    this.currentUser = null;
    this.groupName = `Grupo: ${this.groupIdInput}`;
    this.sessionUser = this.senderName;

    this.groupChatService.connect(this.senderName, this.groupIdInput , this.groupName)

    this.messagesSub?.unsubscribe();
    this.messagesSub = this.groupChatService.messages$.subscribe((msgs) => {
      this.messages = msgs.map((m) => ({
        content: m.content,
        from: m.senderName,
        timestamp: new Date(m.createdAt),
      }));
    });
  }

  sendMessage() {
    const content = this.newMessage.trim();
    if (!content) return;

    if (this.isGroupChat) {
      this.groupChatService.sendMessage(content, this.senderName);
    } else {
      this.chatService.sendMessage(content, this.senderName);
    }

    this.newMessage = '';
  }

  logoutChat() {
    this.currentUser = null;
    this.senderName = '';
    this.receiverName = '';
    this.groupIdInput = '';
    this.groupName = '';
    this.messages = [];
    this.newMessage = '';

    this.messagesSub?.unsubscribe();
    this.chatService.closeConnection();
    this.groupChatService.closeConnection();
  }

  ngOnDestroy() {
    this.logoutChat();
  }
}
