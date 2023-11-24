import {
	AdSlot,
	BaseServiceSetup,
	InstantConfigService,
	slotService,
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
	private vastUrl;

	constructor(
		protected readonly instantConfig: InstantConfigService = null,
		protected readonly globalTimeout: utils.GlobalTimeout = null,
	) {
		super();
	}

	initialized: utils.ExtendedPromise<void> = utils.createExtendedPromise();

	isRequiredToRun(): boolean {
		return this.isEnabled('icTaglessRequestEnabled', false);
	}

	async call(): Promise<void> {
		if (!this.isRequiredToRun()) {
			utils.logger(this.logGroup, 'disabled');
			return this.initialized.resolve(null);
		}

		if (!utils.taglessRequestContext.hasFeaturedVideo()) {
			utils.logger(this.logGroup, 'no featured video on the page');
			return this.initialized.resolve(null);
		}

		this.vastUrl = this.buildTaglessVideoRequest();
		utils.logger(this.logGroup, 'Sending a tagless request: ', this.vastUrl);

		await fetch(this.vastUrl)
			.then((res) => res.blob())
			.then((resBlob) => resBlob.text())
			.then((text) => this.handleTaglessResponse(text))
			.catch(() => {
				utils.logger(this.logGroup, 'Fetching error occured');
				this.initialized.resolve(null);
			});
	}

	getVastUrl() {
		return this.vastUrl;
	}

	private handleTaglessResponse(text: string) {
		try {
			const { lineItemId, creativeId }: ParsedCampaignData =
				this.getFirstAdFromTaglessResponse(text);
			utils.logger(this.logGroup, 'Ad received: ', lineItemId);
			utils.taglessRequestContext.updateVastXmlInAdContext(text);

			if (!this.syncedVideoLines) {
				this.syncedVideoLines = utils.taglessRequestContext.getVideoSyncedWithDisplayLines();
			}

			if (lineItemId && creativeId && this.syncedVideoLines.includes(lineItemId)) {
				universalAdPackage.updateSlotsTargeting(lineItemId, creativeId);
				utils.logger(this.logGroup, 'video ad is from UAP:JWP campaign - updating key-vals');
				this.initialized.resolve(lineItemId);
			} else {
				utils.taglessRequestContext.clearVastXmlInAdContext();
				utils.logger(this.logGroup, 'video ad is not from UAP:JWP campaign');
				this.initialized.resolve(null);
			}

			return Promise.resolve(lineItemId);
		} catch (e) {
			utils.logger(this.logGroup, 'No XML available - not a VAST response from the ad server?');

			this.initialized.resolve(null);
			return Promise.resolve(null);
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

	private getFirstAdFromTaglessResponse(textXml: string): ParsedCampaignData {
		const parser = new DOMParser();
		const xmlDocument = parser.parseFromString(textXml, 'text/xml');
		const lineItemId = xmlDocument.getElementsByTagName('Ad');
		const creativeId = xmlDocument.getElementsByTagName('Creative');

		return {
			lineItemId: lineItemId[0]?.id,
			creativeId: creativeId[0]?.id,
		};
	}
}
