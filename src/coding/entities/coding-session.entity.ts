import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class CodingSession extends Model<CodingSession> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  userId: string;

  @Column({ allowNull: false })
  problemId: string;

  @Column(DataType.TEXT)
  code: string;

  @Column(DataType.JSON)
  screenshots: string[];

  @Column({
    type: DataType.ENUM,
    values: ['in-progress', 'completed', 'evaluated'],
    defaultValue: 'in-progress'
  })
  status: string;

  @Column(DataType.JSON)
  evaluation: object;

  @Column(DataType.TEXT)
  feedback: string;

  @Column
  startTime: Date;

  @Column
  endTime: Date;

  @Column(DataType.FLOAT)
  score: number;
}
