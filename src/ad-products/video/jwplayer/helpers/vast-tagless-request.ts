import { AdSlot, InstantConfigService, slotService, Tcf, Usp } from '@ad-engine/core';
import { buildVastUrl, FetchTimeout, logger, VastOptions } from '@ad-engine/utils';
import { Injectable } from '@wikia/dependency-injection';
import { Bidders } from '../../../../ad-bidders';
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
	private readonly logGroup = 'display-and-video-ads-sync';
	private readonly timeout: number;

	constructor(
		private fetchTimeout: FetchTimeout,
		instantConfig: InstantConfigService,
		private bidders: Bidders,
		private tcf: Tcf,
		private usp: Usp,
	) {
		this.timeout = instantConfig.get('icVastRequestTimeout', 500);
	}

	public async buildTaglessVideoRequest(isTagless = true): Promise<string> {
		const aspectRatio = 16 / 9;
		const slotName = 'featured';
		const position = 'preroll';

		const adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });
		if (!slotService.get(slotName)) {
			slotService.add(adSlot);
		}

		const biddersTargeting = await this.bidders.getBidParameters(slotName);
		const defaultVastOptions: Partial<VastOptions> = {
			vpos: position,
			targeting: biddersTargeting,
			isTagless,
		};

		return buildVastUrl(
			aspectRatio,
			slotName,
			await this.extendOptionsBasedOnPrivacyData(defaultVastOptions),
		);
	}

	private async extendOptionsBasedOnPrivacyData(vastOptions: Partial<VastOptions>) {
		if (this.tcf.exists) {
			const signalData = await this.tcf.getTCData();
			vastOptions = {
				...vastOptions,
				gdpr_consent: signalData.tcString,
			};
		}

		if (this.usp.exists) {
			const signalData = await this.usp.getSignalData();
			vastOptions = {
				...vastOptions,
				us_privacy: signalData.uspString,
			};
		}

		return vastOptions;
	}

	public async getVast(): Promise<VastResponseData | undefined> {
		const vastUrl = await this.buildTaglessVideoRequest();
		logger(this.logGroup, 'Sending a tagless request: ', vastUrl);

		return this.fetchTimeout
			.fetch(vastUrl, this.timeout)
			.then((res) => res.text())
			.then((text) => this.handleTaglessResponse(text))
			.catch(() => {
				logger(this.logGroup, 'Fetching error occurred');
				return undefined;
			});
	}

	private handleTaglessResponse(text: string): VastResponseData | undefined {
		try {
			const vastData = this.getFirstAdFromTaglessResponse(text);

			logger(this.logGroup, 'Ad received: ', vastData?.lineItemId);

			videoDisplayTakeoverSynchronizer.resolve(vastData?.lineItemId, vastData?.creativeId);
			return vastData;
		} catch {
			logger(this.logGroup, 'No XML available - not a VAST response from the ad server?');
		}
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
