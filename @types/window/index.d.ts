interface Window {
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
	captify_kw_query_12974?: string;
	canPlayVideo?: any;
	cnx?: any;
	confiant?: Confiant;
	DOMParser: DOMParser;
	fandomContext: WindowFandomContext;
	ga?: (
		command: string,
		eventType: 'pageview' | 'event' | 'social' | 'timing',
		...opts: string[]
	) => void;
	google: google;
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
	Sailthru?: Sailthru;
	SilverSurferSDK?: SilverSurferSDK;
	// Fandom JWPlayer sets the sponsored videos list
	sponsoredVideos?: string[];
	trackingOptIn?: any;
	utag_data?: any;
	wgCookiePath?: string;
	XMLHttpRequest?: any;
	Phoenix?: Phoenix;
}
