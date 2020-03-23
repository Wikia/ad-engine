import { NoAdsMode, PageTracker } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Communicator } from '@wikia/post-quecast';

@Injectable()
export class UcpNoAdsMode implements NoAdsMode {
	handleNoAds(): void {
		this.dispatchJWPlayerSetupAction();
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		PageTracker.trackProp('adengine', `off_${this.getReasonForNoAds()}`);
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
		const communicator = new Communicator();

		communicator.dispatch({
			type: '[Ad Engine] Setup JWPlayer',
			showAds: false,
			autoplayDisabled: false,
		});
	}
}
