import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	GAMOrigins,
	InstantConfigCacheStorage,
	InstantConfigService,
	targetingService,
} from '@ad-engine/core';
import { PostmessageTracker, TrackingMessage, TrackingTarget } from '@ad-engine/tracking';
import { Apstag } from '@wikia/ad-bidders';
import { Injectable } from '@wikia/dependency-injection';
import { trackingUrls } from '../setup/tracking-urls';
import { DataWarehouseTracker } from './data-warehouse';
import { LabradorTracker } from './labrador-tracker';

@Injectable()
export class TrackingSetup {
	constructor(
		private labradorTracker: LabradorTracker,
		private dwTracker: DataWarehouseTracker,
		private instantConfig: InstantConfigService = null,
	) {}

	execute(): void {
		this.postmessageTrackingTracker();
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

					if (['liveConnect', 'MediaWiki-sha256'].includes(partnerName)) {
						const apstag = Apstag.make();
						apstag.init().then(() => apstag.sendHEM(partnerIdentityId));
					}
				},
				false,
			);
		}
	}

	private postmessageTrackingTracker(): void {
		const postmessageTracker = new PostmessageTracker(['payload', 'target']);

		postmessageTracker.register<TrackingMessage>(
			async (message) => {
				const { target, payload } = message;

				switch (target) {
					case TrackingTarget.GoogleAnalytics: {
						window.ga(
							'tracker1.send',
							'event',
							payload.category,
							payload.action,
							payload.label,
							typeof payload.value === 'number' ? payload.value.toString() : payload.value,
						);
						break;
					}
					case TrackingTarget.DataWarehouse: {
						this.dwTracker.track(payload);
						break;
					}
					default:
						break;
				}

				return message;
			},
			[window.origin, ...GAMOrigins],
		);
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
		const topicsApiSupported =
			'browsingTopics' in document &&
			'featurePolicy' in document &&
			// @ts-expect-error document.featurePolicy is not available in TS dom lib
			document.featurePolicy.allowsFeature('browsing-topics');

		if (!topicsApiSupported) {
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
