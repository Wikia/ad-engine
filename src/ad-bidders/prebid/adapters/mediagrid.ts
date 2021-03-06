import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';

export class Mediagrid extends PrebidAdapter {
	static bidderName = 'mediagrid';

	aliases = {
		grid: [Mediagrid.bidderName],
	};

	get bidderName(): string {
		return Mediagrid.bidderName;
	}

	prepareConfigForAdUnit(code, { uid }): PrebidAdUnit {
		const config: PrebidAdUnit = {
			code,
			mediaTypes: {
				video: {
					context: 'instream',
					playerSize: [640, 480],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						uid,
					},
				},
			],
		};

		if (context.get('custom.jwplayerDataProvider')) {
			config.fpd = {
				context: {
					data: {
						jwTargeting: {
							playerID: 'featured-video__player',
							mediaID: context.get('wiki.targeting.featuredVideo.mediaId'),
						},
					},
				},
			};
		}

		return config;
	}
}
