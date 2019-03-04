import { AdSlot } from '@wikia/ad-engine';

export abstract class Provider {
	abstract fillIn(adSlot: AdSlot): void;
}
