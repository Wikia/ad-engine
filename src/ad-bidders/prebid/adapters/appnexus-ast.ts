import { utils } from '@wikia/ad-engine';
import { AdUnitConfig, BaseAdapter, EXTENDED_MAX_CPM } from './base-adapter';

export class AppnexusAst extends BaseAdapter {
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

	prepareConfigForAdUnit(code, { placementId }): AdUnitConfig {
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
