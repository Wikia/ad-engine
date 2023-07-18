import { BaseServiceSetup, utils } from '@ad-engine/core';

export class CoppaSetup extends BaseServiceSetup {
	call() {
		return window.ie.getCoppaStatus().then(() => {
			utils.logger('coppa', 'COPPA status read');
		});
	}
}
