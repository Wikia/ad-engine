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
	interventionTracker,
	porvataTracker,
	PostmessageTracker,
	slotTracker,
	targetingService,
	TrackingMessage,
	TrackingTarget,
	viewabilityTracker,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';
import { trackingUrls } from '../setup/tracking-urls';
import { AdSizeTracker } from './ad-size-tracker';
import { DataWarehouseTracker } from './data-warehouse';
import { LabradorTracker } from './labrador-tracker';

const adClickedAction = globalAction('[AdEngine] Ad clicked', props<Dictionary>());

@Injectable()
export class TrackingSetup {
	constructor(
		private labradorTracker: LabradorTracker,
		private adSizeTracker: AdSizeTracker,
		private dwTracker: DataWarehouseTracker,
		private bidders: Bidders,
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
		this.keyValsTracker();
		this.adSizeTracker.init();
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
		const labradorPropValue = cacheStorage.getSamplingResults().join(';');

		if (labradorPropValue) {
			this.labradorTracker.track(labradorPropValue);
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
