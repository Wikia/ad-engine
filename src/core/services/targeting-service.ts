import { debug } from './debug';
import { Injectable } from '@wikia/dependency-injection';

type ChangeCallback = (key: string, value: any) => void;

interface TargetingObject {
	[key: string]: any;
}

@Injectable({ scope: 'Singleton' })
export class TargetingService {
	private adTargeting: TargetingObject = { ds: 'das' };
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

	get(key: string): any {
		return this.adTargeting[key];
	}

	set(key: string, value: any): void {
		this.adTargeting[key] = value;
		this.triggerOnChange(key, value);
	}

	remove(key: string): void {
		if (!this.adTargeting[key]) {
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
