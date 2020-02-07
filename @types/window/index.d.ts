// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@alugha/ima/typings/ima.d.ts"/>

interface Window {
	ga?: (
		command: string,
		eventType: 'pageview' | 'event' | 'social' | 'timing',
		...opts: string[]
	) => void;
	__cmp?: WindowCMP;
	__uspapi?: WindowUSP;
	XMLHttpRequest?: any;
	AdEngine_adType?: ManualAdType;
	ads?: MediaWikiAds;
	adsQueue?: any;
	apstag?: Apstag;
	confiant?: Confiant;
	DOMParser: typeof DOMParser;
	google: {
		ima: typeof google.ima;
	};
	mw?: MediaWiki;
	RLQ?: any;
	googleImaVansAdapter?: any;
	googletag: googletag.Googletag;
	moatPrebidApi?: MoatPrebidApi;
	moatYieldReady?: MoatYieldReady;
	moatjw?: MoatJW;
	sessionId?: string;
	session_id?: string;
	pvNumber?: number;
	pvNumberGlobal?: number;
	pvUID?: string;
	trackingOptIn?: any;
	permutive?: Permutive;
	wgCookiePath?: string;
	beaconId?: string;
	beacon_id?: string;
}

declare var NOLBUNDLE: any;
