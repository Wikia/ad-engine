import { PrebidAdapter } from '../prebid-adapter';

export class OneVideo extends PrebidAdapter {
	static bidderName = 'oneVideo';

	get bidderName(): string {
		return OneVideo.bidderName;
	}

	prepareConfigForAdUnit(code, { site, pubId }): PrebidAdUnit {
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
						site,
						pubId,
						video: {
							playerWidth: 640,
							playerHeight: 480,
							mimes: ['video/mp4', 'application/javascript'],
							protocols: [2, 5],
							api: [1, 2],
							delivery: [2],
						},
					},
				},
			],
		};
	}
}
