// tslint:disable-next-line:no-reference
///<reference path="../../node_modules/@alugha/ima/typings/ima.d.ts"/>

interface Window {
	AdEngine_adType?: any;
	ads?: Ads;
	buildAdUnitString?: (arg0: string, arg1: any) => string;
	confiant?: Confiant;
	google: {
		ima: typeof google.ima;
	};
	googletag: googletag.Googletag;
	moatPrebidApi?: MoatPrebidApi;
	moatYieldReady?: MoatYieldReady;
	Krux?: KruxQueue;
	moatjw?: MoatJW;
	// No types available for Twitch embedded player.
	Twitch?: any;
	// No types easily available for pbjs.
	pbjs?: any;
	pvNumber?: number;
	pvUID?: string;
}

declare var NOLBUNDLE: any;
