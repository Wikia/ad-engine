interface TaxonomyTags {
	age?: string[];
	bundles?: string[];
	esrb?: string[];
	gnre?: string[];
	media?: string[];
	mpa?: string[];
	pform?: string[];
	pub?: string[];
	sex?: string[];
	theme?: string[];
	tv?: string[];
}

interface ITrackingParameters {
	beaconId: string;
	pvNumber: number;
	pvNumberGlobal: number;
	sessionId: string;
	pvUID: string;
}

interface WindowFandomContext {
	site: {
		categories: [];
		directedAtChildren: boolean;
		esrbRating: string;
		mpaRating: string;
		siteName: string;
		top1000: boolean | null;
		tags: TaxonomyTags;
		taxonomy: string[];
	};
	page: {
		articleId: number;
		lang: string;
		pageId: number;
		pageName: string;
		pageType: string;
		tags: TaxonomyTags;
		wordCount: number;
	};
	tracking?: ITrackingParameters;
}
