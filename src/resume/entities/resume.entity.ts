import { AllowNull, Column, Default, Model, Table } from 'sequelize-typescript';

@Table
export class Resume extends Model<Resume> {
  @AllowNull(false)
  @Column
  file_type: string;

  @AllowNull(false)
  @Column
  user_id: string;

  @AllowNull(false)
  @Column
  file_path: string;

  @Default('pending')
  @Column
  status: string;

  @Column
  uploaded_at: Date;
}
