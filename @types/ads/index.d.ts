interface MediaWikiAds {
	adEngineVersion: string;
	consentQueue: any;
	context: MediaWikiAdsContext;
	pushToConsentQueue: (callback: any) => void;
	runtime: Runtime;
}

interface MediaWikiAdsContext {
	opts: MediaWikiAdsOpts;
	targeting: MediaWikiAdsTargeting;
}

interface MediaWikiAdsOpts {
	isAdTestWiki: boolean;
	pageType: string;
	showAds: boolean;
}

interface MediaWikiAdsTargeting {
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
	wikiLanguage: string;
	wikiVertical: string;
	newWikiCategories?: string[];
	hasPortableInfobox: boolean;
}

interface MediaWikiFeaturedVideoInfo {
	mediaId: string | null;
	videoTags: string[];
	isDedicatedForArticle: boolean | null;
}

interface Runtime {
	disableBtf?: boolean;
	disableSecondCall?: boolean;
	unblockHighlyViewableSlots?: boolean;
	bab?: any;
}

interface VideoStatus {
	isDedicatedForArticle?: boolean;
	hasVideoOnPage?: boolean;
}

type ManualAdType = 'collapse' | 'forced_collapse' | 'forced_success' | 'manual';
