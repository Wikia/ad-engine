import { AdSlot } from '@wikia/ad-engine';

export interface Provider {
	fillIn(adSlot: AdSlot): void;
}

export {}; // tslint no-sole-interface fix
