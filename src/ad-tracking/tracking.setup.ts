import { communicationService, eventsRepository } from '@ad-engine/communication';
import { InstantConfigCacheStorage, InstantConfigService, targetingService } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';

import { DataWarehouseTracker } from './data-warehouse';
import { LabradorTracker } from './trackers/labrador-tracker';
import { trackingUrls } from './tracking-urls';

@Injectable()
export class BaseTrackingSetup {
	constructor(
		protected labradorTracker: LabradorTracker,
		protected dwTracker: DataWarehouseTracker,
		protected instantConfig: InstantConfigService = null,
	) {}

	execute(): void {
		this.experimentGroupsTracker();
		this.keyValsTracker();
		this.googleTopicsTracker();
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
