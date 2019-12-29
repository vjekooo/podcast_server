import "reflect-metadata";
import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import { createConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";

import { parseCookie } from './parseCookie'
import { createAccesToken, createRefreshAccesToken } from "./auth/auth";
import { PodcastResolver } from "./resolvers/podcastResolver";
import { FavoriteResolver } from "./resolvers/favoriteResolver";
import { FetchResolver } from "./resolvers/fetchResolver";

(async () => {
    const app = express()

    app.use(cors({
        origin: ['http://localhost', 'http://localhost:3000'],
        credentials: true
    }))

    app.get('/', (_req, res) => res.send('hello'))

    app.post('/refresh_token', async (req, res) => {

        const falseObject = {
            ok: false,
            accessToken: ''
        }
       
        if (!req.headers.cookie) {
            return
        }

        const token = parseCookie(req.headers.cookie).podcast

        if (!token) {
            return (
                res.send(falseObject)
            )
        }

        let payload: any = null;

        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
        } catch (error) {
            console.log(error)
            return (
                res.send(falseObject)
            )
        }

        const user = await User.findOne({ id: payload.userId })

        if (!user) {
            return (
                res.send(falseObject)
            )
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return (
                res.send(falseObject)
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
            resolvers: [
                UserResolver,
                PodcastResolver,
                FavoriteResolver,
                FetchResolver
            ]
        }),
        context: ({ req, res }) => ({ req, res })
    })

    apolloServer.applyMiddleware({ app, cors: false })

    app.listen(4000, () => {
        console.log('Server started on 4000')
    })
})()
