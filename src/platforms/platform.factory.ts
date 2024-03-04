import { DiProcess } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';

export class PlatformFactory {
	private static supportedPlatforms = {
		bingebot: import(/* webpackChunkName: "bingebot" */ './bingebot/bingebot-platform'),
		f2: import(/* webpackChunkName: "f2" */ './f2/f2-platform'),
		comicvine: import(
			/* webpackChunkName: "comicvine" */ './news-and-ratings/comicvine/comicvine-platform'
		),
		gamefaqs: import(
			/* webpackChunkName: "gamefaqs" */ './news-and-ratings/gamefaqs/gamefaqs-platform'
		),
		gamespot: import(
			/* webpackChunkName: "gamespot" */ './news-and-ratings/gamespot/gamespot-platform'
		),
		giantbomb: import(
			/* webpackChunkName: "giantbomb" */ './news-and-ratings/giantbomb/giantbomb-platform'
		),
		metacritic: import(
			/* webpackChunkName: "metacritic" */ './news-and-ratings/metacritic/metacritic-platform'
		),
		'metacritic-neutron': import(
			/* webpackChunkName: "metacritic-neutron" */
			'./news-and-ratings/metacritic-neutron/metacritic-neutron-platform'
		),
		tvguide: import(
			/* webpackChunkName: "tvguide" */ './news-and-ratings/tvguide/tvguide-platform'
		),
		'tvguide-mtc': import(
			/* webpackChunkName: "tvguide-mtc" */ './news-and-ratings/tvguide-mtc/tvguide-mtc-platform'
		),
		sports: import(/* webpackChunkName: "sports" */ './sports/sports-platform'),
		'ucp-desktop': import(
			/* webpackChunkName: "ucp-desktop" */ './ucp-desktop/ucp-desktop-platform'
		),
		'ucp-mobile': import(/* webpackChunkName: "ucp-mobile" */ './ucp-mobile/ucp-mobile-platform'),
		'ucp-no-ads': import(/* webpackChunkName: "ucp-no-ads" */ './ucp-no-ads/ucp-no-ads-platform'),
	};

	constructor(private readonly container: Container) {}

	public get(platform: string): Promise<DiProcess> {
		return PlatformFactory.supportedPlatforms[platform]
			.then((module) => module.default)
			.then((module) => this.container.get<DiProcess>(module));
	}
}
