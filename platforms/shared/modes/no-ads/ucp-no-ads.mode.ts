import { context, eventService, jwpSetup, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { PageTracker } from '../../tracking/page-tracker';
import { NoAdsMode } from './_no-ads.mode';

@Injectable()
export class UcpNoAdsMode implements NoAdsMode {
	constructor(private pageTracker: PageTracker) {}

	handleNoAds(): void {
		this.dispatchJWPlayerSetupAction();
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `off_${this.getReasonForNoAds()}`);
	}

	private getReasonForNoAds(): string {
		const reasonFromBackend = window.ads.context.opts.noAdsReason;
		const pageType = window.ads.context.opts.pageType;

		if (reasonFromBackend === 'no_ads_user' && pageType === 'homepage_logged') {
			return '';
		}

		if (reasonFromBackend) {
			return reasonFromBackend;
		}

		const possibleFrontendReasons = {
			noads_querystring: !!utils.queryString.get('noads'),
			noexternals_querystring: !!utils.queryString.get('noexternals'),
			steam_browser: context.get('state.isSteam'),
			ad_stack_disabled: context.get('options.disableAdStack'),
		};

		const reasons = Object.values(possibleFrontendReasons).filter((value) => {
			return value === true;
		});

		return reasons.length > 0 ? reasons[0] : '';
	}

	private dispatchJWPlayerSetupAction(): void {
		eventService.communicator.dispatch(jwpSetup({ showAds: false, autoplayDisabled: false }));
	}
}
