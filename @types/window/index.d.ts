// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@alugha/ima/typings/ima.d.ts"/>

interface Window {
	ga?: (
		command: string,
		eventType: 'pageview' | 'event' | 'social' | 'timing',
		...opts: string[]
	) => void;
	__iasPET?: IasPet;
	__tcfapi: WindowTCF;
	__uspapi?: WindowUSP;
	AdEngine_adType?: ManualAdType;
	ads?: MediaWikiAds;
	adsQueue?: any;
	apstag?: Apstag;
	au_seg?: any;
	beaconId?: string;
	beacon_id?: string;
	canPlayVideo?: any;
	confiant?: Confiant;
	DOMParser: typeof DOMParser;
	google: {
		ima: typeof google.ima;
	};
	googleImaVansAdapter?: any;
	googletag: googletag.Googletag;
	headertag?: any;
	moatjw?: MoatJW;
	moatPrebidApi?: MoatPrebidApi;
	mw?: MediaWiki;
	permutive?: Permutive;
	pvNumber?: number;
	pvNumberGlobal?: number;
	pvUID?: string;
	realvu_aa?: {
		addUnitById: (any) => string;
		regUnit: (string) => string;
	};
	RLQ?: any;
	sessionId?: string;
	session_id?: string;
	tabId?: string;
	trackingOptIn?: any;
	SilverSurferSDK?: SilverSurferSDK;
	wgCookiePath?: string;
	XMLHttpRequest?: any;
}

declare var NOLBUNDLE: any;
