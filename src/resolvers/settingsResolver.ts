import {
    Resolver,
    Mutation,
    UseMiddleware,
    Ctx,
    Arg
} from 'type-graphql'
import { User } from '../entity/User'
import { isAuth } from '../auth/isAuth'
import { MyContext } from '../context'
import { Setting } from '../entity/Setting'

@Resolver()
export class SettingsResolver {
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async setTheme(
        @Arg('theme') theme: string,
        @Ctx() { payload }: MyContext
    ): Promise<boolean | string> {

        console.log(theme)

        const user = await User.findOne(
            payload!.userId,
            { relations: ['settings'] }
        )

        if (!user) {
            throw new Error('This is not the user you are looking for')
        }

        let themeToUpdate = await Setting.findOne({ where: { userId: payload?.userId }})

        const newTheme = themeToUpdate?.theme === 'light'
            ? 'dark'
            : 'light'

        if (!themeToUpdate) {
            throw new Error('No such thing here')
        }

        try {
            themeToUpdate.theme = newTheme
    
            await Setting.save(themeToUpdate)

            return newTheme
        } catch (error) {
           console.log(error)
           return false
        }
    }
}