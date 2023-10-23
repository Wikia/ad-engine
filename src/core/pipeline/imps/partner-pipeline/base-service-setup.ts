import { Injectable } from '@wikia/dependency-injection';
import { context, InstantConfigService } from '../../../services';
import { isCoppaSubject, logger, WaitFor } from '../../../utils';
import { GlobalTimeout } from '../../../utils/global-timeout';
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

	constructor(
		protected readonly instantConfig: InstantConfigService = null,
		protected readonly globalTimeout: GlobalTimeout = null,
	) {
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

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	call(): void | Promise<any> {}

	async execute(): Promise<void> {
		this.initializationTimeout = this.getTimeoutPromise();
		this.initializationTimeout.then(() => {
			this.setInitialized();
			if (!this.initialized) {
				logger('base-service-setup', 'timeout reached');
			}
		});
		if (this.options?.dependencies) {
			await Promise.all(this.options.dependencies);
		}
		await this.call();
		this.setInitialized();
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
		if (this.options?.timeout) {
			return new Promise((resolve) => {
				setTimeout(resolve, this.options.timeout);
			});
		} else {
			// This WaitFor is necessary to ensure proper injection to BaseServiceSetup.
			return new WaitFor(() => !!this.globalTimeout).until().then(() => {
				return (
					this.globalTimeout?.get?.('partner-pipeline') ||
					this.globalTimeout['partner-pipeline'] ||
					Promise.resolve()
				);
			});
		}
	}
}
