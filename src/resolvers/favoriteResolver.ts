import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx
} from 'type-graphql'
import { Favorite } from '../entity/Favorite'
import { User } from '../entity/User'
import { isAuth } from '../auth/isAuth'
import { MyContext } from '../context'

@Resolver()
export class FavoriteResolver {
    @Query(() => [Favorite])
    @UseMiddleware(isAuth)
    async favorites(
        @Ctx() { payload }: MyContext
    ) {
        const user = await User.findOne(
            payload!.userId,
            { relations: ['favorites'] }
        )

        if (!user) {
            throw new Error('No user')
        }

        return user.favorites
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async setFavorite(
        @Arg('title') title: string,
        @Arg('url') url: string,
        @Ctx() { payload }: MyContext
    ) {

        const user = await User.findOne({ where: {id: payload!.userId} })

        if (!user) {
            throw new Error('No user')
        }

        const favorite = new Favorite()
        favorite.title = title
        favorite.url = url
        favorite.user = user

        favorite.save()

        return true
    }
}