import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class InterviewSession extends Model<InterviewSession> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  userId: string;

  @Column(DataType.TEXT)
  transcript: string;

  @Column(DataType.JSON)
  suggestions: object;

  @Column({
    type: DataType.ENUM,
    values: ['behavioral', 'technical', 'mock', 'live'],
    allowNull: false,
  })
  sessionType: string;

  @Column({ allowNull: false })
  startTime: Date;

  @Column
  endTime: Date;

  @Column(DataType.JSON)
  metadata: object;
}
