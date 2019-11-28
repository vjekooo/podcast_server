import {
    Resolver,
    Arg,
    Query,
    UseMiddleware
} from 'type-graphql'
import { isAuth } from '../auth/isAuth'
import fetch from 'node-fetch'
import { transform } from 'camaro'
import { PodcastType } from '../types/Fetch'

@Resolver()
export class FetchResolver {
	@Query(() => [PodcastType])
	@UseMiddleware(isAuth)
	async fetchPodcasts(
		@Arg('url') url: string
	) {

		const urls = JSON.parse(url)

		const template = {
			title: '//title',
			description: '//description',
			pubDate: '//pubDate',
			image: '//image/url'
		}

		const podcasts = await Object.keys(urls).map(async (key: string) => {
			const response = await fetch(urls[key])

			const data = await response.text()
	
			const parsed = await transform(data, template)

			parsed.url = urls[key]

			return parsed
		});

		return podcasts
	}

	@Query(() => [PodcastType])
	@UseMiddleware(isAuth)
	async fetchPodcastsEpisodes(
		@Arg('url') url: string
	) {

		const urls = JSON.parse(url)

		const template = {
			title: '//title',
			description: '//description',
			pubDate: '//pubDate',
			image: '//image/url',
			episodes: ['//item', {
				title: 'title',
				description: 'description',
				pubDate: 'pubDate',
				url: 'enclosure/@url',
				duration: 'itunes:duration',
			}]
		}

		const podcasts = await Object.keys(urls).map(async (key: string) => {
			const response = await fetch(urls[key])

			const data = await response.text()
	
			const parsed = await transform(data, template)

			parsed.url = urls[key]

			return parsed
		});

		return podcasts
	}
}