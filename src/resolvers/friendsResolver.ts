import {
    Resolver,
    Mutation,
    UseMiddleware,
    Arg,
    Query,
    Ctx
} from 'type-graphql'
import { getConnection } from 'typeorm'

import { isAuth } from '../auth/isAuth'
import { MyContext } from '../context'

import { User } from '../entity/User'
import { FriendRequest } from '../entity/FriendRequest'
import { Friend } from '../entity/Friends'

@Resolver()
export class FriendsResolver {
    @Query(() => [FriendRequest])
    @UseMiddleware(isAuth)
    async fetchRequestee(
        @Ctx() { payload }: MyContext
    ): Promise<FriendRequest[]> {

        const requests = await getConnection()
            .getRepository(User)
            .createQueryBuilder("users")
            .leftJoinAndSelect("users.requests", "requests")
            .where("users.id = :id", { id: payload?.userId })
            .getOne()

        if (!requests) {
            return []
        }

        return requests.requests
    }

    @Query(() => [FriendRequest])
    @UseMiddleware(isAuth)
    async fetchRequestor(
        @Ctx() { payload }: MyContext
    ): Promise<FriendRequest[]> {

        const requests = await getConnection()
            .getRepository(User)
            .createQueryBuilder("users")
            .leftJoinAndSelect("users.requests", "requests")
            .where("requests.friend_id = :friend_id", { friend_id: payload?.userId })
            .getOne()

        if (!requests) {
            return []
        }

        return requests.requests
    }

    @Query(() => [Friend])
    @UseMiddleware(isAuth)
    async fetchFriends(
        @Ctx() { payload }: MyContext
    ): Promise<Friend[]> {

        const user = await User.findOne(payload?.userId, {
            relations: ['friends']
        })

        if (!user) {
            throw new Error('Noope')
        }

        return user?.friends

    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async requestFriend(
        @Arg('friend') friend: string,
        @Ctx() { payload }: MyContext
    ): Promise<boolean> {

        try {

            const user = await User.findOne(payload?.userId)

            const target = await User.findOne({where : { email: friend}})

            if (!user) {
                throw new Error('No such user')
            }

            if (!target) {
                throw new Error('No such friend')
            }

            const request = new FriendRequest()

            request.requestor = user.email
            request.requestee = target.email
            request.user = user
            request.friend = target

            request.save()

        } catch (error) {
            console.log(error)
            return false
        }

        return true
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async handleRequest(
        @Arg('id') id: number,
        @Arg('email') email: string,
        @Arg('state') state: string,
        @Ctx() { payload }: MyContext
    ) {
        if (state === 'accept') {
            const user = await User.findOne(payload?.userId)

            if (!user) {
                throw new Error('Oooops no user')
            }

            const friend = new Friend()
            friend.email = email
            friend.user = user

            friend.save()

            await FriendRequest.delete({ id: id })
        } else {
            const result = await FriendRequest.delete({ id: id })

            if (result.affected === 0) {
                throw new Error('No request found')
            }
        }
        return true
    }
}