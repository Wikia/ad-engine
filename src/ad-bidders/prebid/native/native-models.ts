export interface PrebidNativeData {
	adTemplate: string;
	body: string;
	clickTrackers: any[];
	clickUrl: string;
	displayUrl: string;
	icon: PrebidNativeImage;
	impressionTrackers: any[];
	title: string;
}

interface PrebidNativeImage {
	url: string;
	height: number;
	width: number;
}
