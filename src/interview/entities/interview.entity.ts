import {
  AllowNull,
  Column,
  Model,
  Table,
  PrimaryKey,
} from 'sequelize-typescript';

@Table
export class Interview extends Model<Interview> {
  @AllowNull(false)
  @PrimaryKey
  @Column
  session_id: string;

  @AllowNull(false)
  @Column
  user_id: string;

  @AllowNull(false)
  @Column
  transcript: string;

  @Column
  suggestions: string;

  @Column
  createded_at: Date;
}
