import { context, Dictionary } from '@ad-engine/core';
import {
	adClickTracker,
	bidderTracker,
	ctaTracker,
	interventionTracker,
	slotTracker,
	viewabilityTracker,
} from '@ad-engine/tracking';
import { Bidders } from '@wikia/ad-bidders';
import { porvataTracker } from '@wikia/ad-products';
import { communicationService, eventsRepository, globalAction } from '@wikia/communication';
import { Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';
import { trackingUrls } from '../setup/tracking-urls';
import { AdSizeTracker } from './ad-size-tracker';
import { DataWarehouseTracker } from './data-warehouse';

const adClickedAction = globalAction('[AdEngine] Ad clicked', props<Dictionary>());

@Injectable()
export class SlotTrackingSetup {
	constructor(
		private dwTracker: DataWarehouseTracker,
		private adSizeTracker: AdSizeTracker,
		private bidders: Bidders,
	) {}

	execute(): void {
		this.porvataTracker();
		this.slotTracker();
		this.viewabilityTracker();
		this.bidderTracker();
		this.interventionTracker();
		this.adClickTracker();
		this.ctaTracker();
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

	private interventionTracker(): void {
		interventionTracker.register();
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
}
