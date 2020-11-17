import {
	AdBidderContext,
	AdInfoContext,
	atsIdsLoadedEvent,
	atsLoadedEvent,
	atsNotLoadedForLoggedInUser,
	audigentLoadedEvent,
	bidderTracker,
	Binder,
	communicationService,
	context,
	Dictionary,
	eventService,
	FuncPipelineStep,
	GAMOrigins,
	InstantConfigCacheStorage,
	interventionTracker,
	liveRampPrebidIdsLoadedEvent,
	ofType,
	playerEvents,
	porvataTracker,
	PostmessageTracker,
	ScrollSpeedCalculator,
	ScrollTracker,
	slotTracker,
	TrackingMessage,
	trackingPayloadValidationMiddleware,
	TrackingTarget,
	ViewabilityCounter,
	viewabilityPropertiesTrackingMiddleware,
	viewabilityTracker,
	viewabilityTrackingMiddleware,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { DataWarehouseTracker } from './data-warehouse';
import { PageTracker } from './page-tracker';

const bidderTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengbidders';
const slotTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengadinfo';
const viewabilityUrl = 'https://beacon.wikia-services.com/__track/special/adengviewability';
const porvataUrl = 'https://beacon.wikia-services.com/__track/special/adengplayerinfo';

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
		this.viewabilityCounterTracker();
		this.scrollSpeedTracker();
		this.connectionTracker();
		this.audigentTracker();
		this.liveRampTracker();
		this.atsTracker();
		this.interventionTracker();
	}

	private porvataTracker(): void {
		const dataWarehouseTracker = new DataWarehouseTracker();

		eventService.on(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, (data) => {
			dataWarehouseTracker.track(data, porvataUrl);
		});

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

	private bidderTracker(): void {
		if (this.bidderTrackingMiddlewares.length === 0) {
			return;
		}

		const dataWarehouseTracker = new DataWarehouseTracker();

		bidderTracker.add(...this.bidderTrackingMiddlewares).register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, bidderTrackingUrl);

			return data;
		});
	}

	private postmessageTrackingTracker(): void {
		const postmessageTracker = new PostmessageTracker(['payload', 'target']);

		postmessageTracker.add(trackingPayloadValidationMiddleware).register<TrackingMessage>(
			async (message) => {
				const { target, payload } = message;

				switch (target) {
					case TrackingTarget.GoogleAnalytics:
						window.ga(
							'tracker1.send',
							'event',
							payload.category,
							payload.action,
							payload.label,
							typeof payload.value === 'number' ? payload.value.toString() : payload.value,
						);
						break;
					case TrackingTarget.DataWarehouse:
						const dataWarehouseTracker = new DataWarehouseTracker();
						dataWarehouseTracker.track(payload);
						break;
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

	private viewabilityCounterTracker(): void {
		if (!context.get('options.viewabilityCounter.enabled')) {
			return;
		}

		const viewabilityCounter = ViewabilityCounter.make();

		this.pageTracker.trackProp('session_viewability_all', viewabilityCounter.getViewability());
		this.pageTracker.trackProp(
			'session_viewability_tb',
			viewabilityCounter.getViewability('top_boxad'),
		);
		this.pageTracker.trackProp(
			'session_viewability_icb',
			viewabilityCounter.getViewability('incontent_boxad'),
		);

		viewabilityCounter.init();
	}

	private scrollSpeedTracker(): void {
		if (!context.get('options.scrollSpeedTracking.enabled')) {
			return;
		}

		const scrollTracker = new ScrollTracker([0, 2000, 4000], 'mediawiki');

		scrollTracker.initScrollSpeedTracking();

		const scrollSpeedCalculator = ScrollSpeedCalculator.make();
		const scrollSpeed = scrollSpeedCalculator.getAverageSessionScrollSpeed();

		this.pageTracker.trackProp('session_scroll_speed', scrollSpeed.toString());
	}

	private connectionTracker(): void {
		if (!context.get('options.connectionTracking.enabled')) {
			return;
		}

		const connection =
			window.navigator['connection'] ||
			window.navigator['mozConnection'] ||
			window.navigator['webkitConnection'];

		if (connection) {
			const data = [];
			if (connection.downlink) {
				data.push(`downlink=${connection.downlink.toFixed(1)}`);
			}
			if (connection.effectiveType) {
				data.push(`effectiveType=${connection.effectiveType}`);
			}
			if (connection.rtt) {
				data.push(`rtt=${connection.rtt.toFixed(0)}`);
			}
			if (typeof connection.saveData === 'boolean') {
				data.push(`saveData=${+connection.saveData}`);
			}

			this.pageTracker.trackProp('connection', data.join(';'));
		}
	}

	private audigentTracker(): void {
		communicationService.action$.pipe(ofType(audigentLoadedEvent)).subscribe(() => {
			this.pageTracker.trackProp('audigent', 'loaded');
		});
	}

	private liveRampTracker(): void {
		communicationService.action$.pipe(ofType(liveRampPrebidIdsLoadedEvent)).subscribe((props) => {
			this.pageTracker.trackProp('live_ramp_prebid_ids', props.userId);
		});
	}

	private atsTracker(): void {
		communicationService.action$.pipe(ofType(atsLoadedEvent)).subscribe((props) => {
			this.pageTracker.trackProp('live_ramp_ats_loaded', props.loadTime.toString());
		});

		communicationService.action$.pipe(ofType(atsIdsLoadedEvent)).subscribe((props) => {
			this.pageTracker.trackProp('live_ramp_ats_ids', props.envelope);
		});

		communicationService.action$.pipe(ofType(atsNotLoadedForLoggedInUser)).subscribe((props) => {
			this.pageTracker.trackProp('live_ramp_ats_not_loaded', props.reason);
		});
	}

	private interventionTracker(): void {
		interventionTracker.register();
	}
}
