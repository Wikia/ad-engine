import * as utils from '../../../ad-engine/utils';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Teads extends PrebidAdapter {
	static bidderName = 'teads';

	debugPageId: string;
	debugPlacementId: string;
	isDebugMode: boolean;

	constructor(options) {
		super(options);

		this.debugPageId = options.debugPageId;
		this.debugPlacementId = options.debugPlacementId;
		this.isDebugMode = utils.queryString.get('teads_debug_mode') === '1';
	}

	get bidderName(): string {
		return Teads.bidderName;
	}

	prepareConfigForAdUnit(code, { pageId, placementId }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				video: {
					playerSize: [1, 1],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						pageId: this.isDebugMode ? this.debugPageId : pageId,
						placementId: this.isDebugMode ? this.debugPlacementId : placementId,
					},
				},
			],
		};
	}
}
