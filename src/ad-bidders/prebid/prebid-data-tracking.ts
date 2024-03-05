import {
	communicationService,
	eventsRepository,
	TrackingBidDefinition,
} from '@ad-engine/communication';
import { context, DEFAULT_MAX_DELAY, pbjsFactory, utils } from '@ad-engine/core';
import { getSlotNameByBidderAlias } from '../bidder-helper';
import { BidsRefreshing } from '../bidder-provider';
import { intentIQ } from './intent-iq';
import { LiveRampIdTypes } from './liveramp-id';
import { requestBids } from './prebid-helper';

const logGroup = 'prebid-data-tracking';

class PrebidDataTracking {
	private bidsRefreshing: BidsRefreshing;
	private isConfigured = false;
	private adUnits: PrebidAdUnit[] = [];

	configure(adUnits: PrebidAdUnit[]) {
		if (adUnits && adUnits.length > 0) {
			this.adUnits = [...this.adUnits, ...adUnits];
		}

		if (this.isConfigured) return;
		this.isConfigured = true;

		this.registerBidsRefreshing();
		this.registerBidsTracking();
		this.enableATSAnalytics();
	}

	private async registerBidsRefreshing(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};

		const refreshUsedBid = (winningBid) => {
			const isS2sBid = (adUnit: PrebidAdUnit) =>
				adUnit.bids[0].bidder === 'mgnipbs' && winningBid?.source === 's2s';

			if (this.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
				communicationService.emit(eventsRepository.BIDDERS_BIDS_REFRESH, {
					refreshedSlotNames: [winningBid.adUnitCode],
				});

				const adUnitsToRefresh = this.adUnits.filter(
					(adUnit) =>
						adUnit.code === winningBid.adUnitCode &&
						adUnit.bids &&
						adUnit.bids[0] &&
						(adUnit.bids[0].bidder === winningBid.bidderCode || isS2sBid(adUnit)),
				);

				requestBids(adUnitsToRefresh, this.bidsRefreshing.bidsBackHandler, DEFAULT_MAX_DELAY);
			}
		};

		pbjs.onEvent('bidWon', refreshUsedBid);

		utils.logger(logGroup, 'Bids refreshing configured');
	}

	private async registerBidsTracking(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		const trackBid = (response) => {
			communicationService.emit(eventsRepository.BIDDERS_BIDS_RESPONSE, {
				bidResponse: this.mapResponseToTrackingBidDefinition(response),
			});
		};

		pbjs.onEvent('bidResponse', trackBid);
		pbjs.onEvent(
			'adRenderSucceeded',
			(response: { adId: string; bid: PrebidBidResponse; doc: Document | null }) =>
				intentIQ.reportPrebidWin(response.bid),
		);

		utils.logger(logGroup, 'Bids tracking configured');
	}

	private enableATSAnalytics(): void {
		if (!this.isLiveRampEnabled()) return;

		utils.logger(logGroup, 'prebid enabling ATS Analytics');

		(window as any).pbjs.que.push(() => {
			(window as any).pbjs.enableAnalytics([
				{
					provider: 'atsAnalytics',
					options: {
						pid: LiveRampIdTypes.PLACEMENT_ID,
					},
				},
			]);
		});
	}

	private isLiveRampEnabled() {
		return (
			context.get('bidders.liveRampATSAnalytics.enabled') &&
			context.get('bidders.liveRampId.enabled')
		);
	}

	private mapResponseToTrackingBidDefinition(response: PrebidBidResponse): TrackingBidDefinition {
		return {
			bidderName: response.bidderCode,
			price: response.cpm.toString(),
			responseTimestamp: response.responseTimestamp,
			slotName: getSlotNameByBidderAlias(response.adUnitCode),
			size: response.size,
			timeToRespond: response.timeToRespond,
		};
	}
}

export const prebidDataTracking = new PrebidDataTracking();
