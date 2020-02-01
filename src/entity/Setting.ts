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
@Entity('settings')
export class Setting extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ default: 'light' })
    theme: string;

    @ManyToOne(_type => User, user => user.settings)
    user: User;
}