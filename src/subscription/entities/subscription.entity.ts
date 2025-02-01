import { UUIDV4 } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  Default,
  Model,
  PrimaryKey,
  Table,
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

  @AllowNull(false)
  @Column
  start_date: Date;

  @AllowNull(false)
  @Column
  end_date: Date;

  @Default('active')
  @Column
  status: 'active' | 'inactive';

  @CreatedAt
  created_at: Date;
}
