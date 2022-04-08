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
import { slotsContext } from '../slots/slots-context';

interface NoAdsConfig {
	unitName: string;
	beaconRegex: string;
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
		const unitName = this.getUnitNameToDisable(configs, userBeacon);
		this.disableUnit(unitName);
	}

	skipBtfBlocker() {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			btfBlockerService.finishFirstCall();
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
				isLoaded: universalAdPackage.isFanTakeoverLoaded(),
				adProduct: universalAdPackage.getType(),
			});
		});
	}

	disableUnit(unitName: string) {
		const { desktop, mobile } = universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize;
		switch (unitName) {
			case 'uap':
				slotsContext.removeSlotSize('top_leaderboard', desktop);
				slotsContext.removeSlotSize('top_leaderboard', mobile);
				return;
			case 'interstitial_celtra':
				this.cookieAdapter.setItem('_ae_intrsttl_imp', '1');
				return;
			case 'interstitial_google':
				context.set(`slots.interstitial.disabled`, true);
				return;
			case 'top_leaderboard':
				this.skipBtfBlocker();
				context.set(`slots.top_leaderboard.disabled`, true);
				return;
			default:
				context.set(`slots.${unitName}.disabled`, true);
		}
	}

	getUnitNameToDisable(configs: NoAdsConfig[], userBeacon): string {
		const config = configs.find((conf) => userBeacon.match(conf.beaconRegex));

		return config?.unitName;
	}
}
