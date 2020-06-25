import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './User'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity('history')
export class History extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column()
	title: string

	@Field()
	@Column()
	description: string

	@Field()
	@Column()
	url: string

	@Field()
	@Column()
	duration: string

	@Field()
	@Column()
	pubDate: string

	@Field()
	@Column()
	image: string

	@Column()
	userId: number
	@ManyToOne((_type) => User, (user) => user.history)
	@JoinColumn({ name: 'userId' })
	user: User
}
