interface MediaWikiAdsContext {
	targeting: {
		esrbRating: string;
		pageArticleId: number;
		mappedVerticalName: string;
		pageName: string;
		pageType: string;
		wikiDbName: string;
		wikiLanguage: string;
	};
}

interface MediaWikiAds {
	consentQueue: any;
	context?: MediaWikiAdsContext;
	pushToConsentQueue: (callback: any) => void;
	runtime: Runtime;
}
