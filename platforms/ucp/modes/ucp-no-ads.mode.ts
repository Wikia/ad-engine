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
		if (context.get('state.showAds')) {
			PageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
		} else {
			PageTracker.trackProp('adengine', `off_${this.getReasonForNoAds()}`);
		}
	}

	private getReasonForNoAds(): string {
		const reasonFromBackend = window.ads.context.opts.noAdsReason || null;
		const pageType = window.ads.context.opts.pageType || null;

		if (reasonFromBackend === 'no_ads_user' && pageType === 'homepage_logged') {
			return null;
		}

		if (reasonFromBackend !== null) {
			return reasonFromBackend;
		}

		const possibleFrontendReasons = {
			noads_querystring: !!utils.queryString.get('noads'),
			noexternals_querystring: !!utils.queryString.get('noexternals'),
			steam_browser: context.get('state.isSteam'),
			ad_stack_disabled: context.get('options.disableAdStack'),
		};

		const reasons = Object.keys(possibleFrontendReasons).filter((key) => {
			return possibleFrontendReasons[key] === true;
		});

		return reasons.length > 0 ? reasons[0] : null;
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
