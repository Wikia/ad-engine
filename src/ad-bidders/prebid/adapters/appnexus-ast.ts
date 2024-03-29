import { utils } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import {
	PrebidAdSlotConfig,
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '../prebid-models';

export class AppnexusAst extends PrebidAdapter {
	static bidderName = 'appnexusAst';
	aliases = {
		appnexus: [AppnexusAst.bidderName],
	};
	bidderSettings = {
		storageAllowed: true,
	};

	debugPlacementId: string;
	isDebugMode: boolean;

	constructor(options) {
		super(options);

		this.debugPlacementId = options.debugPlacementId;
		this.isDebugMode = utils.queryString.get('appnexusast_debug_mode') === '1';
	}

	get bidderName(): string {
		return AppnexusAst.bidderName;
	}

	prepareConfigForAdUnit(code, { placementId }: PrebidAdSlotConfig): PrebidAdUnit {
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
						keywords: {
							...this.getTargeting(code),
						},
						video: {
							skippable: false,
							playback_method: ['auto_play_sound_off'],
							placement: PrebidVideoPlacements.IN_ARTICLE,
							plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
						},
					},
				},
			],
		};
	}
}
