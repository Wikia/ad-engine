import { trackBab } from '../index';
import { BaseServiceSetup, btRec, babDetection, btfBlockerService } from '@wikia/ad-engine';

class WadRunnerSetup extends BaseServiceSetup {
	async initialize() {
		if (!babDetection.isEnabled()) {
			this.res();
		} else {
			const isBabDetected = await babDetection.run();

			trackBab(isBabDetected);

			if (isBabDetected) {
				btfBlockerService.finishFirstCall();
				btRec.run();
			}
			this.res();
		}
	}
}

export const wadRunnerSetup = new WadRunnerSetup();
