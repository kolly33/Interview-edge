import { UUIDV4 } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table
export class Payment extends Model {
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  payment_intent_id: string;

  @AllowNull(false)
  @Column
  user_id: string;

  @AllowNull(false)
  @Column
  plan_id: string;

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
