interface Window {
	__iasPET?: IasPet;
	__tcfapi: WindowTCF;
	__uspapi?: WindowUSP;
	AdEngine_adType?: ManualAdType;
	ads?: MediaWikiAds;
	adsQueue?: any;
	anyclip?: AnyclipApi;
	ats?: ATS;
	// TODO: Remove after ADEN-13043 release & data confirmation
	PWT?: { jsLoaded: () => void };
	IHPWT?: { jsLoaded: () => void };
	apstag?: Apstag;
	au?: any;
	au_seg?: any;
	beaconId?: string;
	beacon_id?: string;
	captify_kw_query_12974?: string;
	canPlayVideo?: any;
	fandomIsVideoPossible?: () => boolean;
	cnx?: any;
	confiant?: Confiant;
	dataLayer: any;
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
	IntentIqObject?: IntentIqObject;
	jwplayer?: function;
	liQ?: LiQ;
	mw?: MediaWiki;
	ntv?: NativoApi;
	NOLBUNDLE?: any;
	adsExperiments?: any;
	pbjs?: any;
	Phoenix?: Phoenix;
	PostRelease?: NativoPostRelease;
	pvNumber?: number;
	pvNumberGlobal?: number;
	pvUID?: string;
	PQ?: {
		cmd: any[];
		getTargeting?: (
			options: { signals: string[]; adUnits?: object[] },
			callback: (error, targetingData) => void,
		) => void;
		loadSignals?: (signals: string[]) => void;
	};
	RLQ?: any;
	s1search?: any;
	sessionId?: string;
	session_id?: string;
	SilverSurferSDK?: SilverSurferSDK;
	// Fandom JWPlayer sets the sponsored videos list
	sponsoredVideos?: string[];
	trackingOptIn?: any;
	wgCookiePath?: string;
	XMLHttpRequest?: any;
	optimizely?: {
		get?: (type: string) => {
			getVariationMap: () => Record<string, { id: string; name: string }>;
		};
	};
	pathfinderModulesReady?: bool;
}
