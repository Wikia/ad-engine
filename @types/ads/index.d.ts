interface MediaWikiAds {
	adEngineVersion: string;
	adContext: any;
	consentQueue: any;
	context: MediaWikiAdsContext;
	debug: (groups: string | null) => void;
	pushToConsentQueue: (callback: any) => void;
	runtime: Runtime;
}

interface MediaWikiAdsContext {
	opts: MediaWikiAdsOpts;
	targeting: MediaWikiAdsTargeting;
}

interface MediaWikiAdsOpts {
	noAdsReasons: string[];
	isAdTestWiki: boolean;
	isGamepedia?: boolean;
	isSubjectToCcpa?: boolean;
	pageType: string;
	platformName?: string;
	showAds: boolean;
	enableTBPlaceholderOnBackend?: boolean;
	enableICLazyRequesting?: boolean;
	enableICPPlaceholder?: boolean;
	enableAdTagManagerBackend?: boolean;
}

interface MediaWikiAdsTargeting {
	directedAtChildren: boolean;
	enablePageCategories: boolean;
	esrbRating: string;
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
	wikiVertical: string;
	newWikiCategories?: string[];
	hasPortableInfobox: boolean;
	adTagManagerTags?: AdTagManagerTags;
}

interface MediaWikiFeaturedVideoInfo {
	mediaId: string | null;
	videoTags: string[];
	isDedicatedForArticle: boolean | null;
}

interface AdTagManagerTags {
	age?: string[];
	esrb?: string[];
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
}

interface VideoStatus {
	isDedicatedForArticle?: boolean;
	hasVideoOnPage?: boolean;
}

type ManualAdType = 'collapse' | 'forced_collapse' | 'forced_success' | 'manual';
