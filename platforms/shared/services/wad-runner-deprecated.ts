import { babDetection, BaseServiceSetup, btfBlockerService, btRec } from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

class WadRunnerDeprecated extends BaseServiceSetup {
	async call(): Promise<void> {
		if (!babDetection.isEnabled()) {
			return Promise.resolve();
		}

		const isBabDetected = await babDetection.run();

		trackBab(isBabDetected);

		if (isBabDetected) {
			btfBlockerService.finishFirstCall();
			btRec.run();
		}
	}
}

export const wadRunnerDeprecated = new WadRunnerDeprecated();
