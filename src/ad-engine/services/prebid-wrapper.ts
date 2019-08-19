import { Dictionary } from '../models/dictionary';
import {
	PrebidAdUnit,
	PrebidBid,
	PrebidMarkBidRequest,
	PrebidRequestOptions,
	PrebidSettings,
} from '../models/prebid-models';
import { logger, scriptLoader } from '../utils';
import { context } from './context-service';

const logGroup = 'prebid-wrapper';

window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];

export class PrebidWrapper {
	private static instance: PrebidWrapper;

	static make(): PrebidWrapper {
		if (!PrebidWrapper.instance) {
			PrebidWrapper.instance = new PrebidWrapper();
		}

		return PrebidWrapper.instance;
	}

	private script: Promise<void>;

	private constructor() {
		this.insertScript();
	}

	private insertScript(): void {
		const libraryUrl = context.get('bidders.prebid.libraryUrl');

		if (libraryUrl) {
			scriptLoader.loadScript(libraryUrl, 'text/javascript', true, 'first');
		} else {
			logger(logGroup, 'Prebid library URL not defined. Assuming that window.pbjs will be loaded.');
		}

		this.script = new Promise((resolve) => window.pbjs.que.push(() => resolve()));
	}

	async requestBids(requestOptions: PrebidRequestOptions): Promise<void> {
		await this.script;
		window.pbjs.requestBids(requestOptions);
	}

	async getAdUnits(): Promise<PrebidAdUnit[]> {
		await this.script;

		return window.pbjs.adUnits || [];
	}

	async removeAdUnit(adUnitCode: string): Promise<void> {
		await this.script;
		window.pbjs.removeAdUnit(adUnitCode);
	}

	async aliasBidder(bidderCode: string, alias: string): Promise<void> {
		await this.script;
		window.pbjs.aliasBidder(bidderCode, alias);
	}

	// TODO: add types from http://prebid.org/dev-docs/bidder-adaptor.html#creating-the-adapter
	async registerBidAdapter(bidderAdaptor: () => {}, bidderCode: string) {
		await this.script;
		window.pbjs.registerBidAdapter(bidderAdaptor, bidderCode);
	}

	async markWinningBidAsUsed(markBidRequest: PrebidMarkBidRequest): Promise<void> {
		await this.script;
		window.pbjs.markWinningBidAsUsed(markBidRequest);
	}

	async getBidResponsesForAdUnitCode(adUnitCode: string): Promise<{ bids: PrebidBid[] }> {
		await this.script;

		return window.pbjs.getBidResponsesForAdUnitCode(adUnitCode);
	}

	async setConfig(config: Dictionary): Promise<void> {
		await this.script;
		window.pbjs.setConfig(config);
	}

	async setBidderSettings(settings: PrebidSettings): Promise<void> {
		await this.script;
		window.pbjs.bidderSettings = settings;
	}

	async createBid(statusCode: string): Promise<PrebidBid> {
		await this.script;
		return window.pbjs.createBid(statusCode);
	}

	async renderAd(doc: HTMLDocument, id: string): Promise<void> {
		await this.script;
		window.pbjs.renderAd(doc, id);
	}

	async onEvent(name: string, callback: (...args: any[]) => void): Promise<void> {
		await this.script;
		window.pbjs.onEvent(name, callback);
	}

	async offEvent(name: string, callback: (...args: any[]) => void): Promise<void> {
		await this.script;
		window.pbjs.offEvent(name, callback);
	}
}
