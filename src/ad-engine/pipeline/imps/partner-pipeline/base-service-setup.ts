import {
	PartnerInitializationProcess,
	PartnerInitializationProcessOptions,
} from './partner-pipeline-types';
import { context } from '../../../services';

export class BaseServiceSetup implements PartnerInitializationProcess {
	options: PartnerInitializationProcessOptions;
	initializationTimeout;
	resolve: () => void;
	initialized: Promise<void> = new Promise<void>((resolve) => {
		this.resolve = resolve;
	});

	setOptions(opt: PartnerInitializationProcessOptions): this {
		this.options = opt;
		return this;
	}

	setInitialized(): void {
		this.resolve();
		clearTimeout(this.initializationTimeout);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	call(): void | Promise<any> {}

	async execute(): Promise<void> {
		const maxInitializationTime = this.options?.timeout || context.get('options.maxDelayTimeout');
		if (this.options) {
			Promise.race([
				new Promise((res) => setTimeout(res, maxInitializationTime)),
				Promise.all(this.options.dependencies),
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
