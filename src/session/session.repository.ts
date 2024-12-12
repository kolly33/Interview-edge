import { Injectable } from '@nestjs/common';
import { Interview } from '../interview/entities/interview.entity';
import { InjectModel } from '@nestjs/sequelize';


@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Interview)
    private readonly interviewModel: typeof Interview,
  ) {}

  // Create a new session
  async createSession(user_id: string): Promise<Interview> {
    const session = await this.interviewModel.create({
      session_id: this.generateSessionId(),
      user_id,
    });
    return session;
  }

  // Find a session by session ID
  async findBySessionId(session_id: string): Promise<Interview | null> {
    return await this.interviewModel.findOne({ where: { session_id } });
  }

  // Update transcript or suggestions for a session
  async updateSessionData(
    session_id: string,
    updates: Partial<Interview>,
  ): Promise<Interview> {
    const session = await this.findBySessionId(session_id);
    if (!session) throw new Error('Session not found');
    Object.assign(session, updates);
    return session;
  }

  // Fetch all sessions for a user
  async getUserSessions(user_id: string): Promise<Interview[]> {
    return await this.interviewModel.findAll({
      where: { user_id },
      order: [['createded_at', 'DESC']],
    });
  }

  // Generate a unique session ID
  private generateSessionId() {
    const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';

  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
  }
   
}
