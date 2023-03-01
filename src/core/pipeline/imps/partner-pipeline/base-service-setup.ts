import { Injectable } from '@wikia/dependency-injection';
import { context, InstantConfigService } from '../../../services';
import {
	PartnerInitializationProcess,
	PartnerInitializationProcessOptions,
} from './partner-pipeline-types';

@Injectable()
export class BaseServiceSetup implements PartnerInitializationProcess {
	options: PartnerInitializationProcessOptions;
	initializationTimeout;
	resolve: () => void;
	initialized: Promise<void>;

	constructor(protected instantConfig: InstantConfigService = null) {
		this.resetInitialized();
	}

	private getContextVariablesValue(contextVariables: string | string[]): boolean {
		if (typeof contextVariables === 'string') {
			return context.get(contextVariables);
		} else {
			return contextVariables
				.map((contextVariable) => context.get(contextVariable))
				.reduce((previousValue, currentValue) => previousValue && currentValue, true);
		}
	}

	public isEnabled(configVariable: string | string[], trackingRequired = true): boolean {
		const variableValue =
			typeof configVariable === 'string' && configVariable.startsWith('ic')
				? (this.instantConfig.get(configVariable) as boolean)
				: this.getContextVariablesValue(configVariable);

		if (trackingRequired) {
			return (
				variableValue &&
				context.get('options.trackingOptIn') &&
				!context.get('options.optOutSale') &&
				!context.get('wiki.targeting.directedAtChildren')
			);
		}

		return variableValue;
	}

	setOptions(opt: PartnerInitializationProcessOptions): PartnerInitializationProcess {
		this.options = opt;
		return this;
	}

	setInitialized(): void {
		this.resolve();
		clearTimeout(this.initializationTimeout);
	}

	public resetInitialized(): void {
		this.initialized = new Promise<void>((resolve) => {
			this.resolve = resolve;
		});
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
