import {
	PartnerInitializationProcess,
	PartnerInitializationProcessOptions,
} from '@wikia/ad-engine';

class ExampleSlowServiceSetup implements PartnerInitializationProcess {
	private options: PartnerInitializationProcessOptions;

	setOptions(opt: PartnerInitializationProcessOptions): PartnerInitializationProcess {
		this.options = opt;
		return this;
	}

	res: () => void;
	initialized = new Promise<void>((resolve) => {
		this.res = resolve;
	});

	async execute(): Promise<void> {
		await setTimeout(() => {
			if (this.options) {
				Promise.race([
					setTimeout(() => {
						this.res();
					}, this.options.timeout),
					Promise.all([...this.options.dependencies]),
				]).then(() => {
					console.log('DJ: Initialized slow service with dependencies');
					this.initialize();
				});
			} else {
				console.log('DJ: Initialized slow service');
				this.initialize();
			}
		}, 5000);
	}

	initialize() {
		this.res();
	}
}

export const exampleSlowServiceSetup = new ExampleSlowServiceSetup();
