import { buildPromisedTimeout, logger } from '../utils';

export class Runner {
	private timeoutPromise: Promise<number> = null;

	constructor(
		private inhibitors: Promise<any>[] = [],
		private timeout = 0,
		private logGroup = 'runner',
	) {}

	async waitForInhibitors(): Promise<void> {
		await Promise.race([this.getInhibitorsPromise(), this.getTimeoutPromise()]);

		logger(this.logGroup, 'Ready');
	}

	private getTimeoutPromise(): Promise<number> {
		if (this.timeoutPromise === null) {
			if (this.timeout === 0) {
				logger(this.logGroup, 'Running without delay (timeout is not set)');

				this.timeoutPromise = Promise.resolve(0);
			} else {
				logger(this.logGroup, `Configured ${this.timeout}ms timeout`);

				this.timeoutPromise = buildPromisedTimeout(this.timeout).promise;
			}
		}

		return this.timeoutPromise;
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
