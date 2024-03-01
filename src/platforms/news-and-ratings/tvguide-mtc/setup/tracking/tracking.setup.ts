import { DataWarehouseTracker, trackingUrls } from '@platforms/shared';
import {
	adClickTracker,
	Apstag,
	communicationService,
	ctaTracker,
	Dictionary,
	eventsRepository,
	GAMOrigins,
	globalAction,
	InstantConfigCacheStorage,
	InstantConfigService,
	interventionTracker,
	porvataTracker,
	PostmessageTracker,
	targetingService,
	TrackingMessage,
	TrackingTarget,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';
import { AdSizeTracker } from '../../../../shared/tracking/ad-size-tracker';
import { LabradorTracker } from '../../../../shared/tracking/labrador-tracker';

const adClickedAction = globalAction('[AdEngine] Ad clicked', props<Dictionary>());

@Injectable()
export class TrackingSetup {
	constructor(
		private labradorTracker: LabradorTracker,
		private adSizeTracker: AdSizeTracker,
		private dwTracker: DataWarehouseTracker,
		private instantConfig: InstantConfigService = null,
	) {}

	execute(): void {
		this.porvataTracker();
		this.postmessageTrackingTracker();
		this.experimentGroupsTracker();
		this.interventionTracker();
		this.adClickTracker();
		this.ctaTracker();
		this.identityTracker();
		this.googleTopicsTracker();
		this.adSizeTracker.init();
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

	private porvataTracker(): void {
		communicationService.on(
			eventsRepository.VIDEO_PLAYER_TRACKING,
			({ eventInfo }) => {
				this.dwTracker.track(eventInfo, trackingUrls.AD_ENG_PLAYER_INFO);
			},
			false,
		);

		porvataTracker.register();
	}

	// candidate to remove
	private ctaTracker(): void {
		ctaTracker.register(({ data }: Dictionary) => {
			this.dwTracker.track(data, trackingUrls.AD_ENG_AD_INFO);
		});
	}

	// candidate to remove
	private adClickTracker(): void {
		adClickTracker.register(({ data }: Dictionary) => {
			// event listeners might be outside AdEngine, f.e. in the SilverSurfer interactions module
			communicationService.dispatch(adClickedAction(data));
			this.dwTracker.track(data, trackingUrls.AD_ENG_AD_INFO);
		});
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

	// candidate to remove
	private interventionTracker(): void {
		interventionTracker.register();
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
