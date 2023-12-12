import { AdSlot, slotService, utils } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { videoDisplayTakeoverSynchronizer } from './video-display-takeover-synchronizer';

export interface VastResponseData {
	xml: string;
	lineItemId: string;
	creativeId: string;
}

/**
 * Fires a tagless request to speed up video Ads recognition before player does it.
 * Then uses videoDisplayTakeoverSynchronizer to synchronize.
 */
@Injectable()
export class VastTaglessRequest {
	private logGroup = 'display-and-video-ads-sync';

	constructor(private fetchTimeout: utils.FetchTimeout) {}

	async getVast(timeout = 500): Promise<VastResponseData | undefined> {
		const vastUrl = this.buildTaglessVideoRequest();
		utils.logger(this.logGroup, 'Sending a tagless request: ', vastUrl);

		return this.fetchTimeout
			.fetch(vastUrl, timeout)
			.then((res) => res.text())
			.then((text) => this.handleTaglessResponse(text))
			.catch(() => {
				utils.logger(this.logGroup, 'Fetching error occurred');
				return undefined;
			});
	}

	private handleTaglessResponse(text: string): VastResponseData | undefined {
		try {
			const vastData = this.getFirstAdFromTaglessResponse(text);

			utils.logger(this.logGroup, 'Ad received: ', vastData?.lineItemId);

			videoDisplayTakeoverSynchronizer.resolve(vastData?.lineItemId, vastData?.creativeId);
			return vastData;
		} catch {
			utils.logger(this.logGroup, 'No XML available - not a VAST response from the ad server?');
		}
	}

	private buildTaglessVideoRequest() {
		const aspectRatio = 16 / 9;
		const slotName = 'featured';
		const position = 'preroll';

		const adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });
		if (!slotService.get(slotName)) {
			slotService.add(adSlot);
		}

		return utils.buildVastUrl(aspectRatio, adSlot.getSlotName(), { vpos: position });
	}

	private getFirstAdFromTaglessResponse(textXml: string): VastResponseData {
		const parser = new DOMParser();
		const xmlDocument = parser.parseFromString(textXml, 'text/xml');
		const lineItemId = xmlDocument.getElementsByTagName('Ad');
		const creativeId = xmlDocument.getElementsByTagName('Creative');

		return {
			xml: textXml,
			lineItemId: lineItemId[0]?.id,
			creativeId: creativeId[0]?.id,
		};
	}
}
