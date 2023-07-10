import {
	adClickTracker,
	Bidders,
	bidderTracker,
	communicationService,
	context,
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
	slotTracker,
	targetingService,
	TrackingMessage,
	TrackingTarget,
	viewabilityTracker,
} from '@wikia/ad-engine';
import { props } from 'ts-action';
import { injectable } from 'tsyringe';
import { trackingUrls } from '../setup/tracking-urls';
import { AdSizeTracker } from './ad-size-tracker';
import { DataWarehouseTracker } from './data-warehouse';
import { LabradorTracker } from './labrador-tracker';

const adClickedAction = globalAction('[AdEngine] Ad clicked', props<Dictionary>());

@injectable()
export class TrackingSetup {
	constructor(
		private labradorTracker: LabradorTracker,
		private adSizeTracker: AdSizeTracker,
		private dwTracker: DataWarehouseTracker,
		private bidders: Bidders,
		private instantConfig: InstantConfigService = null,
	) {}

	execute(): void {
		this.porvataTracker();
		this.slotTracker();
		this.viewabilityTracker();
		this.bidderTracker();
		this.postmessageTrackingTracker();
		this.experimentGroupsTracker();
		this.interventionTracker();
		this.adClickTracker();
		this.ctaTracker();
		this.identityTracker();
		this.keyValsTracker();
		this.adSizeTracker.init();
	}

	private identityTracker(): void {
		if (!this.instantConfig.get('icIdentityPartners', false)) {
			communicationService.on(
				eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
				(eventInfo) => {
					this.dwTracker.track(
						{
							partner_name: eventInfo.payload.partnerName,
							partner_identity_id: eventInfo.payload.partnerIdentityId,
						},
						trackingUrls.IDENTITY_INFO,
					);
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

	private slotTracker(): void {
		let withBidders = null;

		if (context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled')) {
			withBidders = this.bidders;
		}

		slotTracker.onChangeStatusToTrack.push('top-conflict');
		slotTracker.register(
			({ data }: Dictionary) => {
				this.dwTracker.track(data, trackingUrls.AD_ENG_AD_INFO);
			},
			{ bidders: withBidders },
		);
	}

	private viewabilityTracker(): void {
		viewabilityTracker.register(({ data }: Dictionary) => {
			this.dwTracker.track(data, trackingUrls.AD_ENG_VIEWABILITY);

			return data;
		});
	}

	private ctaTracker(): void {
		ctaTracker.register(({ data }: Dictionary) => {
			this.dwTracker.track(data, trackingUrls.AD_ENG_AD_INFO);
		});
	}

	private adClickTracker(): void {
		adClickTracker.register(({ data }: Dictionary) => {
			// event listeners might be outside of AdEngine, f.e. in the SilverSurfer interactions module
			communicationService.dispatch(adClickedAction(data));
			this.dwTracker.track(data, trackingUrls.AD_ENG_AD_INFO);
		});
	}

	private bidderTracker(): void {
		if (!context.get('bidders.prebid.enabled') && !context.get('bidders.a9.enabled')) {
			return;
		}

		bidderTracker.register(({ data }: Dictionary) => {
			this.dwTracker.track(data, trackingUrls.AD_ENG_BIDDERS);
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

	private interventionTracker(): void {
		interventionTracker.register();
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
}
