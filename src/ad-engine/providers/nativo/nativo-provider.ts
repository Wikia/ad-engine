import { AdSlot, Dictionary } from '../../models';
import { Provider } from '../provider';
import { logger } from '../../utils';

const logGroup = 'nativo';

export class NativoProvider implements Provider {
	private ntvSdk: NativoSdk;

	constructor(ntvSdk) {
		this.ntvSdk = ntvSdk || {};
		this.ntvSdk.cmd = this.ntvSdk.cmd || [];
	}

	fillIn(slot: AdSlot): boolean {
		logger(logGroup, `Filling ${slot.getSlotName()} by pushing Nativo's command queue`);

		this.getQueue().push(() => {
			window.PostRelease.Start();
		});

		return true;
	}

	getQueue(): Array<Dictionary> {
		return this.ntvSdk.cmd;
	}
}
