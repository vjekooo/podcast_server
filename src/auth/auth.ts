
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

export const refreshAccesToken = (user: User): string => {
    return (
        sign(
            {
            userId: user.id},
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '1min' }
        )
    )
}