import { logger } from '../utils';
import { Inhibitor } from './inhibitor';

export class Runner {
	constructor(
		private inhibitors: Inhibitor[] = [],
		private timeout = 0,
		private logGroup = 'runner',
	) {}

	async run(callback: () => void): Promise<void> {
		await Promise.race([this.getEnabledInhibitorsPromise(), this.getTimeoutPromise()]);

		logger(this.logGroup, 'Ready');

		callback();
	}

	private getTimeoutPromise(): Promise<void> {
		if (this.timeout === 0) {
			logger(this.logGroup, 'Running without delay (timeout is not set)');

			return Promise.resolve();
		}

		logger(this.logGroup, `Configured ${this.timeout}ms timeout`);

		return new Promise<void>((resolve) => setTimeout(resolve, this.timeout));
	}

	private getEnabledInhibitorsPromise(): Promise<void | void[]> {
		const enabledInhibitors = this.inhibitors.filter((inhibitor) => inhibitor.isEnabled());

		console.warn('runner', enabledInhibitors);
		if (!enabledInhibitors.length) {
			logger(this.logGroup, 'Running without delay (there are no inhibitors)');

			return Promise.resolve();
		}

		logger(this.logGroup, `Will wait for ${enabledInhibitors.length} modules`);

		return Promise.all(
			enabledInhibitors.map((inhibitor) => {
				logger(this.logGroup, `Using ${inhibitor.getName()} inhibitor`);

				return inhibitor.getPromise();
			}),
		);
	}

	addInhibitor(inhibitor: Inhibitor) {
		this.inhibitors.push(inhibitor);
	}
}
