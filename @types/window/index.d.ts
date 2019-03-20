// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@alugha/ima/typings/ima.d.ts"/>

interface Window {
	ads?: Ads;
	google: {
		ima: typeof google.ima;
	};
	googletag: googletag.Googletag;
	moatPrebidApi?: MoatPrebidApi;
	moatYieldReady?: MoatYieldReady;
	Krux?: KruxQueue;
	_clrm: CLRM;
	grumi?: GeoEdgeConfig;
	moatjw?: MoatJW;
	Twitch?: any;
}

declare var NOLBUNDLE: any;
