import { AdSlot, AdSlotStatus } from '../models';
import { Provider } from './provider';

export class NothingProvider implements Provider {
	fillIn(adSlot: AdSlot): void {
		adSlot.setStatus(AdSlotStatus.STATUS_SUCCESS);
	}
}
