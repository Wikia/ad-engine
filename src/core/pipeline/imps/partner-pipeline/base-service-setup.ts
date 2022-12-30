import { Injectable } from '@wikia/dependency-injection';
import { context } from '../../../services';
import {
	PartnerInitializationProcess,
	PartnerInitializationProcessOptions,
} from './partner-pipeline-types';

@Injectable()
export class BaseServiceSetup implements PartnerInitializationProcess {
	options: PartnerInitializationProcessOptions;
	initializationTimeout;
	resolve: () => void;
	initialized: Promise<void> = new Promise<void>((resolve) => {
		this.resolve = resolve;
	});

	private getContextVariablesValue(contextVariables: string | string[]): boolean {
		if (typeof contextVariables === 'string') {
			return context.get(contextVariables);
		} else {
			return contextVariables
				.map((contextVariable) => context.get(contextVariable))
				.reduce((previousValue, currentValue) => previousValue && currentValue, true);
		}
	}

	public isEnabled(contextVariables: string | string[], trackingRequired = true): boolean {
		const contextVariablesValue = this.getContextVariablesValue(contextVariables);

		if (trackingRequired) {
			return (
				contextVariablesValue &&
				context.get('options.trackingOptIn') &&
				!context.get('options.optOutSale') &&
				!context.get('wiki.targeting.directedAtChildren')
			);
		}

		return contextVariablesValue;
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
