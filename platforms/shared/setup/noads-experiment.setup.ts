import {
	btfBlockerService,
	communicationService,
	context,
	CookieStorageAdapter,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

interface NoAdsConfig {
	slotName: string;
	beaconRegex: string;
}

function skipBtfBlocker() {
	communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
		btfBlockerService.finishFirstCall();
		communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
			isLoaded: universalAdPackage.isFanTakeoverLoaded(),
			adProduct: universalAdPackage.getType(),
		});
	});
}

@Injectable()
export class NoAdsExperimentSetup implements DiProcess {
	constructor(
		private instantConfig: InstantConfigService,
		private cookieAdapter: CookieStorageAdapter,
	) {}

	execute(): void {
		const configs = this.instantConfig.get<object>('icNoAdsExperimentConfig', []) as NoAdsConfig[];
		const userBeacon: string = this.cookieAdapter.getItem('wikia_beacon_id');
		const config = configs.find((conf) => userBeacon.match(conf.beaconRegex));
		const slotName = config?.slotName;

		switch (slotName) {
			case 'uap':
				context.set(`slots.top_leaderboard.disabled`, true);
				return;
			case 'celtra-interstitial':
				this.cookieAdapter.setItem('_ae_intrsttl_imp', '1');
				return;
			case 'top_leaderboard':
				skipBtfBlocker();
		}
		context.set(`slots.${slotName}.disabled`, true);
	}
}
