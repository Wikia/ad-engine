export interface PrebidNativeData {
	adTemplate: string;
	body: string;
	clickUrl: string;
	displayUrl: string;
	image: PrebidNativeImage;
	title: string;
}

interface PrebidNativeImage {
	url: string;
	height: number;
	width: number;
}
