import { BaseServiceSetup } from '@wikia/ad-engine';
import { startAdEngine } from '../modes/start-ad-engine';

class GptSetup extends BaseServiceSetup {
	initialize() {
		startAdEngine();
		this.res();
	}
}

export const gptSetup = new GptSetup();
