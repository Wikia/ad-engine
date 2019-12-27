interface PrebidMarkBidRequest {
	adId: string;
	adUnitCode?: string;
}

interface PrebidAdUnit {
	code: string;
	bids: PrebidBid[];
	mediaType?: string; // should not be here
	mediaTypes?: Partial<PrebidMediaTypes>;
	labelAny?: string[];
	labelAll?: string[];
}

interface PrebidMediaTypes {
	banner: {
		sizes: [number, number][];
	};
	native: {};
	video: {
		context?: string;
		playerSize: number[];
		mimes?: string[];
		api?: number[];
		linearity?: number;
		maxduration?: number;
		protocols?: number[];
	};
}

interface PrebidBid {
	bidder: string;
	params: {};
	labelAny?: string[];
	labelAll?: string[];
}

interface PrebidBidResponse {
	cpm: number;
	status: string;
	bidderCode: string;
	timeToRespond: number;
	getStatusCode: () => number;
	width: number;
	height: number;
	statusMessage:
		| 'Pending'
		| 'Bid available'
		| 'Bid returned empty or error response'
		| 'Bid timed out';
	adId: string;
	requestId: string;
	mediaType: string;
	source: unknown;
	videoCacheKey: string; // should not be here
	/**
	 * ${width}x${height}
	 */
	getSize: () => string;
	adserverTargeting: PrebidTargeting;
}

interface PrebidRequestOptions {
	bidsBackHandler?: () => void;
	timeout?: number;
	adUnits?: PrebidAdUnit[];
	adUnitCodes?: string[];
	labels?: string[];
	auctionId?: string;
}

interface PrebidSettings {
	[key: string]: {
		adserverTargeting: {
			key: string;
			val: (bidResponse: any) => string;
		}[];
		suppressEmptyKeys: boolean;
	};
}

interface PrebidTargeting {
	hb_adid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	hb_size?: string;

	[key: string]: string | string[];
}

interface Pbjs {
	adUnits: PrebidAdUnit[];

	bidderSettings: PrebidSettings;

	requestBids(requestOptions: PrebidRequestOptions): void;

	removeAdUnit(adUnitCode: string): void;

	aliasBidder(bidderCode: string, alias: string): void;

	registerBidAdapter(bidderAdaptor: () => {}, bidderCode: string): void;

	markWinningBidAsUsed(markBidRequest: PrebidMarkBidRequest): void;

	getBidResponsesForAdUnitCode(adUnitCode: string): { bids: PrebidBidResponse[] };

	setConfig(config: {}): void;

	createBid(statusCode: number): PrebidBidResponse;

	renderAd(doc: HTMLDocument, id: string): void;

	onEvent(name: string, callback: (...args: any[]) => void): void;

	offEvent(name: string, callback: (...args: any[]) => void): void;
}
