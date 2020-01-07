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
	ad: google.ima.Ad;
	userRequestContext: UserRequestContext;
}

interface UserRequestContext {
	requestType: string;
	vpaidMode: string;
	playerVersion: string;
	adPosition: 'pre' | 'mid' | 'post';
	adTagUrl: string;
}
