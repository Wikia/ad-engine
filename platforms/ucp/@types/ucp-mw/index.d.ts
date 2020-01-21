interface MediaWikiAdsContext {
	targeting: {
		esrbRating: string;
		featuredVideo: MediaWikiFeaturedVideoInfo | null;
		hasFeaturedVideo: boolean;
		hasIncontentPlayer: boolean;
		pageArticleId: number;
		mappedVerticalName: string;
		pageName: string;
		pageType: string;
		wikiDbName: string;
		wikiLanguage: string;
	};
}

interface MediaWikiFeaturedVideoInfo {
	mediaId: string | null;
	videoTags: string[];
	isDedicatedForArticle: boolean | null;
}

interface MediaWikiAds {
	consentQueue: any;
	context?: MediaWikiAdsContext;
	pushToConsentQueue: (callback: any) => void;
	runtime: Runtime;
}
