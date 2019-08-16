import { context, Dictionary, utils } from '@ad-engine/core';
import { BaseAdapter } from '../prebid/adapters';
import { PrebidSettings } from '../prebid/prebid-settings';

const logGroup = 'prebid-wrapper';

interface MarkBidRequest {
	adId: string;
	adUnitCode?: string;
}

interface AdUnit {
	code: string;
	sizes: number[] | [number, number][];
	bids: Bid[];
	mediaTypes?: MediaTypes;
	labelAny?: string[];
	labelAll?: string[];
}

interface MediaTypes {
	banner: {};
	native: {};
	video: {};
}

interface Bid {
	bidder: string;
	params: {};
	labelAny?: string[];
	labelAll?: string[];
}

interface RequestOptions {
	bidsBackHandler?: () => void;
	timeout?: number;
	adUnits?: AdUnit[];
	adUnitCodes?: string[];
	labels?: string[];
	auctionId?: string;
}

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
			utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true, 'first');
		} else {
			utils.logger(
				logGroup,
				'Prebid library URL not defined. Assuming that window.pbjs will be loaded.',
			);
		}

		this.script = new Promise((resolve) => window.pbjs.que.push(() => resolve()));
	}

	async requestBids(requestOptions: RequestOptions): Promise<void> {
		await this.script;
		window.pbjs.requestBids(requestOptions);
	}

	async getAdUnits(): Promise<AdUnit[]> {
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

	async registerBidAdapter(bidderAdaptor: () => BaseAdapter, bidderCode: string) {
		await this.script;
		window.pbjs.registerBidAdapter(bidderAdaptor, bidderCode);
	}

	async markWinningBidAsUsed(markBidRequest: MarkBidRequest): Promise<void> {
		await this.script;
		window.pbjs.markWinningBidAsUsed(markBidRequest);
	}

	async getBidResponsesForAdUnitCode(adUnitCode: string): Promise<Bid[]> {
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

	// TODO unknown = PrebidBid
	async createBid(statusCode: string): Promise<unknown> {
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
