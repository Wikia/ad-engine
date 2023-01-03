import { debug } from './debug';

export interface SlotTargeting {
	amznbid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	src?: string;
	pos?: string;
	loc?: string;
	rv?: string | string[];
	[key: string]: googletag.NamedSize | number;
}

interface TargetingObject {
	[key: string]: SlotTargeting;
}

export class SlotTargetingService {
	private slotTargeting: TargetingObject = {};

	constructor() {
		window.ads.slotTargeting = debug.isDebugMode() ? this.slotTargeting : {};
	}

	extend(slotName: string, newTargeting: SlotTargeting): void {
		this.slotTargeting[slotName] = this.slotTargeting[slotName] || ({} as SlotTargeting);

		this.slotTargeting[slotName] = Object.assign(this.slotTargeting[slotName], newTargeting);
		window.ads.slotTargeting = debug.isDebugMode() ? this.slotTargeting : {};
	}

	getAll(slotName: string): SlotTargeting {
		return this.slotTargeting[slotName] || ({} as SlotTargeting);
	}

	get(slotName: string, key: string): any {
		return this.slotTargeting[slotName][key];
	}

	set(slotName: string, key: string, value: any): void {
		this.slotTargeting[slotName] = this.slotTargeting[slotName] || ({} as SlotTargeting);
		this.slotTargeting[slotName][key] = value;
	}

	remove(slotName: string, key: string): void {
		if (this.slotTargeting[slotName][key]) {
			delete this.slotTargeting[slotName][key];
		}
	}
}

export const slotTargetingService = new SlotTargetingService();
