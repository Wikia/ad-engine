export interface JWPlayerEvent {
	client: 'vast' | 'googima';
	placement: number;
	viewable: number;
	adposition: string;
	adBreakId: string;
	adPlayId: string;
	id: string;
	tag: string;
	ima: Ima;
	adtitle: string;
	adsystem: string;
	creativetype: string;
	duration: number;
	linear: string;
	description: string;
	creativeAdId: string;
	adId: string;
	universalAdId: UniversalAdId[];
	type: string;
}

interface UniversalAdId {
	universalAdIdRegistry: string;
	universalAdIdValue: string;
}

interface Ima {
	ad: Ad;
	userRequestContext: UserRequestContext;
}

interface UserRequestContext {
	requestType: string;
	vpaidMode: string;
	playerVersion: string;
	adPosition: 'pre' | 'mid' | 'post';
	adTagUrl: string;
}

interface Ad {
	g: G;
}

interface G {
	adId: string;
	adPodInfo: AdPodInfo;
	adQueryId: string;
	adSystem: string;
	adWrapperCreativeIds: any[];
	adWrapperIds: any[];
	adWrapperSystems: any[];
	advertiserName: string;
	apiFramework?: any;
	clickThroughUrl: string;
	contentType: string;
	creativeAdId: string;
	creativeId: string;
	dealId: string;
	description: string;
	disableUi: boolean;
	duration: number;
	height: number;
	linear: boolean;
	mediaUrl?: any;
	minSuggestedDuration: number;
	skippable: boolean;
	skipTimeOffset: number;
	surveyUrl?: any;
	title: string;
	traffickingParameters: string;
	uiElements: any[];
	universalAdIds: GUniversalAdId[];
	universalAdIdRegistry: string;
	universalAdIdValue: string;
	vpaid: boolean;
	width: number;
	vastMediaBitrate: number;
	vastMediaHeight: number;
	vastMediaWidth: number;
}

interface GUniversalAdId {
	adIdRegistry: string;
	adIdValue: string;
}

interface AdPodInfo {
	podIndex: number;
	timeOffset: number;
	totalAds: number;
	adPosition: number;
	isBumper: boolean;
	maxDuration: number;
}
