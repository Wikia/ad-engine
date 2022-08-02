import { wadRunner } from '../index';
import { BaseServiceSetup } from '@wikia/ad-engine';

class WadRunnerSetup extends BaseServiceSetup {
	async initialize() {
		await wadRunner.call();
		this.setInitialized();
	}
}

export const wadRunnerSetup = new WadRunnerSetup();
