import { Dictionary } from '../models';
import { Injectable } from '@wikia/dependency-injection';

type ChangeCallback = (key: string, value: any) => void;

@Injectable({ scope: 'Singleton' })
export class ContextCallbacksService {
	constructor(private onChangeCallbacks: Dictionary<ChangeCallback[]> = {}) {}

	onChange(groupName: string, key: string, callback: ChangeCallback): void {
		this.onChangeCallbacks[groupName] = this.onChangeCallbacks[groupName] || [];
		this.onChangeCallbacks[groupName][key] = this.onChangeCallbacks[groupName][key] || [];
		this.onChangeCallbacks[groupName][key].push(callback);
	}

	removeListeners(groupName: string, key: string): void {
		if (this.onChangeCallbacks[groupName]) {
			Object.keys(this.onChangeCallbacks[groupName]).forEach((contextKey: string) => {
				if (contextKey === key || contextKey.indexOf(`${key}.`) === 0) {
					delete this.onChangeCallbacks[contextKey];
				}
			});
		}
	}

	runCallbacks(groupName: string, trigger: string, key: string, newValue: any): void {
		if (!this.onChangeCallbacks[groupName][trigger]) {
			return;
		}

		this.onChangeCallbacks[groupName][trigger].forEach((callback) => {
			callback(key, newValue);
		});
	}

	triggerOnChange(groupName: string, key: string, newValue: any): void {
		if (!this.onChangeCallbacks[groupName][key]) {
			console.log(newValue);
			return;
		}
	}
}
