// @ts-strict-ignore
import { Dictionary } from '../models';
import { debug } from './debug';

interface ContextObject {
	[key: string]: any;
}

type ChangeCallback = (key: string, value: any) => void;

const contextObject: ContextObject = {
	adUnitId: '',
	bidders: {
		enabled: false,
		timeout: 2000,
		a9: {
			enabled: false,
			videoEnabled: false,
			amazonId: '3115',
			bidsRefreshing: {
				slots: [],
			},
		},
		prebid: {
			enabled: false,
			bidsRefreshing: {
				slots: [],
			},
		},
	},
	events: {},
	listeners: {
		porvata: [],
	},
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		maxDelayTimeout: 2000,
		optOutSale: false,
		trackingOptIn: false,
		isSubjectToCcpa: false,
	},
	services: {},
	slots: {},
	src: ['gpt'],
	state: {
		adStack: [],
		isMobile: false,
	},
	targeting: {},
	vast: {
		size: [640, 480],
		adUnitId: '',
	},
};

const onChangeCallbacks: Dictionary<ChangeCallback[]> = {};

function runCallbacks(trigger: string, key: string, newValue: any): void {
	if (!onChangeCallbacks[trigger]) {
		return;
	}

	onChangeCallbacks[trigger].forEach((callback) => {
		callback(key, newValue);
	});
}

function triggerOnChange(key: string, segments: string[], newValue: any): void {
	let trigger = '';

	segments.forEach((seg) => {
		trigger += (trigger === '' ? '' : '.') + seg;
		runCallbacks(trigger, key, newValue);
	});
}

function segment(key: string, newValue?: any, remove = false): any {
	const segments = key.split('.');
	const segmentsCount = segments.length;
	let seg = contextObject;
	let lastKey = null;

	for (let i = 0; i < segmentsCount; i += 1) {
		lastKey = segments[i];
		if (i < segmentsCount - 1) {
			seg[lastKey] = seg[lastKey] || {};
			seg = seg[lastKey];
		}
	}

	if (remove) {
		delete seg[lastKey];
		triggerOnChange(key, segments, null);

		return null;
	}

	if (newValue !== undefined) {
		seg[lastKey] = newValue;
		triggerOnChange(key, segments, newValue);
	}

	return seg[lastKey];
}

export interface ContextInterface {
	extend(newContext: ContextObject): void;

	set(key: string, value: any): void;

	get(key: string): any;

	remove(key: string): void;

	push(key: string, value: any): void;

	onChange(key: string, callback: ChangeCallback): void;

	removeListeners(key: string): void;
}

export class Context implements ContextInterface {
	constructor() {
		window.ads = window.ads || ({} as MediaWikiAds);
		window.ads.adContext = debug.isDebugMode() ? contextObject : {};
	}

	extend(newContext: ContextObject): void {
		Object.assign(contextObject, newContext);
	}

	set(key: string, value: any): void {
		segment(key, value);
	}

	get(key: string): any {
		return segment(key);
	}

	remove(key: string): void {
		segment(key, null, true);
	}

	push(key: string, value: any): void {
		const array = segment(key);

		if (array) {
			array.push(value);
		}
	}

	onChange(key: string, callback: ChangeCallback): void {
		onChangeCallbacks[key] = onChangeCallbacks[key] || [];
		onChangeCallbacks[key].push(callback);
	}

	removeListeners(key: string): void {
		Object.keys(onChangeCallbacks).forEach((contextKey: string) => {
			if (contextKey === key || contextKey.indexOf(`${key}.`) === 0) {
				delete onChangeCallbacks[contextKey];
			}
		});
	}
}

export const context = new Context();
