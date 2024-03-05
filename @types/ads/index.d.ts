interface MediaWikiAds {
	adEngineVersion: string;
	adContext: any;
	adTargeting: any;
	consentQueue: any;
	context: AdsContext;
	debug: (groups: string | null) => void;
	pushToConsentQueue: (callback: any) => void;
	runtime: Runtime;
}

interface AdsContext {
	// context set by loader, is available on all platforms
	/**
	 * appName as defined in AeLoader
	 */
	app: string;
	/**
	 * undefined means prod env
	 */
	env?: 'dev' | undefined;
	/**
	 * undefined means platform === app
	 */
	platform?: string;
	/**
	 * undefined means skin === app
	 */
	skin?: string;
	// context set only on MediaWiki
	opts?: MediaWikiAdsOpts;
	targeting?: MediaWikiAdsTargeting;
}

interface MediaWikiAdsOpts {
	noAdsReasons: string[];
	isAdTestWiki: boolean;
	isGamepedia?: boolean;
	isSubjectToCcpa?: boolean;
	platformName?: string;
	showAds: boolean;
	enableNativeAds?: boolean;
	userEmailHashes: [string, string, string];
}

interface MediaWikiAdsTargeting {
	directedAtChildren: boolean;
	enablePageCategories: boolean;
	esrbRating: string;
	mpaRating: string;
	featuredVideo?: MediaWikiFeaturedVideoInfo;
	hasFeaturedVideo: boolean;
	mappedVerticalName: string;
	hasIncontentPlayer: boolean;
	pageArticleId: number;
	pageIsArticle: boolean;
	pageName: string;
	pageType: string;
	wikiCustomKeyValues: string;
	wikiDbName: string;
	wikiId: number;
	wikiIsTop1000: boolean;
	wikiLanguage: string;
	wikiVertical: string; // Remove after ADEN-12118 is done
	newWikiCategories?: string[];
	hasPortableInfobox: boolean;
	adTagManagerTags?: AdTagManagerTags;
	isMobile: boolean;
	wordCount: number;
}

interface MediaWikiFeaturedVideoInfo {
	mediaId: string | null;
	videoTags: string[];
	isDedicatedForArticle: boolean | null;
}

interface AdTagManagerTags {
	age?: string[];
	bundles?: string[];
	esrb?: string[];
	mpa?: string[];
	gnre?: string[];
	media?: string[];
	pform?: string[];
	pub?: string[];
	sex?: string[];
	theme?: string[];
	tv?: string[];
}

interface Runtime {
	bab?: {
		blocking?: boolean;
	};
	disableBtf?: boolean;
	disableSecondCall?: boolean;
	interstitial?: {
		available?: boolean;
		visible?: boolean;
	};
	unblockHighlyViewableSlots?: boolean;
	video?: {
		adUnit?: string;
	};
}

interface VideoStatus {
	isDedicatedForArticle?: boolean;
	hasVideoOnPage?: boolean;
}

type ManualAdType = 'collapse' | 'forced_collapse' | 'forced_success' | 'manual';
