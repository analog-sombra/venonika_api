import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DiscordScheduledEvent } from './entities/event.entity';
import { EventService } from './event.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly eventService: EventService) {}

  // Triggered when a client connects
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('welcome', { message: 'Welcome to the WebSocket server!' });
  }

  // Triggered when a client disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Custom event listener for client messages
  @SubscribeMessage('updateEvent')
  handleMessage(@MessageBody() data: DiscordScheduledEvent): void {
    this.eventService.updateEventGateway(data);
  }

  // Broadcast a message to all connected clients
  broadcastToAll(message: string) {
    this.server.emit('serverMessage', { message });
  }
}
