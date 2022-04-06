import {
	btfBlockerService,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import Cookies from 'js-cookie';

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
export class NoAdsSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		const configs: NoAdsConfig[] = [{ slotName: 'top_boxad', beaconRegex: '^v[a-l]' }];
		const userBeacon: string = Cookies.get('wikia_beacon_id');
		const config = configs.find((conf) => userBeacon.match(conf.beaconRegex));
		const slotName = config.slotName;

		switch (slotName) {
			case 'uap':
				context.set(`slots.top_leaderboard.disabled`, true);
				return;
			case 'top_leaderboard':
				skipBtfBlocker();
		}
		context.set(`slots.${slotName}.disabled`, true);
	}
}
