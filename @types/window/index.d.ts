// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@alugha/ima/typings/ima.d.ts"/>

interface Window {
	__cmp?: WindowCMP;
	XMLHttpRequest?: any;
	AdEngine_adType?: ManualAdType;
	ads?: Ads;
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
	Krux?: KruxQueue;
	moatjw?: MoatJW;
	pvNumber?: number;
	pvNumberGlobal?: number;
	pvUID?: string;
	trackingOptIn?: any;
}

declare var NOLBUNDLE: any;
