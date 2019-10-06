import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { User } from 'src/entity/User'

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return 'hi'
    }

    @Mutation()
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ) {

        await User.insert({
            email,
            password
        })
        return
    }
}