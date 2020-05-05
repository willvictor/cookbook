import {Table, Column, Model, BelongsTo, CreatedAt, UpdatedAt, ForeignKey} from 'sequelize-typescript';
import {DataTypes} from 'sequelize';
import {User} from './User';

@Table({
    tableName: 'recipes',
    timestamps: true
})
export class Recipe extends Model<Recipe> {
 
    @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "recipe_id"
    })
    recipeId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "creator_id"
    })
    creatorId: number;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        field: "name"
    })
    name: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        field: "ingredients"
    })
    ingredients: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        field: "directions"
    })
    directions: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: true,
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

    @UpdatedAt
    @Column({ 
        type: DataTypes.DATE, 
        allowNull: true,
        field: "date_updated"
    })
    dateUpdated: Date;
 

    @BelongsTo(() => User)
    creator: User;
}
