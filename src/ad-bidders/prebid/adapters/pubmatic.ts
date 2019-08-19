import { PrebidAdUnit, PrebidBidder } from '@ad-engine/core';
import { BaseAdapter } from './base-adapter';

export class Pubmatic extends BaseAdapter {
	static bidderName = 'pubmatic';
	publisherId: string;

	get bidderName(): string {
		return Pubmatic.bidderName;
	}

	constructor(options) {
		super(options);

		this.publisherId = options.publisherId;
	}

	prepareConfigForAdUnit(code, { sizes, ids }): PrebidAdUnit {
		switch (code.toLowerCase()) {
			case 'featured':
			case 'incontent_player':
				return this.getVideoConfig(code, ids);
			default:
				return this.getStandardConfig(code, sizes, ids);
		}
	}

	getVideoConfig(code, ids): PrebidAdUnit {
		const videoParams = {
			video: {
				mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
				skippable: true,
				minduration: 1,
				maxduration: 30,
				startdelay: 0,
				playbackmethod: [2, 3],
				api: [2],
				protocols: [2, 3, 5, 6],
				linearity: 1,
				placement: 1,
			},
		};

		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [640, 480],
					context: 'instream',
				},
			},
			bids: this.getBids(ids, videoParams),
			sizes: [],
		};
	}

	getStandardConfig(code, sizes, ids): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: this.getBids(ids),
			sizes: [],
		};
	}

	getBids(ids, params = {}): PrebidBidder[] {
		return ids.map((adSlot) => ({
			bidder: this.bidderName,
			params: {
				adSlot,
				publisherId: this.publisherId,
				...params,
			},
		}));
	}
}
