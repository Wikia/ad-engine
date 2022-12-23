import { babDetection, BaseServiceSetup, btRec, context } from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

class WadRunner extends BaseServiceSetup {
	async call(): Promise<void> {
		if (!babDetection.isEnabled()) {
			return Promise.resolve();
		}

		// const isBabDetected = await babDetection.run();
		const isBabDetected = true;
		context.set('options.wad.blocking', isBabDetected);

		trackBab(isBabDetected);

		if (isBabDetected) {
			// btfBlockerService.finishFirstCall();
			btRec.run();
		}
	}
}

export const wadRunner = new WadRunner();
