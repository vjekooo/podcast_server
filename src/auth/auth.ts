
import { sign } from 'jsonwebtoken'
import { User } from "../entity/User"

export const createAccesToken = (user: User): string => {
    return (
        sign(
            {
            userId: user.id},
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '15min' }
        )
    )
}

export const createRefreshAccesToken = (user: User): string => {
    return (
        sign(
            {
                userId: user.id,
                tokenVersion: user.tokenVersion
            },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '7d' }
        )
    )
}