import { context, PartnerServiceStage } from '@ad-engine/core';

interface Constructor<T> {
	new (...args): T;
}

abstract class ServiceDecoredClass {
	// eslint-disable-next-line @typescript-eslint/ban-types
	call?: Function;
	options: PartnerServiceOptions;
}

export enum PartnerServicePlatforms {
	'ucpDesktopLight',
	'ucpDesktop',
	'ucpMobile',
	'ucpMobileLight',
	'sport',
	'bingebot',
	'f2',
	'noAds',
}

interface PartnerServiceOptions {
	stage?: PartnerServiceStage;
	dependencies?: any[];
	platforms?: PartnerServicePlatforms[];
	timeout?: number;
}

export function Service(options: PartnerServiceOptions) {
	return DecoratorFunction.bind(options);
}

function isPromise(p) {
	return typeof p === 'object' && typeof p.then === 'function';
}

function isDecoratedService(p) {
	return typeof p === 'object' && isPromise(p.initialized);
}

function DecoratorFunction<T>(baseClass: T) {
	class Injectable extends (<Constructor<ServiceDecoredClass>>(<unknown>baseClass)) {
		options: PartnerServiceOptions;
		initializationTimeout;
		resolve: () => void;
		initialized: Promise<void> = new Promise<void>((resolve) => {
			this.resolve = resolve;
		});

		setInitialized(): void {
			this.resolve();
			clearTimeout(this.initializationTimeout);
		}

		async execute(): Promise<void> {
			console.log('DJ : Executing!');
			const maxInitializationTime = this.options?.timeout || context.get('options.maxDelayTimeout');
			if (this.options) {
				const deps = this.options.dependencies
					.map((dep) => (isPromise(dep) ? dep : isDecoratedService(dep) ? dep.initialized : null))
					.filter((dep) => dep);
				Promise.race([
					new Promise((res) => setTimeout(res, maxInitializationTime)),
					Promise.all(deps),
				]).then(async () => {
					await this.call();
					this.setInitialized();
				});
			} else {
				this.initializationTimeout = setTimeout(() => {
					this.setInitialized();
				}, maxInitializationTime);
				await this.call();
				this.setInitialized();
			}
		}
	}

	Injectable.prototype.options = this;
	console.log('DJ: test launch');
	return (<Constructor<T>>(<unknown>Injectable)) as unknown as T;
}
