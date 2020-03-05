import { babDetection, btRec } from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

class WadRunner {
	async call(): Promise<void> {
		if (!babDetection.isEnabled()) {
			return Promise.resolve();
		}

		const isBabDetected = await babDetection.run();

		trackBab(isBabDetected);

		if (isBabDetected) {
			btRec.run();
		}
	}
}

export const wadRunner = new WadRunner();
