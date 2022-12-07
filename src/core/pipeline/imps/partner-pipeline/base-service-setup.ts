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

	isEnabled(contextVariable: string): boolean {
		return (
			context.get(contextVariable) &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	setOptions(opt: PartnerInitializationProcessOptions): PartnerInitializationProcess {
		this.options = opt;
		return this;
	}

	setInitialized(): void {
		this.resolve();
		clearTimeout(this.initializationTimeout);
	}

	getDelayTimeoutInMs(): number {
		return context.get('options.maxDelayTimeout');
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	call(): void | Promise<any> {}

	async execute(): Promise<void> {
		const maxInitializationTime = this.options?.timeout || this.getDelayTimeoutInMs();

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
