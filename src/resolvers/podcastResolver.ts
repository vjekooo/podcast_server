import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx
} from 'type-graphql'
import { Podcast } from '../entity/Podcast'
import { User } from '../entity/User'
import { isAuth } from '../auth/isAuth'
import { MyContext } from '../context'

@Resolver()
export class PodcastResolver {
    @Query(() => [Podcast])
    @UseMiddleware(isAuth)
    async podcasts(
        @Ctx() { payload }: MyContext
    ) {
        const user = await User.findOne(
            payload!.userId,
            { relations: ['podcasts'] }
        )

        if (!user) {
            throw new Error('No user')
        }

        return user.podcasts
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async subscribe(
        @Arg('url') url: string,
        @Ctx() { payload }: MyContext
    ) {

        const user = await User.findOne({ where: {id: payload!.userId} })

        if (!user) {
            throw new Error('No user')
        }

        const podcast = new Podcast()
        podcast.url = url
        podcast.user = user

        podcast.save()

        return true
    }
}