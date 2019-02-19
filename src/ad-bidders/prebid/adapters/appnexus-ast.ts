import { utils } from '@wikia/ad-engine';
import { BaseAdapter } from './base-adapter';

export class AppnexusAst extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'appnexusAst';
		this.aliases = {
			appnexus: [this.bidderName],
		};
		this.debugPlacementId = options.debugPlacementId;
		this.isDebugMode = utils.queryString.get('appnexusast_debug_mode') === '1';
	}

	prepareConfigForAdUnit(code, { placementId }) {
		return {
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
						placementId: this.isDebugMode ? this.debugPlacementId : placementId,
						video: {
							skippable: false,
							playback_method: ['auto_play_sound_off'],
						},
					},
				},
			],
		};
	}
}
