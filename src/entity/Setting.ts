import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn
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

    @Column()
    userId: number;
    @ManyToOne(_type => User, user => user.settings)
    @JoinColumn({ name: "userId" })
    user: User;
}