import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'clienteAngular';
  sessionUser: string = 'usuarioQuemado';

  // Para buscar usuario
  searchUser: string = '';
  currentUser: string | null = null;

  newMessage: string = '';

  // Cambiamos de sender → from
  messages = [
  {
    content: 'Hola, ¿cómo estás?',
    from: 'juan',
    to: 'usuarioQuemado',
    timestamp: new Date('2025-05-14T10:15:00'),
    seen: true,
  },
  {
    content: 'Hola Juan, todo bien. ¿Y tú?',
    from: 'usuarioQuemado',
    to: 'juan',
    timestamp: new Date('2025-05-14T10:16:00'),
    seen: true,
  },
  {
    content: 'Bien, gracias. ¿Quieres juntarnos más tarde?',
    from: 'juan',
    to: 'usuarioQuemado',
    timestamp: new Date('2025-05-14T10:17:00'),
    seen: false,
  },
  {
    content: 'Claro, me parece perfecto.',
    from: 'usuarioQuemado',
    to: 'juan',
    timestamp: new Date('2025-05-14T10:18:00'),
    seen: false,
  },
  {
    content: '¿Qué tal tu día?',
    from: 'maria',
    to: 'usuarioQuemado',
    timestamp: new Date('2025-05-14T09:00:00'),
    seen: true,
  },
];

  searchForUser() {
    if (this.searchUser.trim()) {
      this.currentUser = this.searchUser.trim();
    }
  }

  logoutChat() {
    this.currentUser = null;
    this.newMessage = '';
    this.messages = [];
  }

  sendMessage() {
    if (this.newMessage.trim() && this.currentUser) {
      this.messages.push({
        content: this.newMessage.trim(),
        from: this.sessionUser,
        to: this.currentUser,
        timestamp: new Date(),
        seen: false,
      });
      this.newMessage = '';
      // Simula respuesta automática
      setTimeout(() => {
        this.messages.push({
          content: 'Respuesta automática',
          from: this.currentUser!,
          to: this.sessionUser,
          timestamp: new Date(),
          seen: true,
        });
      }, 1500);
    }
  }

}

export interface Message {
  content: string;
  sender: 'me' | 'other';
  timestamp: Date;
}
