import { wadRunner } from '../index';
import { BaseServiceSetup } from '@wikia/ad-engine';

class WadRunnerSetup extends BaseServiceSetup {
	async initialize() {
		await wadRunner.call();
		this.res();
	}
}

export const wadRunnerSetup = new WadRunnerSetup();
