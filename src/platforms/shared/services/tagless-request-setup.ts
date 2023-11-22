import {
	BaseServiceSetup,
	context,
	getAdUnitString,
	targetingService,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';

interface ParsedCampaignData {
	lineItemId: string;
	creativeId: string;
}

export class TaglessRequestSetup extends BaseServiceSetup {
	private logGroup = 'tagless-request';
	private syncedVideoLines;
	initialized: utils.ExtendedPromise<void> = utils.createExtendedPromise();

	isRequiredToRun(): boolean {
		return this.isEnabled('icTaglessRequestEnabled');
	}

	async call(): Promise<void> {
		if (!this.isEnabled('icTaglessRequestEnabled')) {
			utils.logger(this.logGroup, 'disabled');
			return this.initialized.resolve(null);
		}

		const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
		if (!hasFeaturedVideo) {
			utils.logger(this.logGroup, 'no featured video on the page');
			return this.initialized.resolve(null);
		}

		const videoTaglessRequestUrl = this.buildTaglessVideoRequest();
		utils.logger(this.logGroup, 'Sending a tagless request: ', videoTaglessRequestUrl);

		await fetch(videoTaglessRequestUrl)
			.then((res) => res.blob())
			.then((resBlob) => resBlob.text())
			.then((text) => this.handleTaglessResponse(text))
			.then((ad: ParsedCampaignData) => this.updateDisplayAdsTargetingIfSyncedCampaign(ad));
	}

	private handleTaglessResponse(text: string) {
		try {
			const firstReturnedAdId = this.getFirstAdFromTaglessResponse(text);
			utils.logger(this.logGroup, 'Ad received: ', firstReturnedAdId);

			return Promise.resolve(firstReturnedAdId);
		} catch (e) {
			utils.logger(this.logGroup, 'No XML available - not a VAST response from the ad server?');

			this.initialized.resolve(null);
			return Promise.resolve(null);
		}
	}

	private updateDisplayAdsTargetingIfSyncedCampaign(ad: ParsedCampaignData) {
		if (!this.syncedVideoLines) {
			this.syncedVideoLines = context.get('options.video.uapJWPLineItemIds') || [];
		}

		const { lineItemId, creativeId } = ad;

		if (lineItemId && creativeId && this.syncedVideoLines.includes(lineItemId)) {
			universalAdPackage.updateSlotsTargeting(lineItemId, creativeId);
			utils.logger(this.logGroup, 'video ad is from UAP:JWP campaign - updating key-vals');
			this.initialized.resolve(lineItemId);
		} else {
			utils.logger(this.logGroup, 'video ad is not from UAP:JWP campaign');
			this.initialized.resolve(null);
		}
	}

	private buildTaglessVideoRequest() {
		const pageTargeting = targetingService.dump();

		return utils.buildVastUrl(16 / 9, 'video', {
			videoAdUnitId: getAdUnitString('featured', {
				...context.get('slots.featured'),
				slotNameSuffix: '',
			}),
			customParams: `src=${context.get('src')}&pos=featured&cid=${pageTargeting['cid']}`,
		});
	}

	private getFirstAdFromTaglessResponse(response: string) {
		const parser = new DOMParser();
		const xml = parser.parseFromString(response, 'text/xml');
		const lineItemId = xml.getElementsByTagName('Ad');
		const creativeId = xml.getElementsByTagName('Creative');

		return {
			lineItemId: lineItemId[0]?.id,
			creativeId: creativeId[0]?.id,
		};
	}
}
