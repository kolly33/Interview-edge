import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class InterviewGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private sessions: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    const sessionId = client.handshake.query.sessionId as string;
    if (sessionId) {
      this.sessions.set(sessionId, client);
    }
  }

  handleDisconnect(client: Socket) {
    const sessionId = client.handshake.query.sessionId as string;
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }

  sendSuggestions(sessionId: string, suggestions: any) {
    const client = this.sessions.get(sessionId);
    if (client) {
      client.emit('suggestions', suggestions);
    }
  }

  @SubscribeMessage('transcription')
  handleTranscription(client: Socket, payload: any) {
    const { sessionId, transcript } = payload;
    this.server.to(sessionId).emit('transcriptionUpdate', transcript);
  }
}
