import {
	PartnerInitializationProcess,
	PartnerInitializationProcessOptions,
} from './partner-pipeline-types';
import { context } from '../../../services';

export class BaseServiceSetup implements PartnerInitializationProcess {
	options: PartnerInitializationProcessOptions;
	metadata: any;
	initializationTimeout;

	setMetadata(metadata: any) {
		this.metadata = metadata;
		return this;
	}

	setOptions(opt: PartnerInitializationProcessOptions): PartnerInitializationProcess {
		this.options = opt;
		return this;
	}

	res: () => void;

	setInitialized() {
		this.res();
		clearTimeout(this.initializationTimeout);
	}

	initialized = new Promise<void>((resolve) => {
		this.res = resolve;
	});

	async execute(): Promise<void> {
		const maxInitializationTime = this.options?.timeout || context.get('options.maxDelayTimeout');
		if (this.options) {
			Promise.race([
				new Promise((res) => setTimeout(res, maxInitializationTime)),
				Promise.all(this.options.dependencies),
			]).then(() => {
				this.initialize();
			});
		} else {
			this.initialize();
			this.initializationTimeout = setTimeout(this.setInitialized, maxInitializationTime);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	initialize() {}
}
