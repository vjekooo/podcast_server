
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class EpisodeType {
	@Field()
	title: string;
	@Field()
	pubDate: string;
	@Field()
	description: string;
	@Field()
	url: string;
	@Field()
	duration: string;
}

@ObjectType()
export class PodcastType {
	@Field()
	url: string;
	@Field()
	title: string;
	@Field()
	pubDate: string;
	@Field()
	description: string;
	@Field()
	image: string;
	@Field(() => [EpisodeType])
	episodes?: EpisodeType[];
}