import { MiddlewareFn } from "type-graphql"
import { MyContext } from "../context"
import { verify } from "jsonwebtoken"

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const auth = context.req.headers['authorization']

    if (!auth) {
        throw new Error('No unauthorized personnel')
    }

    try {
        const token = auth.split(' ')[1]
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)

        context.payload = payload as any

    } catch (error) {
        console.log(error)
        throw new Error('No unauthorized personnel')
    }

    return next()
}