import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsDetector } from '../services/no-ads-detector';

@Injectable()
export class BaseContextSetup implements DiProcess {
	constructor(
		protected instantConfig: InstantConfigService,
		protected noAdsDetector: NoAdsDetector,
	) {}

	execute(): void {
		this.setBaseState();
		this.setServicesContext();
	}

	private setBaseState(): void {
		if (utils.pageInIframe()) {
			this.noAdsDetector.addReason('in_iframe');
		}

		if (utils.client.isSteamPlatform()) {
			this.noAdsDetector.addReason('steam_browser');

			const topLeaderboard = document.querySelector('.top-leaderboard');
			topLeaderboard?.classList.remove('is-loading');

			const bottomLeaderboard = document.querySelector('.bottom-leaderboard');
			bottomLeaderboard?.classList.remove('is-loading');
		}
		if (utils.queryString.get('noexternals')) {
			this.noAdsDetector.addReason('noexternals_querystring');
		}
		if (utils.queryString.get('noads')) {
			this.noAdsDetector.addReason('noads_querystring');
		}

		context.set('state.showAds', this.noAdsDetector.isAdsMode());
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));
	}

	private setServicesContext(): void {
		context.set(
			'services.interventionTracker.enabled',
			this.instantConfig.get('icInterventionTracking'),
		);
		context.set('services.nativo.enabled', this.instantConfig.get('icNativo'));
		context.set('services.ppid.enabled', this.instantConfig.get('icPpid'));
		context.set('services.ppidRepository', this.instantConfig.get('icPpidRepository'));
		context.set('services.identityTtl', this.instantConfig.get('icIdentityTtl'));
		context.set('services.identityPartners', this.instantConfig.get('icIdentityPartners'));

		context.set(
			'services.messageBox.enabled',
			this.instantConfig.get('icAdCollapsedMessageBox', false),
		);
	}
}
