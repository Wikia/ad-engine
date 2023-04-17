type Condition = () => boolean;

export class WaitFor {
	private timeoutId: number;

	constructor(
		private condition: Condition,
		private noTries: number = 100,
		private growingTimeout: number = 0,
		private fixedTimeout: number = 0,
	) {}

	async until(): Promise<boolean> {
		let iteration = 0;
		let timeout = this.growingTimeout || this.fixedTimeout;
		let result = this.condition();

		while (!result && iteration < this.noTries) {
			await this.delay(timeout);
			result = this.condition();

			if (this.growingTimeout) {
				timeout *= 2;
			}

			iteration++;
		}

		return Promise.resolve(result);
	}

	private delay(timeout: number): Promise<Condition> {
		return new Promise((resolve) => {
			this.timeoutId = setTimeout(resolve, timeout);
		});
	}

	public reset() {
		if (this.timeoutId) {
			window.clearTimeout(this.timeoutId);
		}
	}
}
