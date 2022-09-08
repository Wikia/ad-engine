interface WindowFandomContext {
	site: {
		categories: [];
		directedAtChildren: boolean;
		esrbRating: string;
		siteName: string;
		top1000: boolean | null;
		tags: any;
		legacyVertical: string;
		wikiVertical: string;
	};
	page: {
		articleId: number;
		lang: string;
		pageId: number;
		pageName: string;
		pageType: string;
		tags: any;
	};
}
