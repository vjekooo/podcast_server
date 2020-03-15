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
@Entity('friends')
export class Friend extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ unique: true })
    email: string;

    @Column()
    user_id: number;
    @ManyToOne(_type => User, user => user.friends)
    @JoinColumn({ name: "user_id" })
    user: User;
}