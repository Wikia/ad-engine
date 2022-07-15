import {
	AdBidderContext,
	adClickTracker,
	AdInfoContext,
	bidderTracker,
	Binder,
	communicationService,
	context,
	ctaTracker,
	Dictionary,
	eventsRepository,
	FuncPipelineStep,
	GAMOrigins,
	globalAction,
	InstantConfigCacheStorage,
	interventionTracker,
	porvataTracker,
	PostmessageTracker,
	slotTracker,
	TrackingMessage,
	trackingPayloadValidationMiddleware,
	TrackingTarget,
	viewabilityPropertiesTrackingMiddleware,
	viewabilityTracker,
	viewabilityTrackingMiddleware,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { DataWarehouseTracker } from './data-warehouse';
import { PageTracker } from './page-tracker';
import { props } from 'ts-action';

const bidderTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengbidders';
const slotTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengadinfo';
const viewabilityUrl = 'https://beacon.wikia-services.com/__track/special/adengviewability';
const porvataUrl = 'https://beacon.wikia-services.com/__track/special/adengplayerinfo';
const identityTrackingUrl = 'https://beacon.wikia-services.com/__track/special/identityinfo';

const adClickedAction = globalAction('[AdEngine] Ad clicked', props<Dictionary>());

interface TrackingMiddlewares {
	slotTrackingMiddlewares?: FuncPipelineStep<AdInfoContext>[];
	bidderTrackingMiddlewares?: FuncPipelineStep<AdBidderContext>[];
}

@Injectable()
export class TrackingSetup {
	static provideMiddlewares(trackingMiddlewares: TrackingMiddlewares): Binder[] {
		return [
			{
				bind: 'slotTrackingMiddlewares',
				value: trackingMiddlewares['slotTrackingMiddlewares'] ?? [],
			},
			{
				bind: 'bidderTrackingMiddlewares',
				value: trackingMiddlewares['bidderTrackingMiddlewares'] ?? [],
			},
		];
	}

	constructor(
		private pageTracker: PageTracker,
		@Inject('slotTrackingMiddlewares')
		private slotTrackingMiddlewares: FuncPipelineStep<AdInfoContext>[],
		@Inject('bidderTrackingMiddlewares')
		private bidderTrackingMiddlewares: FuncPipelineStep<AdBidderContext>[],
	) {}

	execute(): void {
		this.porvataTracker();
		this.slotTracker();
		this.viewabilityTracker();
		this.bidderTracker();
		this.postmessageTrackingTracker();
		this.labradorTracker();
		this.loadTimeTracker();
		this.interventionTracker();
		this.adClickTracker();
		this.ctaTracker();
		this.identityTracker();
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
		if (this.slotTrackingMiddlewares.length === 0) {
			return;
		}

		const dataWarehouseTracker = new DataWarehouseTracker();

		slotTracker.onChangeStatusToTrack.push('top-conflict');
		slotTracker.add(...this.slotTrackingMiddlewares);
		slotTracker.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, slotTrackingUrl);

			return data;
		});
	}

	private viewabilityTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();

		viewabilityTracker
			.add(viewabilityTrackingMiddleware)
			.add(viewabilityPropertiesTrackingMiddleware)
			.register(({ data }: Dictionary) => {
				dataWarehouseTracker.track(data, viewabilityUrl);

				return data;
			});
	}

	private ctaTracker(): void {
		if (this.slotTrackingMiddlewares.length === 0) {
			return;
		}
		const dataWarehouseTracker = new DataWarehouseTracker();

		ctaTracker.add(...this.slotTrackingMiddlewares);
		ctaTracker.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, slotTrackingUrl);

			return data;
		});
	}

	private adClickTracker(): void {
		if (this.slotTrackingMiddlewares.length === 0) {
			return;
		}
		const dataWarehouseTracker = new DataWarehouseTracker();

		adClickTracker.add(...this.slotTrackingMiddlewares);
		adClickTracker.register(({ data }: Dictionary) => {
			// event listeners might be outside of AdEngine, f.e. in the SilverSurfer interactions module
			communicationService.dispatch(adClickedAction(data));
			dataWarehouseTracker.track(data, slotTrackingUrl);
			return data;
		});
	}

	private bidderTracker(): void {
		if (this.bidderTrackingMiddlewares.length === 0) {
			return;
		}

		const dataWarehouseTracker = new DataWarehouseTracker();

		bidderTracker.add(...this.bidderTrackingMiddlewares).register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, bidderTrackingUrl);

			return data;
		});

		communicationService.on(eventsRepository.BIDDERS_BIDS_CALLED, () => {
			this.pageTracker.trackProp('load_time_prebidAuctionStarted', Date.now().toString());
		});

		communicationService.on(eventsRepository.BIDDERS_INIT_STAGE_DONE, () => {
			this.pageTracker.trackProp('load_time_prebidAuctionEnded', Date.now().toString());
		});
	}

	private postmessageTrackingTracker(): void {
		const postmessageTracker = new PostmessageTracker(['payload', 'target']);

		postmessageTracker.add(trackingPayloadValidationMiddleware).register<TrackingMessage>(
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

	private labradorTracker(): void {
		const cacheStorage = InstantConfigCacheStorage.make();
		const labradorPropValue = cacheStorage.getSamplingResults().join(';');

		if (labradorPropValue) {
			this.pageTracker.trackProp('labrador', labradorPropValue);
		}
	}

	private loadTimeTracker(): void {
		const trackerConfig = context.get('options.loadTimeTracking');

		if (!trackerConfig || !trackerConfig.enabled) {
			return;
		}

		(trackerConfig.timing || []).forEach((moment) => {
			this.pageTracker.trackProp(`load_time_${moment}`, window.performance.timing[moment]);
		});

		if (trackerConfig?.custom?.includes('aeConfigured')) {
			communicationService.on(eventsRepository.AD_ENGINE_CONFIGURED, () => {
				this.pageTracker.trackProp('load_time_aeConfigured', Date.now().toString());
			});
		}

		if (trackerConfig?.custom?.includes('aeStackStart')) {
			communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
				this.pageTracker.trackProp('load_time_aeStackStart', Date.now().toString());
			});
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
}
