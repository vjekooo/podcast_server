import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm'
import { User } from './User'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
@Entity('podcasts')
export class Podcast extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column()
	url: string

	@ManyToOne((_type) => User, (user) => user.podcasts)
	user: User
}
