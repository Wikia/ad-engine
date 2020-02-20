import { buildPromisedTimeout, logger } from '../utils';

export class Runner {
	constructor(
		private inhibitors: Promise<any>[] = [],
		private timeout = 0,
		private logGroup = 'runner',
	) {}

	async run(callback: () => void): Promise<void> {
		await Promise.race([this.getInhibitorsPromise(), this.getTimeoutPromise()]);

		logger(this.logGroup, 'Ready');

		callback();
	}

	private getTimeoutPromise(): Promise<void | number> {
		if (this.timeout === 0) {
			logger(this.logGroup, 'Running without delay (timeout is not set)');

			return Promise.resolve();
		}

		logger(this.logGroup, `Configured ${this.timeout}ms timeout`);

		return buildPromisedTimeout(this.timeout).promise;
	}

	private getInhibitorsPromise(): Promise<void | void[]> {
		if (!this.inhibitors.length) {
			logger(this.logGroup, 'Running without delay (there are no inhibitors)');

			return Promise.resolve();
		}

		logger(this.logGroup, `Will wait for ${this.inhibitors.length} modules`);

		return Promise.all(this.inhibitors);
	}
}
