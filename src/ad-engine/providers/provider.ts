import { AdSlot } from '../models';

export interface Provider {
	fillIn(adSlot: AdSlot): void;
}

export {}; // tslint no-sole-types fix
