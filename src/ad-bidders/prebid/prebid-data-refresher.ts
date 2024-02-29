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

const logGroup = 'prebid-data-refresher';

class PrebidDataRefresher {
	private bidsRefreshing: BidsRefreshing;
	private isConfiguredBidsRefreshing = false;
	private isConfiguredBidsTracking = false;
	private isConfiguredATSAnalytics = false;
	private adUnits: PrebidAdUnit[] = [];
	private slotTimeouts: { [key: number]: number } = {};

	async registerBidsRefreshing(adUnits: PrebidAdUnit[], timeout: number): Promise<void> {
		if (this.adUnits.length > 0) {
			this.adUnits = [...this.adUnits, ...adUnits];

			this.addSlotsTimeouts(adUnits, timeout);
		}

		if (this.isConfiguredBidsRefreshing) return;

		this.isConfiguredBidsRefreshing = true;

		const pbjs: Pbjs = await pbjsFactory.init();

		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};

		const refreshUsedBid = (winningBid) => {
			if (this.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
				communicationService.emit(eventsRepository.BIDDERS_BIDS_REFRESH, {
					refreshedSlotNames: [winningBid.adUnitCode],
				});

				const adUnitsToRefresh = this.adUnits.filter(
					(adUnit) =>
						adUnit.code === winningBid.adUnitCode &&
						adUnit.bids &&
						adUnit.bids[0] &&
						adUnit.bids[0].bidder === winningBid.bidderCode,
				);

				requestBids(
					adUnitsToRefresh,
					this.bidsRefreshing.bidsBackHandler,
					this.getSlotTimeout(winningBid.adUnitCode),
				);
			}
		};

		pbjs.onEvent('bidWon', refreshUsedBid);

		utils.logger(logGroup, 'Bids refreshing configured');
	}

	async registerBidsTracking(): Promise<void> {
		if (this.isConfiguredBidsTracking) return;

		this.isConfiguredBidsTracking = true;

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

	enableATSAnalytics(): void {
		if (this.isConfiguredATSAnalytics) return;

		this.isConfiguredATSAnalytics = true;

		if (
			context.get('bidders.liveRampATSAnalytics.enabled') &&
			context.get('bidders.liveRampId.enabled')
		) {
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

		utils.logger(logGroup, 'ATS enabled');
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

	private addSlotsTimeouts(adUnits: PrebidAdUnit[], timeout: number) {
		adUnits.forEach((adUnit) => {
			this.slotTimeouts[adUnit.code] = timeout;
		});
	}

	private getSlotTimeout(code: string) {
		return this.slotTimeouts?.[code] || DEFAULT_MAX_DELAY;
	}
}

export const prebidDataRefresher = new PrebidDataRefresher();
