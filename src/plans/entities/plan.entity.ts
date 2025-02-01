import { UUIDV4 } from 'sequelize';
import {
  Column,
  CreatedAt,
  Default,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript';

export class Plan extends Model<Plan> {
  @Default(UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  price: number;

  @Column
  duration_in_days: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
