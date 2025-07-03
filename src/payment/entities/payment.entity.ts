import {
  AllowNull,
  Column,
  CreatedAt,
  Default,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table
export class Payment extends Model {
  @AllowNull(false)
  @Column
  payment_intent_id: string;

  @AllowNull(false)
  @Column
  user_id: string;

  @AllowNull(false)
  @Column('decimal')
  amount: number;

  @Default('crypto')
  @Column
  method: string;

  @Default('pending')
  @Column
  status: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
