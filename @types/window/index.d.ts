interface Window {
	ga?: (
		command: string,
		eventType: 'pageview' | 'event' | 'social' | 'timing',
		...opts: string[]
	) => void;
	__iasPET?: IasPet;
	__tcfapi: WindowTCF;
	__uspapi?: WindowUSP;
	AdEngine_adType?: ManualAdType;
	ads?: MediaWikiAds;
	adsQueue?: any;
	PWT: { jsLoaded: () => void };
	apstag?: Apstag;
	au?: any;
	au_seg?: any;
	beaconId?: string;
	beacon_id?: string;
	canPlayVideo?: any;
	cnx?: any;
	confiant?: Confiant;
	DOMParser: typeof DOMParser;
	google: {
		ima: typeof google.ima;
	};
	googleImaVansAdapter?: any;
	googletag: googletag.Googletag;
	headertag?: any;
	moatjw?: MoatJW;
	moatPrebidApi?: MoatPrebidApi;
	mw?: MediaWiki;
	ntv?: NativoSdk;
	NOLBUNDLE?: any;
	PostRelease?: NativoPostRelease;
	pvNumber?: number;
	pvNumberGlobal?: number;
	pvUID?: string;
	RLQ?: any;
	sessionId?: string;
	session_id?: string;
	tabId?: string;
	trackingOptIn?: any;
	Sailthru?: Sailthru;
	SilverSurferSDK?: SilverSurferSDK;
	wgCookiePath?: string;
	XMLHttpRequest?: any;
}
