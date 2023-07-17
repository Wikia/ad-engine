import { BaseServiceSetup } from '@ad-engine/core';

export class CoppaSetup extends BaseServiceSetup {
	call() {
		return window.ie.getCoppaStatus();
	}
}
