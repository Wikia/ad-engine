import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	context,
	DiProcess,
	GlobalContextCategories,
	globalContextService,
	targetingService,
	utils,
} from '@ad-engine/core';

export class IdentitySetup implements DiProcess {
	private logGroup = 'identity-setup';
	private CMP_TYPE = {
		ONE_TRUST: '1t',
		TRACKING_OPT_IN: 'toi',
	};

	async execute(): Promise<void> {
		utils.logger(this.logGroup, 'initialized');

		await this.identityEngineReady();
		this.setupOver18Targeting();
		return Promise.resolve();
	}

	async identityEngineReady(): Promise<void> {
		return new Promise<void>((resolve) => {
			communicationService.on(eventsRepository.IDENTITY_ENGINE_READY, () => {
				const ppid = globalContextService.getValue('tracking', 'ppid');
				if (ppid) {
					targetingService.set('ppid', ppid);
				}

				targetingService.set(
					'browser',
					globalContextService.getValue(GlobalContextCategories.targeting, 'browser'),
				);
				const adGroups = globalContextService.getValue(
					GlobalContextCategories.targeting,
					'adGroup',
				) as string;
				targetingService.set('adGroup', adGroups?.split(',') || []);

				if (context.get('services.identityPartners')) {
					const segments = globalContextService.getValue(
						GlobalContextCategories.targeting,
						'AU_SEG',
					);
					targetingService.set('AU_SEG', segments);
				}

				const isDirectedAtChildren = globalContextService.getValue(
					GlobalContextCategories.site,
					'directedAtChildren',
				);
				if (isDirectedAtChildren) {
					targetingService.set('monetization', utils.isCoppaSubject() ? 'restricted' : 'regular');
				}

				// TODO: Remove once OneTrust replaces Tracking Opt In
				targetingService.set('cmp', this.getCmp());

				utils.logger(this.logGroup, 'ready');
				resolve();
			});
		});
	}

	setupOver18Targeting(): void {
		communicationService.on(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, () => {
			const over18 = window.fandomContext.tracking.over_18;

			if (over18) {
				targetingService.set('over_18', over18);
			}
		});
	}

	private getCmp(): string {
		return window.OneTrust !== undefined ? this.CMP_TYPE.ONE_TRUST : this.CMP_TYPE.TRACKING_OPT_IN;
	}
}
