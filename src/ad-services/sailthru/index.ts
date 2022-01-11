import { context, utils } from '@ad-engine/core';

export interface UserSignupPayload {
	email: string;
	onSuccess: () => void;
	onError: () => void;
}

type SailthruSource = 'adengine_in_content_ad';

const logGroup = 'sailthru';
const packageUrl = 'https://ak.sail-horizon.com/spm/spm.v1.min.js';
const ACCT_ID = 'c9322e218da57e71a4965ae18fecbefa';

class Sailthru {
	init(): Promise<void> {
		if (!context.get('services.sailthru.enabled')) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		if (!window.Sailthru) {
			utils.logger(logGroup, 'loading');

			return utils.scriptLoader.loadScript(packageUrl).then(() => {
				window.Sailthru.init({ customerId: ACCT_ID });
				utils.logger(logGroup, 'ready');
			});
		}
	}

	userSignup({ email, onSuccess, onError }: UserSignupPayload, source: SailthruSource): void {
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
