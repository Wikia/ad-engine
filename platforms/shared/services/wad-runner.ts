import { babDetection, btfBlockerService, btRec, PipelineProcess } from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

class WadRunner implements PipelineProcess {
	async execute(): Promise<void> {
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
