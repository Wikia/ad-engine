import { context, utils } from '@ad-engine/core';

export interface UserSignupPayload {
	email: string;
	onSuccess: () => void;
	onError: () => void;
}

const logGroup = 'sailthru';
const packageUrl = 'https://ak.sail-horizon.com/spm/spm.v1.min.js';
const ACCT_ID = 'c9322e218da57e71a4965ae18fecbefa';

class Sailthru {
	isLoaded(): boolean {
		return !!window.Sailthru;
	}

	isEnabled(): boolean {
		return context.get('services.sailthru.enabled');
	}

	init(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		if (!this.isLoaded()) {
			utils.logger(logGroup, 'loading');

			return utils.scriptLoader.loadScript(packageUrl).then(() => {
				window.Sailthru.init({ customerId: ACCT_ID });
				utils.logger(logGroup, 'ready');
			});
		}
	}

	userSignup({ email, onSuccess, onError }: UserSignupPayload, source: string): void {
		window.Sailthru.integration('userSignUp', {
			email,
			onSuccess,
			onError,
			source,
			vars: {
				email,
				sign_up_date: new Date().toISOString(),
			},
			lists: { 'Fandom Account Registration - MASTERLIST': 1 },
		});
	}
}

export const sailthru = new Sailthru();
