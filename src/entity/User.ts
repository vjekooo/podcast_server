import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    AfterInsert
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { Podcast } from './Podcast'
import { Favorite } from './Favorite'
import { Setting } from './Setting'
import { FriendRequest } from './FriendRequest'
import { Friend } from './Friends'
import { History } from './History'

@ObjectType()
@Entity('users')
export class User extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ unique: true })
    @Column()
    @IsEmail({}, { message: 'Incorrect email' })
    @IsNotEmpty({ message: 'The email is required' })
    email: string;

    @Column()
    password: string;

    @Column('int', { default: 0 })
    tokenVersion: number

    @OneToMany(_type => Podcast, podcast => podcast.user)
    podcasts: Podcast[];

    @OneToMany(_type => Favorite, favorite => favorite.user)
    favorites: Favorite[];

    @OneToMany(_type => Setting, setting => setting.user)
    settings: Setting;

    @OneToMany(_type => FriendRequest, requests => requests.user)
    requests: FriendRequest[];

    @OneToMany(_type => Friend, friends => friends.user)
    friends: Friend[];

    @OneToMany(_type => History, history => history.user)
    history: History[];

    @AfterInsert()
    async createSettings(): Promise<void> {
        const setting = new Setting()
        setting.theme = 'light'
        setting.user = this

        setting.save()
    }
}
