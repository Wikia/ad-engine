import { Dictionary } from './dictionary';

export interface PrebidMarkBidRequest {
	adId: string;
	adUnitCode?: string;
}

export interface PrebidAdUnit {
	code: string;
	sizes: number[] | [number, number][];
	bids: PrebidBidder[];
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
	};
}

export interface PrebidBidder {
	bidder: string;
	params: Dictionary<string | number | object | boolean>;
	labelAny?: string[];
	labelAll?: string[];
}

export interface PrebidBid {
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
}

export interface PrebidRequestOptions {
	bidsBackHandler?: () => void;
	timeout?: number;
	adUnits?: PrebidAdUnit[];
	adUnitCodes?: string[];
	labels?: string[];
	auctionId?: string;
}

export interface PrebidSettings {
	[key: string]: {
		adserverTargeting: {
			key: string;
			val: (bidResponse: any) => string;
		}[];
		suppressEmptyKeys: boolean;
	};
}

export interface PrebidTargeting {
	hb_adid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	hb_size?: string;

	[key: string]: string | string[];
}
