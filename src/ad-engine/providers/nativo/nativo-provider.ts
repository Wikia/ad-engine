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
		this.ntvSdk.Events?.PubSub?.subscribe('noad', (e) => {
			this.handleNativoNativeEvent(e, slot, AdSlot.STATUS_COLLAPSE);
		});

		this.ntvSdk.Events?.PubSub?.subscribe('adRenderingComplete', (e) => {
			this.handleNativoNativeEvent(e, slot, AdSlot.STATUS_SUCCESS);
		});

		this.requestAds();

		return true;
	}

	getQueue(): Array<Dictionary> {
		return this.ntvSdk.cmd;
	}

	private handleNativoNativeEvent(e, slot: AdSlot, adStatus: string) {
		logger(logGroup, 'Nativo native event fired', e, adStatus);

		if (slot.getStatus() !== adStatus) {
			slot.setStatus(adStatus);
		} else {
			logger(logGroup, 'Slot status already tracked', slot.getSlotName(), adStatus);
		}
	}

	private requestAds(): void {
		this.getQueue().push(() => {
			window.PostRelease.Start();
		});
	}
}
