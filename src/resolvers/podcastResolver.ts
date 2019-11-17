import {
    Resolver,
    Mutation,
    Arg,
    Query
} from 'type-graphql'
import { Podcast } from '../entity/Podcast'
import { User } from '../entity/User'

@Resolver()
export class PodcastResolver {
    @Query(() => [Podcast])
    async podcasts(
        @Arg('userId') userId: number
    ) {
        const user = await User.findOne(
            userId,
            { relations: ['podcasts'] }
        )

        if (!user) {
            throw new Error('No user')
        }

        return user.podcasts
    }

    @Mutation(() => Boolean)
    async subscribe(
        @Arg('url') url: string,
        @Arg('userId') userId: number
    ) {

        const user = await User.findOne({ where: {id: userId} })

        console.log(user)

        if (!user) return

        const podcast = new Podcast()
        podcast.url = url
        podcast.user = user

        podcast.save()

        return true
    }
}