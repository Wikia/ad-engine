import { Injectable } from '@wikia/dependency-injection';
import { context, InstantConfigService } from '../../../services';
import { isCoppaSubject } from '../../../utils';
import { globalTimeout } from '../../../utils/global-timeout';
import {
	PartnerInitializationProcess,
	PartnerInitializationProcessOptions,
} from './partner-pipeline-types';

@Injectable()
export class BaseServiceSetup implements PartnerInitializationProcess {
	options: PartnerInitializationProcessOptions;
	resolve: () => void;
	initialized: Promise<void>;
	private initializationTimeout: Promise<void>;

	constructor(protected instantConfig: InstantConfigService = null) {
		this.resetInitialized();
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
				!isCoppaSubject()
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
		// const maxInitializationTime = this.options?.timeout;
		this.initializationTimeout = this.getTimeoutPromise();

		if (this.options?.dependencies) {
			Promise.race([this.initializationTimeout, Promise.all(this.options.dependencies)]).then(
				async () => {
					await this.call();
					this.setInitialized();
				},
			);
		} else {
			this.initializationTimeout.then(() => {
				this.setInitialized();
			});
			await this.call();
			this.setInitialized();
		}
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

	private getTimeoutPromise(): Promise<void> {
		return this.options?.timeout
			? new Promise((resolve) => {
					setTimeout(resolve, this.options.timeout);
			  })
			: globalTimeout.get('partner-pipeline');
	}
}
