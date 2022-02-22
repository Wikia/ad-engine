import { AdSlot } from '../../models';
import { Provider } from '../provider';
import { logger } from '../../utils';

const logGroup = 'nativo';

export class NativoProvider implements Provider {
	private ntvSdk: NativoQueue;

	constructor(ntvSdk) {
		this.ntvSdk = ntvSdk || {};
		this.ntvSdk.cmd = this.ntvSdk.cmd || [];
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
		this.ntvSdk.cmd.push(() => {
			window.PostRelease.Start();
		});
	}
}
