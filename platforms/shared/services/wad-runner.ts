import {
	babDetection,
	btfBlockerService,
	btRec,
	communicationService,
	globalAction,
} from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

const adblockDetectedAction = globalAction('[AdEngine] Ad block detected');

class WadRunner {
	async call(): Promise<void> {
		if (!babDetection.isEnabled()) {
			return Promise.resolve();
		}

		const isBabDetected = await babDetection.run();

		trackBab(isBabDetected);

		if (isBabDetected) {
			// event listeners might be outside of AdEngine, f.e. in the SilverSurfer/Pathfinder certain ad slots may not be present
			communicationService.dispatch(adblockDetectedAction());
			btfBlockerService.finishFirstCall();
			btRec.run();
		}
	}
}

export const wadRunner = new WadRunner();
