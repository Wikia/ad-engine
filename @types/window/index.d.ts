// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@alugha/ima/typings/ima.d.ts"/>

interface Window {
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
	googleImaVansAdapter?: any;
	googletag: googletag.Googletag;
	moatPrebidApi?: MoatPrebidApi;
	moatYieldReady?: MoatYieldReady;
	moatjw?: MoatJW;
	pvNumber?: number;
	pvNumberGlobal?: number;
	pvUID?: string;
	trackingOptIn?: any;
	permutive?: Permutive;
}

declare var NOLBUNDLE: any;
