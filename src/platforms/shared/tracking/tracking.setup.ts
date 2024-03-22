// @ts-strict-ignore
import {
	adClickTracker,
	AdSizeTracker,
	Apstag,
	BaseTrackingSetup,
	Bidders,
	bidderTracker,
	communicationService,
	context,
	ctaTracker,
	DataWarehouseTracker,
	Dictionary,
	eventsRepository,
	GAMOrigins,
	globalAction,
	InstantConfigService,
	interventionTracker,
	LabradorTracker,
	porvataTracker,
	PostmessageTracker,
	slotTracker,
	TrackingMessage,
	TrackingTarget,
	trackingUrls,
	viewabilityTracker,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';

const adClickedAction = globalAction('[AdEngine] Ad clicked', props<Dictionary>());

@Injectable()
export class TrackingSetup extends BaseTrackingSetup {
	constructor(
		protected labradorTracker: LabradorTracker,
		protected dwTracker: DataWarehouseTracker,
		protected instantConfig: InstantConfigService,
		private bidders: Bidders,
		private adSizeTracker: AdSizeTracker,
	) {
		super(labradorTracker, dwTracker, instantConfig);
	}

	execute(): void {
		this.porvataTracker();
		this.slotTracker();
		this.identityTracker();
		this.viewabilityTracker();
		this.bidderTracker();
		this.postmessageTrackingTracker();
		this.interventionTracker();
		this.adClickTracker();
		this.ctaTracker();
		this.adSizeTracker.init();
		super.execute();
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

		bidderTracker.register(({ data }) => {
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

	private interventionTracker(): void {
		interventionTracker.register();
	}
}
