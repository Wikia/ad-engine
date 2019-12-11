import { PrebidAdapter } from '../prebid-adapter';

export class Criteo extends PrebidAdapter {
	static bidderName = 'criteo';

	networkId: string;

	get bidderName(): string {
		return Criteo.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, networkId, zoneId }): PrebidAdUnit {
		switch (code.toLowerCase()) {
			case 'featured':
			case 'incontent_player':
				return this.getVideoConfig(code, zoneId);
			default:
				return this.getStandardConfig(code, { sizes, networkId });
		}
	}

	getVideoConfig(code, zoneId): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
					mimes: ['video/mp4'],
					maxduration: 30,
					api: [1, 2],
					protocols: [2, 3],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						zoneId,
					},
				},
			],
		};
	}

	getStandardConfig(code, { sizes, networkId }): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: sizes.map((size) => ({
				bidder: this.bidderName,
				params: {
					networkId,
					size,
				},
			})),
		};
	}
}
