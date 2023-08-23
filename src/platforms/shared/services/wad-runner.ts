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
	if (context.get('options.wad.btForce')) {
		btForce.run();
	} else {
		btfBlockerService.finishFirstCall();
		btRec.run();
	}
};

export class WadRunner extends BaseServiceSetup {
	public detector = babDetection;
	public onDetected: () => void = defaultOnDetect;

	async call(): Promise<void> {
		if (this.instantConfig.get('icBTForce')) {
			context.set('options.wad.btForce', true);
			this.onDetected();
		} else {
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
}
