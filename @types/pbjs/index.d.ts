import { PrebidAdapter } from '../../src/ad-bidders/prebid/prebid-adapter';

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
}

interface PrebidNativeMediaType {
	image: {
		required: boolean;
		sizes: number[];
	};
	title: {
		required: boolean;
		len: number;
	};
	sponsoredBy: {
		required: boolean;
	};
	clickUrl: {
		required: boolean;
	};
	body: {
		required: boolean;
	};
	icon: {
		required: boolean;
		sizes: number[];
	};
}

interface PrebidVideoType {
	context?: string;
	playerSize: number[];
	mimes?: string[];
	api?: number[];
	linearity?: number;
	maxduration?: number;
	protocols?: number[];
	playbackmethod?: number[];
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
	params: unknown;
	labelAny?: string[];
	labelAll?: string[];
}

interface PrebidBidResponse {
	cpm: number;
	status: string;
	bidderCode: string;
	requestTimestamp: number;
	responseTimestamp: number;
	timeToRespond: number;
	getStatusCode: () => number;
	width: number;
	height: number;
	size: string;
	statusMessage:
		| 'Pending'
		| 'Bid available'
		| 'Bid returned empty or error response'
		| 'Bid timed out';
	ad: string;
	adId: string;
	adUnitCode: string;
	requestId: string;
	mediaType: string;
	source: unknown;
	videoCacheKey: string; // should not be here
	/**
	 * ${width}x${height}
	 */
	getSize: () => string;
	adserverTargeting: PrebidTargeting;
	ttl?: number;
	creativeId?: string;
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

	registerBidAdapter(bidderAdapter: PrebidAdapter, bidderCode: string): void;

	markWinningBidAsUsed(markBidRequest: PrebidMarkBidRequest): void;

	getBidResponsesForAdUnitCode(adUnitCode: string): { bids: PrebidBidResponse[] };

	getAdserverTargetingForAdUnitCode(adUnitCode: string): PrebidTargeting;

	getUserIds(): object;

	setConfig(config: unknown): void;

	enableAnalytics(config: unknown): void;

	createBid(statusCode: number): PrebidBidResponse;

	renderAd(doc: HTMLDocument, id: string): void;

	onEvent(name: string, callback: (...args: any[]) => void): void;

	offEvent(name: string, callback: (...args: any[]) => void): void;
}
