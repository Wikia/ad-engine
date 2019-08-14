import { context, utils } from '@wikia/ad-engine';

const REC_SRC = 'gamepedia-rec';
const logGroup = 'bab-detection';

class BabDetection {
	private delayPromise = null;
	private detectionCompleted = false;
	private resolvePromise = null;
	/**
	 * Returns module name
	 */
	getName(): string {
		return logGroup;
	}

	/**
	 * Creates and returns delay promise if available
	 */
	getPromise(): Promise<void> {
		if (this.detectionCompleted) {
			return Promise.resolve();
		}

		if (this.delayPromise === null) {
			this.delayPromise = new Promise((resolve) => {
				this.resolvePromise = resolve;
			});
		}

		return this.delayPromise;
	}

	/**
	 * Checks whether WAD detection is positive
	 */
	isBlocking(): boolean | undefined {
		if (window.ads && window.ads.runtime && window.ads.runtime.bab) {
			return window.ads.runtime.bab.blocking;
		}

		return undefined;
	}

	/**
	 * Checks whether module is enabled via Instant Global
	 */
	isEnabled(): boolean {
		return context.get('options.wad.enabled');
	}

	/**
	 * Starts WAD rec detection
	 */
	async run(): Promise<boolean> {
		if (this.isEnabled()) {
			const isBabDetected: boolean = await utils.client.checkBlocking();

			utils.logger(logGroup, 'BAB detection, AB detected:', isBabDetected);

			this.setRuntimeParams(isBabDetected);
			this.updateSrcParameter(isBabDetected);
			this.dispatchDetectionEvent(isBabDetected);
			this.markAsReady();

			return isBabDetected;
		}
	}

	/**
	 * Marks detection as completed and resolves delay promise
	 */
	private markAsReady(): void {
		this.detectionCompleted = true;

		if (this.resolvePromise) {
			this.resolvePromise();
			this.resolvePromise = null;
		}
	}

	/**
	 * Updates global window WAD detection params
	 */
	private setRuntimeParams(isBabDetected: boolean): void {
		window.ads.runtime = window.ads.runtime || ({} as any);
		window.ads.runtime.bab = window.ads.runtime.bab || {};
		window.ads.runtime.bab.blocking = isBabDetected;

		context.set('options.wad.blocking', isBabDetected);
	}

	/**
	 * Updates application src value
	 */
	private updateSrcParameter(isBabDetected: boolean): void {
		if (isBabDetected) {
			context.set('src', REC_SRC);
		}
	}

	/**
	 * Creates and dispatches WAD result event on document object
	 */
	private dispatchDetectionEvent(isBabDetected: boolean): void {
		const event = document.createEvent('Event');
		const name = isBabDetected ? 'bab.blocking' : 'bab.not_blocking';

		event.initEvent(name, true, false);
		document.dispatchEvent(event);
	}
}

/**
 * Holds AdEngine run until AB detection is completed
 */
export const babDetection = new BabDetection();
