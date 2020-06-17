import {Table, Column, Model, BelongsTo, CreatedAt, UpdatedAt} from 'sequelize-typescript';
import {DataTypes} from 'sequelize';

@Table({
  tableName: 'users',
  timestamps: true,
  updatedAt: false
})
export class User extends Model<User> {
 
    @Column({
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "user_id"
    })
    userId: number;

    @Column({
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name"
    })
    firstName: string;

    @Column({
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name"
    })
    lastName: string;

    @Column({
      type: DataTypes.STRING,
      allowNull: false,
      field: "email"
    })
    email: string;

    @Column({
      type: DataTypes.STRING,
      allowNull: false,
      field: "google_sub_id"
    })
    googleSubId: string;

    @Column({
      type: DataTypes.STRING,
      allowNull: false,
      field: "image_url"
    })
    imageUrl: string;

    @CreatedAt
    @Column({ 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW,
        field: "date_created"
    })
    dateCreated: Date;

    @Column({
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "is_admin",
      defaultValue: false
    })
    isAdmin: Date;
}