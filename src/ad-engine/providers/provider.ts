import { AdSlot } from '../models';

export interface Provider {
	fillIn(adSlot: AdSlot): void;
}
