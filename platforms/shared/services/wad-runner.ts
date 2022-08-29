import { babDetection, btfBlockerService, btRec, ServiceStage, Service } from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

@Service({
	stage: ServiceStage.preProvider,
})
class WadRunner {
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

export const wadRunner = new WadRunner();
