export abstract class Inhibitor {
	private delayPromise = null;
	private resolvePromise = null;

	abstract isEnabled(): boolean;
	abstract getName(): string;

	getPromise(): Promise<void> {
		if (this.delayPromise === null) {
			this.delayPromise = new Promise((resolve) => {
				this.resolvePromise = resolve;
			});
		}

		return this.delayPromise;
	}

	reset(): void {
		this.delayPromise = null;
		this.resolvePromise = null;
	}

	markAsReady(): void {
		if (this.resolvePromise) {
			this.resolvePromise();
			this.resolvePromise = null;
		}
	}
}
