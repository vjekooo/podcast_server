import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './User'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity('friend_requests')
export class FriendRequest extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column()
	requestor: string

	@Field()
	@Column()
	requestee: string

	@Column()
	user_id: number
	@ManyToOne((_type) => User, (user) => user.requests)
	@JoinColumn({ name: 'user_id' })
	user: User

	@Column()
	friend_id: number
	@ManyToOne((_type) => User, (user) => user.requests)
	@JoinColumn({ name: 'friend_id' })
	friend: User
}
