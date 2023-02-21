import { debug } from './debug';

export type ChangeCallback = (key: string | null, value: any) => void;

export interface TargetingObject {
	[key: string]: any;
}

export interface SlotTargeting {
	amznbid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	src?: string;
	pos?: string;
	loc?: string;
	rv?: string | string[] | number;

	[key: string]: googletag.NamedSize | number;
}

export interface TargetingData {
	AU_SEG?: string[];
	adt?: string;
	age?: string[];
	alc?: string;
	ar?: string;
	artid?: string;
	b_ias?: string;
	bundles?: string[];
	dlm?: string;
	dmn?: string;
	drg?: string;
	fr?: string;
	geo?: string;
	gnre?: string[];
	hat?: string;
	host?: string;
	hostpre?: string;
	'ias-kw'?: string[];
	is_mobile?: string;
	kid_wiki?: string;
	labrador?: string[];
	lang?: string;
	mappedVerticalName?: string;
	media?: string[];
	npa?: string;
	off?: string;
	original_host?: string;
	post_id?: string;
	ppid?: string;
	pv?: string;
	pvg?: string;
	rating?: any;
	rdp?: string;
	s0?: string;
	s0c?: string[];
	s0v?: string;
	s1?: string;
	s2?: string;
	skin?: string;
	theme?: string[];
	top?: string;
	tv?: string[];
	uap?: string;
	uap_c?: string;
	vio?: string;
	word_count?: number;
	wikiLanguage?: string;
	wpage?: string;
}

export interface TargetingServiceInterface {
	clear(slotName: string | null): void;

	extend(newTargeting: TargetingObject, slotName: string | null): void;

	dump<T = TargetingObject>(slotName: string | null): T;

	get(key: string, slotName: string | null): any;

	set(key: string, value: any, slotName: string | null): void;

	remove(key: string, slotName: string | null): void;

	onChange(callback: ChangeCallback): void;

	removeListeners(): void;
}

export class TargetingService implements TargetingServiceInterface {
	private adTargeting: TargetingObject = {};
	private onChangeCallbacks: ChangeCallback[] = [];
	private pageTargetingGroupName = 'PAGE_TARGETING';

	constructor() {
		if (debug.isDebugMode()) {
			window.ads.adTargeting = this.adTargeting;
		}
	}

	clear(slotName: string | null = null): void {
		const targetingGroupName = slotName || this.pageTargetingGroupName;
		this.adTargeting[targetingGroupName] = {} as TargetingObject;
	}

	extend(newTargeting: TargetingObject, slotName: string | null = null): void {
		const targetingGroupName = slotName || this.pageTargetingGroupName;
		this.adTargeting[targetingGroupName] =
			this.adTargeting[targetingGroupName] || ({} as TargetingObject);
		this.adTargeting[targetingGroupName] = Object.assign(
			this.adTargeting[targetingGroupName],
			newTargeting,
		);
	}

	dump<T = TargetingObject>(slotName: string | null = null): T {
		const targetingGroupName = slotName || this.pageTargetingGroupName;
		this.adTargeting[targetingGroupName] =
			this.adTargeting[targetingGroupName] || ({} as TargetingObject);

		return this.adTargeting[targetingGroupName] as T;
	}

	get(key: string, slotName: string | null = null): any {
		const targetingGroupName = slotName || this.pageTargetingGroupName;

		if (this.adTargeting[targetingGroupName]) {
			return this.adTargeting[targetingGroupName][key];
		}

		return undefined;
	}

	set(key: string, value: any, slotName: string | null = null): void {
		if (value !== undefined) {
			const targetingGroupName = slotName || this.pageTargetingGroupName;
			this.adTargeting[targetingGroupName] =
				this.adTargeting[targetingGroupName] || ({} as TargetingObject);
			this.adTargeting[targetingGroupName][key] = value;

			if (targetingGroupName === this.pageTargetingGroupName) {
				this.triggerOnChange(key, value);
			}
		}
	}

	remove(key: string, slotName: string | null = null): void {
		const targetingGroupName = slotName || this.pageTargetingGroupName;

		if (this.adTargeting[targetingGroupName] && this.adTargeting[targetingGroupName][key]) {
			delete this.adTargeting[targetingGroupName][key];

			if (targetingGroupName === this.pageTargetingGroupName) {
				this.triggerOnChange(key, null);
			}
		}
	}

	onChange(callback: ChangeCallback): void {
		this.onChangeCallbacks = this.onChangeCallbacks || [];
		this.onChangeCallbacks.push(callback);
	}

	removeListeners(): void {
		this.onChangeCallbacks = [];
	}

	private triggerOnChange(key: string, newValue: any): void {
		this.onChangeCallbacks.forEach((callback) => {
			callback(key, newValue);
		});
	}
}

export const targetingService = new TargetingService();
