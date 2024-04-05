import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IFrame, Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  stompClient: any;
  isConnectedWebSocket = false

  constructor() {
    // this.connect()
   }

  connect() {
    const socket = new SockJS('//localhost:8080/ws');

    // Inicjalizuj nowy klient STOMP
    this.stompClient = Stomp.over(socket);

    // Zaktualizuj funkcję fabryczną Websocket w klienta STOMP, aby używała sockjs-client
    this.stompClient.webSocketFactory = () => {
      return new SockJS('//localhost:8080/ws');
    };

    // Opcjonalnie możesz zarejestrować funkcję wywołania zwrotnego na zdarzenie połączenia
    this.stompClient.onConnect = (frame: any) => {
      console.log('Connected to websocket');
      this.isConnectedWebSocket = true
    };

    // Opcjonalnie możesz zarejestrować funkcję wywołania zwrotnego na zdarzenie błędu
    this.stompClient.onStompError = (frame: any) => {
      console.error('STOMP protocol error: ', frame);
    };

    // Połącz się z serwerem WebSocket
    this.stompClient.activate();
  }
}
