import { NoAdsMode, PageTracker } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2NoAdsMode implements NoAdsMode {
	constructor(private pageTracker: PageTracker) {}

	handleNoAds(): void {
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `off_${this.getReasonForNoAds()}`);
	}

	private getReasonForNoAds(): string {
		const possibleFrontendReasons = {
			noads_querystring: !!utils.queryString.get('noads'),
			noexternals_querystring: !!utils.queryString.get('noexternals'),
			steam_browser: context.get('state.isSteam'),
			ad_stack_disabled: context.get('options.disableAdStack'),
		};
		const reasons = Object.values(possibleFrontendReasons).filter((value) => value === true);

		return reasons.length > 0 ? reasons[0] : '';
	}
}
