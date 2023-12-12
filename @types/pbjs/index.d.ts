interface PrebidMarkBidRequest {
	adId: string;
	adUnitCode?: string;
}

interface PrebidAdUnit {
	code: string;
	bids: PrebidBid[];
	fpd?: {
		context: {
			data: {
				jwTargeting: {
					playerID: string;
					mediaID: string;
				};
			};
		};
	};
	mediaType?: string; // should not be here
	mediaTypes?: Partial<PrebidMediaTypes>;
	labelAny?: string[];
	labelAll?: string[];
	ortb2Imp?: {
		ext: {
			gpid: string;
		};
	};
}

interface PrebidNativeMediaType {
	title: {
		required: boolean;
		len?: number;
	};
	body: {
		required: boolean;
		len?: number;
	};
	clickUrl: {
		required: boolean;
	};
	displayUrl: {
		required: boolean;
	};
	image?: PrebidNativeImageType;
	sponsoredBy?: {
		required: boolean;
	};
	sendTargetingKeys: boolean;
	adTemplate: string;
}

interface PrebidNativeImageType {
	required: boolean;
	sizes?: number[];
	aspect_ratios?: [
		{
			min_width?: number;
			min_height?: number;
			ratio_width: number;
			ratio_height: number;
		},
	];
}

interface PrebidVideoType {
	playerSize: number[];
	context?: string;
	api?: number[];
	protocols?: number[];
	minduration?: number;
	maxduration?: number;
	mimes?: string[];
	placement?: number;
	linearity?: number;
	playbackmethod?: number[];
	plcmt?: number | number[];
	skip?: number;
	startdelay?: number;
}

interface PrebidMediaTypes {
	banner: {
		sizes: [number, number][];
	};
	native: PrebidNativeMediaType;
	video: PrebidVideoType;
}

interface PrebidBid {
	bidder: string;
	params?: Record<string, any>;
	labelAny?: string[];
	labelAll?: string[];
}

interface PrebidBidResponse {
	ad: string;
	adId: string;
	adserverTargeting: PrebidTargeting;
	adUnitCode: string;
	auctionId: string;
	bidderCode: string;
	bidderRequestId: string;
	cpm: number;
	creativeId?: string;
	currency: string;
	getStatusCode: () => number;
	getSize: () => string;
	mediaType: string;
	originalCpm?: number;
	originalCurrency?: string;
	status: string;
	requestTimestamp: number;
	responseTimestamp: number;
	timeToRespond: number;
	width: number;
	height: number;
	size: string;
	statusMessage:
		| 'Pending'
		| 'Bid available'
		| 'Bid returned empty or error response'
		| 'Bid timed out';
	requestId: string;
	source: unknown;
	transactionId: string;
	videoCacheKey: string; // should not be here
	/**
	 * ${width}x${height}
	 */
	ttl?: number;
	vastUrl?: string;
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
		adserverTargeting?: {
			key: string;
			val: (bidResponse: any) => string;
		}[];
		suppressEmptyKeys: boolean;
		allowZeroCpmBids: boolean;
		storageAllowed?: boolean;
	};
}

interface PrebidTargeting {
	hb_adid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	hb_size?: string;

	[key: string]: string | string[];
}

interface PrebidTargetingForAdUnits {
	[unitId: string]: PrebidTargeting;
}

interface PrebidUserIds {
	id5id?: {
		uid?: string;
		ext?: {
			abTestingControlGroup?: boolean;
		};
	};
}

interface Pbjs {
	adUnits: PrebidAdUnit[];

	bidderSettings: PrebidSettings;

	requestBids(requestOptions: PrebidRequestOptions): void;

	removeAdUnit(adUnitCode: string): void;

	aliasBidder(bidderCode: string, alias: string): void;

	registerBidAdapter(bidderAdapter: () => void, bidderCode: string): void;

	markWinningBidAsUsed(markBidRequest: PrebidMarkBidRequest): void;

	getBidResponsesForAdUnitCode(adUnitCode: string): { bids: PrebidBidResponse[] };

	getAdserverTargetingForAdUnitCode(adUnitCode: string): PrebidTargeting;

	getAdserverTargeting(): PrebidTargetingForAdUnits;

	getUserIds(): PrebidUserIds;

	setConfig(config: unknown): void;

	setBidderConfig(config: unknown): void;

	enableAnalytics(config: unknown): void;

	createBid(statusCode: number): PrebidBidResponse;

	renderAd(doc: HTMLDocument, id: string): void;

	onEvent(name: string, callback: (...args: any[]) => void): void;

	offEvent(name: string, callback: (...args: any[]) => void): void;

	que: Array<() => void>;
}
