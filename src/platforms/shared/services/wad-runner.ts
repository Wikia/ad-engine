import {
	babDetection,
	BaseServiceSetup,
	btfBlockerService,
	btForce,
	btRec,
	context,
} from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

const defaultOnDetect = () => {
	btfBlockerService.finishFirstCall();
	btRec.run();
};

export class WadRunner extends BaseServiceSetup {
	public detector = babDetection;
	public onDetected: () => void = defaultOnDetect;

	async call(): Promise<void> {
		if (this.instantConfig.get('icBTForce')) {
			context.set('options.wad.btForce', true);
		}

		if (context.get('options.wad.btForce')) {
			return btForce.run();
		}

		if (!this.detector.isEnabled()) {
			return Promise.resolve();
		}

		const isBabDetected = await this.detector.run();
		context.set('options.wad.blocking', isBabDetected);

		trackBab(isBabDetected);

		if (isBabDetected) {
			this.onDetected();
		}
	}
}
