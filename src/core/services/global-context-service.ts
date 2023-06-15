import { utils } from '../index';

export enum GlobalContextCategories {
	site = 'site',
	page = 'page',
	tracking = 'tracking',
	partners = 'partners',
}

export class GlobalContextService {
	private logGroup = 'GlobalContextService';

	constructor() {
		if (!window.fandomContext) {
			this.createEmptyContext();
		}
	}

	private createEmptyContext(): void {
		utils.logger(this.logGroup, 'Creating empty fandomContext');
		window.fandomContext = {
			site: {},
			page: {},
			tracking: {},
			partners: {},
		};
	}

	private isObject(item: any): boolean {
		return typeof item === 'object' && !Array.isArray(item);
	}

	private merge<A = unknown, B = unknown>(target: A, source: B): A & B {
		const isDeep = (prop: string) =>
			this.isObject(source[prop]) &&
			Object.prototype.hasOwnProperty.call(target, prop) &&
			this.isObject(target[prop]);
		const replaced = Object.getOwnPropertyNames(source)
			.map((prop) => ({
				[prop]: isDeep(prop) ? this.merge(target[prop], source[prop]) : source[prop],
			}))
			.reduce((a, b) => ({ ...a, ...b }), {});

		return {
			...target,
			...replaced,
		} as A & B;
	}

	setValue<K extends keyof WindowFandomContext, V extends Required<WindowFandomContext[K]>>(
		category: K,
		value: V,
	): void {
		if (!window.fandomContext[category]) {
			window.fandomContext[category] = {};
		}
		window.fandomContext[category] = this.merge(window.fandomContext[category], value);
	}

	getValue<K extends keyof WindowFandomContext, I extends keyof WindowFandomContext[K]>(
		category: K,
		key?: I,
	): WindowFandomContext[K][I] | undefined {
		const categoryObj = window.fandomContext[category];
		if (categoryObj) {
			return categoryObj[key];
		} else {
			utils.logger(this.logGroup, 'Attempting to retrieve invalid category in context!');
		}
	}
}

export const globalContextService = new GlobalContextService();
