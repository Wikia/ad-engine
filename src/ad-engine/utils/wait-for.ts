type Condition = () => boolean;

export class WaitFor {
	constructor(
		private condition: Condition,
		private noTries: number,
		private initialTimeoutMs: number,
	) {}

	async until(): Promise<boolean> {
		let result = this.condition();
		let timeout = this.initialTimeoutMs;
		let iteration = 0;

		while (!result && iteration < this.noTries) {
			await this.delay(timeout);
			result = this.condition();
			timeout *= 2;
			iteration++;
		}
		return Promise.resolve(result);
	}

	private delay(timeout: number): Promise<Condition> {
		return new Promise((resolve) => setTimeout(resolve, timeout));
	}
}
