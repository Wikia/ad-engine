import { PrebidAdapter } from '../prebid-adapter';

export class Criteo extends PrebidAdapter {
	static bidderName = 'criteo';

	networkId: string;

	get bidderName(): string {
		return Criteo.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, ids }): PrebidAdUnit {
		switch (code.toLowerCase()) {
			case 'featured':
			case 'incontent_player':
				return this.getVideoConfig(code, ids);
			default:
				return this.getStandardConfig(code, sizes);
		}
	}

	getVideoConfig(code, { networkId, zoneId }): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						networkId,
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
