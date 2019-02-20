///<reference path="../../node_modules/@alugha/ima/typings/ima.d.ts"/>

interface Ads {
	runtime: any;
}

declare interface Window {
	ads?: Ads;
	google: {
		ima: typeof google.ima;
	};
	[key: string]: any;
}

declare interface AdDisplayContainer extends google.ima.AdDisplayContainer { }

declare var BlockAdBlock: any;

declare var NOLBUNDLE: any;
