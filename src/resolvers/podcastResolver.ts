import { Resolver, Mutation, Arg, Query, UseMiddleware, Ctx } from 'type-graphql'
import { MyContext } from '../context'

import { Podcast } from '../entity/Podcast'
import { User } from '../entity/User'
import { isAuth } from '../auth/isAuth'
import { History } from '../entity/History'

@Resolver()
export class PodcastResolver {
	@Query(() => [Podcast])
	@UseMiddleware(isAuth)
	async podcasts(@Ctx() { payload }: MyContext): Promise<Podcast[]> {
		const user = await User.findOne(payload!.userId, { relations: ['podcasts'] })

		if (!user) {
			throw new Error('No user')
		}

		return user.podcasts
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async subscribe(@Arg('url') url: string, @Ctx() { payload }: MyContext): Promise<Boolean> {
		const user = await User.findOne({ where: { id: payload!.userId } })

		if (!user) {
			throw new Error('No user')
		}

		const podcast = new Podcast()
		podcast.url = url
		podcast.user = user

		podcast.save()

		return true
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async unsubscribe(@Arg('url') url: string): Promise<Boolean> {
		const result = await Podcast.delete({ url: url })

		if (result.affected === 0) {
			throw new Error('No episode found')
		}

		return true
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async setToHistory(
		@Arg('title') title: string,
		@Arg('description') description: string,
		@Arg('url') url: string,
		@Arg('duration') duration: string,
		@Arg('pubDate') pubDate: string,
		@Arg('image') image: string,
		@Ctx() { payload }: MyContext
	): Promise<Boolean> {
		try {
			const user = await User.findOne({ where: { id: payload!.userId } })

			if (!user) {
				throw new Error('No user')
			}

			const history = new History()
			history.title = title
			history.description = description
			history.url = url
			history.duration = duration
			history.pubDate = pubDate
			history.image = image
			history.user = user

			history.save()
		} catch (error) {
			console.log(error)

			return false
		}

		return true
	}

	@Query(() => [History])
	@UseMiddleware(isAuth)
	async fetchHistory(@Ctx() { payload }: MyContext): Promise<Podcast[]> {
		const user = await User.findOne(payload!.userId, { relations: ['history'] })

		if (!user) {
			throw new Error('No user')
		}

		return user.history
	}
}
