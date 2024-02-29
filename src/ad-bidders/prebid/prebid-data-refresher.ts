import {
	communicationService,
	eventsRepository,
	TrackingBidDefinition,
} from '@ad-engine/communication';
import { context, pbjsFactory, utils } from '@ad-engine/core';
import { getSlotNameByBidderAlias } from '../bidder-helper';
import { BidsRefreshing } from '../bidder-provider';
import { intentIQ } from './intent-iq';
import { LiveRampIdTypes } from './liveramp-id';

const logGroup = 'prebid-data-refresher';

class PrebidDataRefresher {
	bidsRefreshing: BidsRefreshing;

	private isConfiguredBidsRefreshing = false;
	private isConfiguredBidsTracking = false;
	private isConfiguredATSAnalytics = false;

	async registerBidsRefreshing(callback: (params: any) => void): Promise<void> {
		if (this.isConfiguredBidsRefreshing) return;

		this.isConfiguredBidsRefreshing = true;

		const pbjs: Pbjs = await pbjsFactory.init();

		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};

		const refreshUsedBid = (winningBid) => {
			if (this.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
				communicationService.emit(eventsRepository.BIDDERS_BIDS_REFRESH, {
					refreshedSlotNames: [winningBid.adUnitCode],
				});

				callback(winningBid);
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
}

export const prebidDataRefresher = new PrebidDataRefresher();
