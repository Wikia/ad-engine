import { utils } from '@ad-engine/core';

const ACCT_ID = 'c9322e218da57e71a4965ae18fecbefa';
const logGroup = 'sailthru';
export const packageUrl = 'https://ak.sail-horizon.com/spm/spm.v1.min.js';

class Sailthru {
	call(): Promise<void> {
		utils.logger(logGroup, 'loading');

		window.Sailthru = window.Sailthru || {};

		return utils.scriptLoader.loadScript(packageUrl).then(() => {
			window.Sailthru.init({ customerId: ACCT_ID });
			utils.logger(logGroup, 'ready');
		});
	}
}

export const sailthru = new Sailthru();
