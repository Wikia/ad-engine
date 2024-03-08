import {
	communicationService,
	eventsRepository,
	InstantConfigCacheStorage,
	InstantConfigService,
	targetingService,
	trackingUrls,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { DataWarehouseTracker } from './data-warehouse';
import { LabradorTracker } from './labrador-tracker';

@Injectable()
export class UcpNoAdsTrackingSetup {
	constructor(
		private labradorTracker: LabradorTracker,
		private dwTracker: DataWarehouseTracker,
		private instantConfig: InstantConfigService = null,
	) {}

	execute(): void {
		this.experimentGroupsTracker();
		this.identityTracker();
		this.keyValsTracker();
		this.googleTopicsTracker();
	}

	private identityTracker(): void {
		if (!this.instantConfig.get('icIdentityPartners', false)) {
			communicationService.on(
				eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
				(eventInfo) => {
					const { partnerName, partnerIdentityId } = eventInfo.payload;
					this.dwTracker.track(
						{
							partner_name: partnerName,
							partner_identity_id: partnerIdentityId,
						},
						trackingUrls.IDENTITY_INFO,
					);
				},
				false,
			);
		}
	}

	private experimentGroupsTracker(): void {
		const cacheStorage = InstantConfigCacheStorage.make();
		const experimentsGroups = [
			...cacheStorage.getSamplingResults(),
			...(targetingService.get('experiment_groups') || []),
		].join(';');

		if (experimentsGroups) {
			this.labradorTracker.track(experimentsGroups);
		}
		communicationService.on(eventsRepository.INTENT_IQ_GROUP_OBTAINED, ({ abTestGroup }) => {
			this.labradorTracker.track(`intentIQ_${abTestGroup}`);
		});
	}

	private keyValsTracker(): void {
		const keyVals = { ...targetingService.dump() };

		// Remove Audigent segments
		delete keyVals.AU_SEG;

		this.dwTracker.track(
			{
				keyvals: JSON.stringify(keyVals),
			},
			trackingUrls.KEY_VALS,
		);
	}

	private async googleTopicsTracker(): Promise<void> {
		if (targetingService.get('topics_available') !== '1') {
			return;
		}

		// @ts-expect-error Google Topics API is not available in TS dom lib
		const topics: unknown[] = await document.browsingTopics({ skipObservation: true });
		this.dwTracker.track(
			{
				ppid: targetingService.get('ppid'),
				topic: JSON.stringify(topics),
			},
			trackingUrls.TOPICS,
		);
	}
}
