import { UapConfig } from './uap-config';
import { UapImage } from './uap-image';

export interface UapParams {
	adContainer: HTMLElement;
	adProduct: string;
	autoPlay: boolean;
	clickThroughURL: string;
	config: UapConfig;
	container: HTMLElement;
	creativeId: string;
	image1: UapImage;
	image2?: UapImage;
	isDarkTheme: boolean;
	isMobile: boolean;
	lineItemId: string;
	newTakeoverConfig: boolean;
	sequentialUapConfig: boolean;
	slotName: string;
	src: string;
	uap: string;
	height: number;
	width: number;
	thumbnail: HTMLElement;
	useVideoSpecialAdUnit: boolean;
}
