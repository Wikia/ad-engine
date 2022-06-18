export interface WindowContextDto {
	site: {
		tags: any;
		directedAtChildren: boolean;
		esrbRating: string;
		vertical: string;
		categories: [];
		siteName: string;
	};
	page: {
		tags: any;
		lang: string;
		articleId: number;
		pageName: string;
		pageType: string;
		pageId: number;
	};
}
