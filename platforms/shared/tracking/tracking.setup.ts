import {
	AdBidderContext,
	AdInfoContext,
	bidderTracker,
	Binder,
	communicationService,
	Dictionary,
	eventService,
	FuncPipelineStep,
	GAMOrigins,
	identityLibrary,
	identityLibraryLoadedEvent,
	InstantConfigCacheStorage,
	ofType,
	playerEvents,
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

	configureTracking(): void {
		this.porvataTracker();
		this.slotTracker();
		this.viewabilityTracker();
		this.bidderTracker();
		this.postmessageTrackingTracker();
		this.labradorTracker();
		this.identityLibraryLoadTimeTracker();
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

	private identityLibraryLoadTimeTracker(): void {
		communicationService.action$.pipe(ofType(identityLibraryLoadedEvent)).subscribe((props) => {
				this.pageTracker.trackProp('identity_library_load_time', props.loadTime.toString());
				this.pageTracker.trackProp('identity_library_ids', identityLibrary.getUids());
			});
	}
}
