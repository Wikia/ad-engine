import {
	BaseServiceSetup,
	context,
	globalContextService,
	targetingService,
	utils,
} from '@ad-engine/core';

export class IdentitySetup extends BaseServiceSetup {
	private logGroup = 'identity-setup';

	async call(): Promise<void> {
		utils.logger(this.logGroup, 'initialized');

		return this.identityEngineReady();
	}

	async identityEngineReady(): Promise<void> {
		return window.ie.isReady.then(() => {
			const ppid = globalContextService.getValue('tracking', 'ppid');
			if (ppid && !context.get('services.intentIq.ppid.enabled')) {
				targetingService.set('ppid', ppid);
			}

			if (context.get('services.identityPartners')) {
				const segments = globalContextService.getValue('targeting', 'AU_SEG');
				targetingService.set('AU_SEG', segments);
			}

			utils.logger(this.logGroup, 'ready');
		});
	}
}
