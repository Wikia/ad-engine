import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	context,
	DiProcess,
	GlobalContextCategories,
	globalContextService,
	targetingService,
	utils,
} from '@ad-engine/core';

export enum CmpType {
	ONE_TRUST = '1t',
	TRACKING_OPT_IN = 'toi',
}

export class IdentitySetup implements DiProcess {
	private logGroup = 'identity-setup';

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
				const pvUID = globalContextService.getValue('tracking', 'pvUID');
				if (pvUID) {
					targetingService.set('pvuid', pvUID);
				}

				targetingService.set(
					'browser',
					globalContextService.getValue(GlobalContextCategories.targeting, 'browser'),
				);
				targetingService.set(
					'cl',
					globalContextService.getValue(GlobalContextCategories.tracking, 'chromeLabel'),
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

				const topicsApiAvailable: number =
					'browsingTopics' in document &&
					'featurePolicy' in document &&
					// @ts-expect-error document.featurePolicy is not available in TS dom lib
					document.featurePolicy.allowsFeature('browsing-topics')
						? 1
						: 0;
				targetingService.set('topics_available', topicsApiAvailable.toString());

				const protectedAudienceApiAvailable: number =
					'joinAdInterestGroup' in navigator &&
					// @ts-expect-error document.featurePolicy is not available in TS dom lib
					document.featurePolicy.allowsFeature('join-ad-interest-group') &&
					// @ts-expect-error document.featurePolicy is not available in TS dom lib
					document.featurePolicy.allowsFeature('run-ad-auction')
						? 1
						: 0;
				targetingService.set('pa_available', protectedAudienceApiAvailable.toString());

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

	private getCmp(): CmpType {
		return window.OneTrust !== undefined ? CmpType.ONE_TRUST : CmpType.TRACKING_OPT_IN;
	}
}
