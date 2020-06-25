import { Resolver, Mutation, Arg, Query, UseMiddleware, Ctx, ID } from 'type-graphql'
import { Favorite } from '../entity/Favorite'
import { User } from '../entity/User'
import { isAuth } from '../auth/isAuth'
import { MyContext } from '../context'

@Resolver()
export class FavoriteResolver {
	@Query(() => [Favorite])
	@UseMiddleware(isAuth)
	async favorites(@Ctx() { payload }: MyContext) {
		const user = await User.findOne(payload!.userId, { relations: ['favorites'] })

		if (!user) {
			throw new Error('No user')
		}

		return user.favorites
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async setFavorite(
		@Arg('title') title: string,
		@Arg('description') description: string,
		@Arg('url') url: string,
		@Arg('duration') duration: string,
		@Arg('pubDate') pubDate: string,
		@Arg('image') image: string,
		@Ctx() { payload }: MyContext
	) {
		const user = await User.findOne({ where: { id: payload!.userId } })

		if (!user) {
			throw new Error('No user')
		}

		const favorite = new Favorite()
		favorite.title = title
		favorite.description = description
		favorite.url = url
		favorite.user = user
		favorite.duration = duration
		favorite.pubDate = pubDate
		favorite.image = image

		favorite.save()

		return true
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async removeFavorite(@Arg('id', () => ID) id: number) {
		const result = await Favorite.delete({ id })

		if (result.affected === 0) {
			throw new Error('No episode found')
		}

		return true
	}
}
