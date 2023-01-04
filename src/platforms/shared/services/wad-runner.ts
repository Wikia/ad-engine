import {
	babDetection,
	BaseServiceSetup,
	btfBlockerService,
	btRec,
	context,
} from '@wikia/ad-engine';
import { trackBab } from '../tracking/bab-tracker';

const defaultOnDetect = () => {
	btfBlockerService.finishFirstCall();
	btRec.run();
};

export class WadRunner extends BaseServiceSetup {
	protected detector;
	protected onDetected: () => void;

	constructor(detector = babDetection, onDetected = defaultOnDetect) {
		super();

		this.detector = detector;
		this.onDetected = onDetected;
	}

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

export const wadRunner = new WadRunner();
