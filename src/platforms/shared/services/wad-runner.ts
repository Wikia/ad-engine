import {
	babDetection,
	BaseServiceSetup,
	btfBlockerService,
	btRec,
	context,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { trackBab } from '../tracking/bab-tracker';

const defaultOnDetect = () => {
	btfBlockerService.finishFirstCall();
	btRec.run();
};

@injectable()
export class WadRunner extends BaseServiceSetup {
	public detector = babDetection;
	public onDetected: () => void = defaultOnDetect;

	async call(): Promise<void> {
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
