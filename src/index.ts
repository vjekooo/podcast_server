import "reflect-metadata";
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import { createConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";

import { parseCookie } from './parseCookie'
import { createAccesToken, createRefreshAccesToken } from "./auth/auth";

(async () => {
    const app = express()

    app.get('/', (_req, res) => res.send('hello'))

    app.post('/refresh_token', async (req, res) => {
       
        if (!req.headers.cookie) {
            return
        }

        const token = parseCookie(req.headers.cookie).podcast

        if (!token) {
            return (
                res.send({
                    ok: false,
                    accessToken: ''
                })
            )
        }

        let payload: any = null;

        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
        } catch (error) {
            console.log(error)
            return (
                res.send({
                    ok: false,
                    accessToken: ''
                })
            )
        }

        const user = await User.findOne({ id: payload.userId })

        if (!user) {
            return (
                res.send({
                    ok: false,
                    accessToken: ''
                })
            )
        }

        res.cookie(
            'podcast',
            createRefreshAccesToken(user),
            {
                httpOnly: true
            }            
        )

        return (
            res.send({
                ok: true,
                accessToken: createAccesToken(user)
            })
        )
    })

    await createConnection()

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    })

    apolloServer.applyMiddleware({ app })


    app.listen(4000, () => {
        console.log('Server started on 4000')
    })
})()
