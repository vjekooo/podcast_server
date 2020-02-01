import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne
} from 'typeorm'
import { User } from './User'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity('favorites')
export class Favorite extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column()
    url: string;

    @Field()
    @Column()
    duration: string;

    @Field()
    @Column()
    pubDate: string;

    @Field()
    @Column()
    image: string;

    @ManyToOne(_type => User, user => user.favorites)
    user: User;
}