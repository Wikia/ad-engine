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
	AdEngine_adDemand?: string;
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
	fandomContext: WindowFandomContext;
	google: {
		ima: typeof google.ima;
	};
	googleImaVansAdapter?: any;
	googletag: googletag.Googletag;
	headertag?: any;
	liQ?: LiQ;
	moatjw?: MoatJW;
	moatPrebidApi?: MoatPrebidApi;
	mw?: MediaWiki;
	ntv?: NativoApi;
	NOLBUNDLE?: any;
	pbjs?: any;
	PostRelease?: NativoPostRelease;
	pvNumber?: number;
	pvNumberGlobal?: number;
	pvUID?: string;
	RLQ?: any;
	sessionId?: string;
	session_id?: string;
	trackingOptIn?: any;
	Sailthru?: Sailthru;
	SilverSurferSDK?: SilverSurferSDK;
	// Fandom JWPlayer sets the sponsored videos list
	sponsoredVideos?: string[];
	wgCookiePath?: string;
	XMLHttpRequest?: any;
}
