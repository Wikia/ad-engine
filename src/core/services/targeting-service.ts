import { debug } from './debug';

type ChangeCallback = (key: string, value: any) => void;

interface TargetingObject {
	[key: string]: any;
}

export interface GlobalTargeting {
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
	rating?: string;
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

export class TargetingService {
	private adTargeting: TargetingObject = {};
	private onChangeCallbacks: ChangeCallback[] = [];

	constructor() {
		window.ads.adTargeting = debug.isDebugMode() ? this.adTargeting : {};

		if (debug.isDebugMode()) {
			this.log('constructor ' + new Date().getTime());
		}
	}

	changeAll(newTargeting: TargetingObject): void {
		this.adTargeting = newTargeting;
		this.triggerOnChange(null, this.adTargeting);
	}

	getAll<T = TargetingObject>(): T {
		return this.adTargeting as T;
	}

	get(key: string): any {
		return this.adTargeting[key];
	}

	set(key: string, value: any): void {
		this.adTargeting[key] = value;
		this.triggerOnChange(key, value);
	}

	remove(key: string): void {
		if (this.adTargeting[key]) {
			delete this.adTargeting[key];
			this.triggerOnChange(key, null);
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
		window.ads.adTargeting = debug.isDebugMode() ? this.adTargeting : {};

		this.onChangeCallbacks.forEach((callback) => {
			callback(key, newValue);
		});
	}

	private log(text: string): void {
		console.log('TargetingService: ' + text);
	}
}

export const targetingService = new TargetingService();
