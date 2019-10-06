import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx } from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { User } from '../entity/User'
import { createAccesToken } from '../auth/auth'
import { MyContext } from '../context'

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
            createAccesToken(user),
            {
                httpOnly: true
            }            
        )

        return {
            accessToken: createAccesToken(user)
        }
    }
}