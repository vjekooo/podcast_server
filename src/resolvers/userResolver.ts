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

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@Resolver()
export class UserResolver {
    @Query(() => [Setting])
    @UseMiddleware(isAuth)
    async user(
        @Ctx() { payload }: MyContext
    ) {

        const user = await User.findOne(
            payload!.userId,
            { relations: ['settings'] }
        )

        return user?.settings
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ) {

        const hashedPassword = await hash(password, 12)

        try {
            const user = await User.insert({
                email,
                password: hashedPassword
            })
            if (user) {
                const setting = new Setting()
                setting.theme = 'light'
                setting.userId = user.identifiers[0].id

                setting.save()
            }
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