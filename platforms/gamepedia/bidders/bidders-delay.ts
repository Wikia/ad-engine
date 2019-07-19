import { bidders, context } from '@wikia/ad-engine';

const logGroup = 'bidders-delay';

let delayPromise = null;
let resolvePromise;

export const biddersDelay = {
	isEnabled(): boolean {
		return context.get('bidders.enabled');
	},

	getName(): string {
		return logGroup;
	},

	getPromise(): Promise<void> {
		if (delayPromise === null) {
			delayPromise = new Promise((resolve) => {
				resolvePromise = resolve;
			});
		}

		return delayPromise;
	},

	markAsReady(): void {
		if (bidders.hasAllResponses()) {
			if (resolvePromise) {
				resolvePromise();
				resolvePromise = null;
			}
		}
	},
};
