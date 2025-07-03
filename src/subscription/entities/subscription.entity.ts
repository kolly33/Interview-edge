import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Subscription extends Model<Subscription> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  userId: string;

  @Column({
    type: DataType.ENUM,
    values: ['starter', 'professional', 'power-user', 'enterprise', 'pay-as-you-go'],
    allowNull: false
  })
  plan: string;

  @Column({ allowNull: false })
  stripeCustomerId: string;

  @Column({ allowNull: false })
  stripeSubscriptionId: string;

  @Column({
    type: DataType.ENUM,
    values: ['active', 'cancelled', 'expired'],
    defaultValue: 'active'
  })
  status: string;

  @Column({ allowNull: false })
  startDate: Date;

  @Column
  endDate: Date;

  @Column(DataType.JSON)
  usage: {
    interviewSessions: number;
    codingSessions: number;
    tokensUsed: number;
  };

  @Column(DataType.JSON)
  limits: {
    maxInterviewSessions: number;
    maxCodingSessions: number;
    maxTokensPerSession: number;
  };
}
