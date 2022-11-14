interface WindowFandomContext {
	site: {
		categories: [];
		directedAtChildren: boolean;
		esrbRating: string;
		mpaRating: string;
		siteName: string;
		top1000: boolean | null;
		tags: any;
		taxonomy: string[];
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
