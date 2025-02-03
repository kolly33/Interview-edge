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
export class Subscription extends Model<Subscription> {
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  user_id: string;

  @AllowNull(false)
  @Column
  plan_id: string;

  @Default(new Date())
  @Column
  start_date: Date;

  @Default(new Date())
  @Column
  end_date: Date;

  @Default('inactive')
  @Column
  status: 'active' | 'inactive';

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
