// tslint:disable-next-line:no-reference
///<reference path="../node_modules/@alugha/ima/typings/ima.d.ts"/>

interface Window {
	ads?: Ads;
	google: {
		ima: typeof google.ima;
	};
	[key: string]: any;
}

interface Ads {
	runtime: Runtime;
}

interface Runtime {
	disableBtf: boolean;
	disableSecondCall: boolean;
	unblockHighlyViewableSlots: boolean;
}

declare var BlockAdBlock: any;

declare var NOLBUNDLE: any;
