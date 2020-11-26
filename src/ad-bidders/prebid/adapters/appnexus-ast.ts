import { context, utils } from '@ad-engine/core';
import { EXTENDED_MAX_CPM, PrebidAdapter } from '../prebid-adapter';

export class AppnexusAst extends PrebidAdapter {
	static bidderName = 'appnexusAst';
	aliases = {
		appnexus: [AppnexusAst.bidderName],
	};

	debugPlacementId: string;
	isDebugMode: boolean;
	maxCpm = EXTENDED_MAX_CPM;

	constructor(options) {
		super(options);

		this.debugPlacementId = options.debugPlacementId;
		this.isDebugMode = utils.queryString.get('appnexusast_debug_mode') === '1';
	}

	get bidderName(): string {
		return AppnexusAst.bidderName;
	}

	prepareConfigForAdUnit(code, { placementId }): PrebidAdUnit {
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
						keywords: context.get('bidders.prebid.additionalKeyvals.appnexus')
							? this.getTargeting(code)
							: {},
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
