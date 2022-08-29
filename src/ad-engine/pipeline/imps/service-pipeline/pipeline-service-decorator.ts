import { ServiceStage } from './service-pipeline-types';
import { context } from '../../../services';

interface Constructor<T> {
	new (...args): T;
}

export interface PipelineDecoredService {
	call?: () => Promise<void> | void;
	options?: PipelineServiceOptions;
}

interface PipelineServiceOptions {
	stage: ServiceStage;
	dependencies?: any[];
	timeout?: number;
}

export function Service(options: PipelineServiceOptions) {
	return DecoratorFunction.bind(options);
}

function isPromise(p) {
	return typeof p === 'object' && typeof p.then === 'function';
}

function isDecoratedService(p) {
	return typeof p === 'object' && isPromise(p.initialized);
}

function DecoratorFunction<T>(baseClass: T) {
	class Injectable extends (<Constructor<PipelineDecoredService>>(<unknown>baseClass)) {
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
			const maxInitializationTime = this.options?.timeout || context.get('options.maxDelayTimeout');
			if (this.options.dependencies) {
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
	return (<Constructor<T>>(<unknown>Injectable)) as unknown as T;
}
