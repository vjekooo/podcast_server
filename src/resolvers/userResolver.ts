import {
    Resolver,
    Query,
    Mutation,
    Arg,
    ObjectType,
    Field,
    Ctx,
    UseMiddleware
} from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { User } from '../entity/User'
import { createAccesToken, createRefreshAccesToken } from '../auth/auth'
import { MyContext } from '../context'
import { isAuth } from '../auth/isAuth'
import { verify } from 'jsonwebtoken'
import { Setting } from '../entity/Setting'
import { getConnection } from 'typeorm'

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@Resolver()
export class UserResolver {
    @Query(() => User)
    @UseMiddleware(isAuth)
    async userProfile(
        @Ctx() { payload }: MyContext
    ) {

        const user = await User.findOne(payload!.userId)

        return user
    }

    @Query(() => [Setting])
    @UseMiddleware(isAuth)
    async userSettings(
        @Ctx() { payload }: MyContext
    ) {

        const user = await User.findOne(
            payload!.userId,
            { relations: ['settings'] }
        )

        return user?.settings
    }

    @Query(() => [User])
    @UseMiddleware(isAuth)
    async fetchUsers(
        @Arg('searchTerm') searchTerm: string,
        @Ctx() { payload }: MyContext
    ): Promise<User[]> {

        const users = await getConnection()
            .getRepository(User)
            .createQueryBuilder()
            .select()
            .where('email ILIKE :searchTerm', {searchTerm: `%${searchTerm}%`})
            .andWhere('id NOT IN (:id)', {id: payload?.userId})
            .getMany()

        return users
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ) {

        const hashedPassword = await hash(password, 12)

        try {
            const user = User.create({
                email,
                password: hashedPassword
            })

            await user.save()
        } catch (error) {
            console.log(error)
            return false
        }

        return true
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: MyContext
    ): Promise<LoginResponse> {

        const user = await User.findOne({ where: {email} })

        if (!user) {
            throw new Error('Invalid user')
        }

        const validPassword = await compare(password, user.password)

        if (!validPassword) {
            throw new Error('Invalid password')
        }

        res.cookie(
            'podcast',
            createRefreshAccesToken(user),
            {
                httpOnly: true
            }            
        )

        return {
            accessToken: createAccesToken(user)
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async logout(
        @Arg('token') token: string,
        @Ctx() { res }: MyContext
    ) {

        const decoded: any = verify(token, process.env.ACCESS_TOKEN_SECRET!)

        if (!decoded) {
            throw new Error('No token')
        }

        const id = decoded.userId

        const user = await User.findOne({ where: { id }})

        if (!user) {
            throw new Error('No user')
        }

        res.clearCookie('podcast')

        return true
    }
}