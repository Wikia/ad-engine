import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class MagniteS2s extends PrebidAdapter {
	static bidderName = 'mgnipbs';
	accountId: number;

	constructor(options) {
		super(options);

		this.accountId = options.accountId;
	}

	get bidderName(): string {
		return MagniteS2s.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes }: PrebidAdSlotConfig): PrebidAdUnit {
		let mediaTypes: object = {
			banner: {
				sizes,
			},
		};
		if (code === 'featured')
			mediaTypes = {
				video: {
					playerSize: sizes[0],
					context: 'outstream',
					api: [2],
					linearity: 1,
					mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
					maxduration: 30,
					minduration: 1,
					protocols: [2, 3, 5, 6],
				},
			};
		return {
			code,
			mediaTypes,
			ortb2Imp: this.getOrtb2Imp(code),
			bids: [
				{
					bidder: this.bidderName,
					params: {}, // Magnite requires empty "params"
				},
			],
		};
	}
}
