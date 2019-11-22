import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne
} from "typeorm";
import { User } from './User'
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity('favorites')
export class Favorite extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    url: string;

    @ManyToOne(_type => User, user => user.favorites)
    user: User;
}