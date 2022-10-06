import { AdSlot } from '../../models';
import { Provider } from '../provider';
import { logger } from '../../utils';

const logGroup = 'nativo';

export class NativoProvider implements Provider {
	private ntvApi: NativoApi;

	constructor(ntvApi) {
		this.ntvApi = ntvApi || {};
		this.ntvApi.cmd = this.ntvApi.cmd || [];
	}

	fillIn(slot: AdSlot): boolean {
		logger(logGroup, `Filling ${slot.getSlotName()} by pushing Nativo's command queue`);

		this.getQueue().push(() => {
			window.PostRelease.Start();
		});

		return true;
	}

	getQueue(): unknown[] {
		return this.ntvApi.cmd;
	}
}
