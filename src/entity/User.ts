import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

import { Podcast } from './Podcast'

@ObjectType()
@Entity('users')
export class User extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;

    @Column()
    password: string;

    @Column('int', { default: 0 })
    tokenVersion: number

    @OneToMany(_type => Podcast, podcast => podcast.user)
    podcasts: Podcast[];
}
