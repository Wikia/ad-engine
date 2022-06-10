export interface PrebidNativeData {
	adTemplate: string;
	body: string;
	clickUrl: string;
	icon: PrebidNativeImage;
	title: string;
}

interface PrebidNativeImage {
	url: string;
	height: number;
	width: number;
}
