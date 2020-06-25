import { Resolver, Arg, Query, UseMiddleware } from 'type-graphql'
import { isAuth } from '../auth/isAuth'
import fetch from 'node-fetch'
import { transform } from 'camaro'
import { PodcastType } from '../types/Fetch'

@Resolver()
export class FetchResolver {
	@Query(() => [PodcastType])
	@UseMiddleware(isAuth)
	async fetchPodcasts(@Arg('urls', (_type) => [String]) urls: string[]) {
		const template = {
			title: '//title',
			description: '//description',
			pubDate: '//pubDate',
			image: '//image/url'
		}

		const podcasts = await urls.map(async (url: string) => {
			const response = await fetch(url)

			const data = await response.text()

			const parsed = await transform(data, template)

			parsed.url = url

			return parsed
		})

		return podcasts
	}

	@Query(() => PodcastType)
	@UseMiddleware(isAuth)
	async fetchPodcastEpisodes(@Arg('url') url: string) {
		const template = {
			title: '//title',
			description: '//description',
			pubDate: '//pubDate',
			image: '//image/url',
			episodes: [
				'//item',
				{
					title: 'title',
					description: 'description',
					pubDate: 'pubDate',
					url: 'enclosure/@url',
					duration: 'itunes:duration'
				}
			]
		}

		const response = await fetch(url)

		const data = await response.text()

		const parsed = await transform(data, template)

		parsed.url = url

		return parsed
	}
}
