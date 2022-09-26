import {
	adClickTracker,
	bidders,
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
	TrackingMessage,
	TrackingTarget,
	viewabilityTracker,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { DataWarehouseTracker } from './data-warehouse';
import { AdSizeTracker } from './ad-size-tracker';
import { LabradorTracker } from './labrador-tracker';
import { props } from 'ts-action';

const bidderTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengbidders';
const slotTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengadinfo';
const viewabilityUrl = 'https://beacon.wikia-services.com/__track/special/adengviewability';
const porvataUrl = 'https://beacon.wikia-services.com/__track/special/adengplayerinfo';
const identityTrackingUrl = 'https://beacon.wikia-services.com/__track/special/identityinfo';
const trackingKeyValsUrl = 'https://beacon.wikia-services.com/__track/special/keyvals';

const adClickedAction = globalAction('[AdEngine] Ad clicked', props<Dictionary>());

@Injectable()
export class TrackingSetup {
	constructor(private labradorTracker: LabradorTracker, private adSizeTracker: AdSizeTracker) {}

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

	private porvataTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();

		communicationService.on(
			eventsRepository.VIDEO_PLAYER_TRACKING,
			({ eventInfo }) => {
				dataWarehouseTracker.track(eventInfo, porvataUrl);
			},
			false,
		);

		porvataTracker.register();
	}

	private slotTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();
		let withBidders = null;

		if (context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled')) {
			withBidders = bidders;
		}

		slotTracker.onChangeStatusToTrack.push('top-conflict');
		slotTracker.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, slotTrackingUrl);
		}, withBidders);
	}

	private viewabilityTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();

		viewabilityTracker.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, viewabilityUrl);

			return data;
		});
	}

	private ctaTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();

		ctaTracker.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, slotTrackingUrl);
		});
	}

	private adClickTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();

		adClickTracker.register(({ data }: Dictionary) => {
			// event listeners might be outside of AdEngine, f.e. in the SilverSurfer interactions module
			communicationService.dispatch(adClickedAction(data));
			dataWarehouseTracker.track(data, slotTrackingUrl);
		});
	}

	private bidderTracker(): void {
		if (!context.get('bidders.prebid.enabled') && !context.get('bidders.a9.enabled')) {
			return;
		}

		const dataWarehouseTracker = new DataWarehouseTracker();

		bidderTracker.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, bidderTrackingUrl);
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
						const dataWarehouseTracker = new DataWarehouseTracker();
						dataWarehouseTracker.track(payload);
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

	private identityTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();

		communicationService.on(
			eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
			(eventInfo) => {
				dataWarehouseTracker.track(
					{
						partner_name: eventInfo.payload.partnerName,
						partner_identity_id: eventInfo.payload.partnerIdentityId,
					},
					identityTrackingUrl,
				);
			},
			false,
		);
	}

	private keyValsTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();
		const keyVals = { ...context.get('targeting') };

		// Remove Audigent segments
		delete keyVals.AU_SEG;

		dataWarehouseTracker.track(
			{
				keyvals: JSON.stringify(keyVals),
			},
			trackingKeyValsUrl,
		);
	}
}
