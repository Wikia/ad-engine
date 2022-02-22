import { AdSlot } from '../../models';
import { Provider } from '../provider';
import { logger } from '../../utils';

const logGroup = 'nativo';

export class NativoProvider implements Provider {
	constructor() {
		window.ntv = window.ntv || {};
		window.ntv.cmd = window.ntv.cmd || [];
	}

	fillIn(slot: AdSlot): boolean {
		window.ntv.Events?.PubSub?.subscribe('noad', (e) => {
			this.handleNativoNativeEvent(e, slot, AdSlot.STATUS_COLLAPSE);
		});

		window.ntv.Events?.PubSub?.subscribe('adRenderingComplete', (e) => {
			this.handleNativoNativeEvent(e, slot, AdSlot.STATUS_SUCCESS);
		});

		this.pushQueue();

		return true;
	}

	private handleNativoNativeEvent(e, slot: AdSlot, adStatus: string) {
		logger(logGroup, 'Nativo native event fired', e, adStatus);

		if (slot.getStatus() !== adStatus) {
			slot.setStatus(adStatus);
		} else {
			logger(logGroup, 'Slot status already tracked', slot.getSlotName(), adStatus);
		}
	}

	private pushQueue(): void {
		window.ntv.cmd.push(() => {
			window.PostRelease.Start();
		});
	}
}
