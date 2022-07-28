import {
	PartnerInitializationProcess,
	PartnerInitializationProcessOptions,
} from './partner-pipeline-types';

export class BaseServiceSetup implements PartnerInitializationProcess {
	options: PartnerInitializationProcessOptions;
	metadata: any;

	setMetadata(metadata: any) {
		this.metadata = metadata;
		return this;
	}

	setOptions(opt: PartnerInitializationProcessOptions): PartnerInitializationProcess {
		this.options = opt;
		return this;
	}

	res: () => void;

	initialized = new Promise<void>((resolve) => {
		this.res = resolve;
	});

	async execute(): Promise<void> {
		if (this.options) {
			Promise.race([
				new Promise((res) => setTimeout(res, this.options.timeout)),
				Promise.all(this.options.dependencies),
			]).then(() => {
				this.initialize();
			});
		} else {
			this.initialize();
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	initialize() {}
}
