import { DiProcess } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';

export class PlatformFactory {
	private static supportedPlatforms = {
		bingebot: import(/* webpackChunkName: "bingebot" */ './bingebot/bingebot-platform').then(
			(module) => module.BingeBotPlatform,
		),
		f2: import(/* webpackChunkName: "f2" */ './f2/f2-platform').then((module) => module.F2Platform),
		comicvine: import(
			/* webpackChunkName: "comicvine" */ './news-and-ratings/comicvine/comicvine-platform'
		).then((module) => module.ComicvinePlatform),
		gamefaqs: import(
			/* webpackChunkName: "gamefaqs" */ './news-and-ratings/gamefaqs/gamefaqs-platform'
		).then((module) => module.GamefaqsPlatform),
		gamespot: import(
			/* webpackChunkName: "gamespot" */ './news-and-ratings/gamespot/gamespot-platform'
		).then((module) => module.GameSpotPlatform),
		giantbomb: import(
			/* webpackChunkName: "giantbomb" */ './news-and-ratings/giantbomb/giantbomb-platform'
		).then((module) => module.GiantbombPlatform),
		metacritic: import(
			/* webpackChunkName: "metacritic" */ './news-and-ratings/metacritic/metacritic-platform'
		).then((module) => module.MetacriticPlatform),
		'metacritic-neutron': import(
			/* webpackChunkName: "metacritic-neutron" */
			'./news-and-ratings/metacritic-neutron/metacritic-neutron-platform'
		).then((module) => module.MetacriticNeutronPlatform),
		tvguide: import(
			/* webpackChunkName: "tvguide" */ './news-and-ratings/tvguide/tvguide-platform'
		).then((module) => module.TvGuidePlatform),
		'tvguide-mtc': import(
			/* webpackChunkName: "tvguide-mtc" */ './news-and-ratings/tvguide-mtc/tvguide-mtc-platform'
		).then((module) => module.TvGuideMTCPlatform),
		sports: import(/* webpackChunkName: "sports" */ './sports/sports-platform').then(
			(module) => module.SportsPlatform,
		),
		'ucp-desktop': import(
			/* webpackChunkName: "ucp-desktop" */ './ucp-desktop/ucp-desktop-platform'
		).then((module) => module.UcpDesktopPlatform),
		'ucp-mobile': import(
			/* webpackChunkName: "ucp-mobile" */ './ucp-mobile/ucp-mobile-platform'
		).then((module) => module.UcpMobilePlatform),
		'ucp-no-ads': import(
			/* webpackChunkName: "ucp-no-ads" */ './ucp-no-ads/ucp-no-ads-platform'
		).then((module) => module.UcpNoAdsPlatform),
	};

	constructor(private readonly container: Container) {}

	public get(platform: string): Promise<DiProcess> {
		return PlatformFactory.supportedPlatforms[platform].then((module) =>
			this.container.get(module),
		);
	}
}
