import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware } from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { User } from '../entity/User'
import { createAccesToken, createRefreshAccesToken } from '../auth/auth'
import { MyContext } from '../context'
import { isAuth } from '../auth/isAuth'

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return 'hi'
    }

    @Query(() => [User])
    users() {
        return User.find()
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    seeYa(
        @Ctx() { payload }: MyContext
    ) {
        return `See ya number ${payload!.userId}`
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ) {

        const hashedPassword = await hash(password, 12)

        try {
            await User.insert({
                email,
                password: hashedPassword
            })
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
}