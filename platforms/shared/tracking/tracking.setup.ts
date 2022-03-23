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
import { props } from 'ts-action';

const bidderTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengbidders';
const slotTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengadinfo';
const viewabilityUrl = 'https://beacon.wikia-services.com/__track/special/adengviewability';
const porvataUrl = 'https://beacon.wikia-services.com/__track/special/adengplayerinfo';

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
		this.viewabilityCounterTracker();
		this.scrollSpeedTracker();
		this.connectionTracker();
		this.loadTimeTracker();
		this.audigentTracker();
		this.liveRampTracker();
		this.atsTracker();
		this.interventionTracker();
		this.adClickTracker();
		this.ctaTracker();
		this.adEngineInIframeTracker();
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

	private adEngineInIframeTracker(): void {
		const elementFound = document.documentElement.classList.contains('in-iframe');
		if (elementFound) {
			this.pageTracker.trackProp('adengine_in_iframe', '1');
		}
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

	private audigentTracker(): void {
		communicationService.on(
			eventsRepository.AUDIGENT_LOADED,
			() => {
				this.pageTracker.trackProp('audigent', 'loaded');
			},
			false,
		);
	}

	private interventionTracker(): void {
		interventionTracker.register();
	}

	private liveRampTracker(): void {
		communicationService.on(
			eventsRepository.LIVERAMP_IDS_LOADED,
			(props) => {
				this.pageTracker.trackProp('live_ramp_prebid_ids', props.userId);
			},
			false,
		);
	}

	private atsTracker(): void {
		communicationService.on(
			eventsRepository.ATS_JS_LOADED,
			(props) => {
				this.pageTracker.trackProp('live_ramp_ats_loaded', props.loadTime.toString());
			},
			false,
		);

		communicationService.on(
			eventsRepository.ATS_IDS_LOADED,
			(props) => {
				this.pageTracker.trackProp('live_ramp_ats_ids', props.envelope);
			},
			false,
		);

		communicationService.on(
			eventsRepository.ATS_NOT_LOADED_LOGGED,
			(props) => {
				this.pageTracker.trackProp('live_ramp_ats_not_loaded', props.reason);
			},
			false,
		);
	}
}
