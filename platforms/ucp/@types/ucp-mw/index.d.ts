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
	context?: MediaWikiAdsContext;
	runtime: Runtime;
}
