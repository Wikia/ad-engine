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
	ppid?: string;
	over_18?: string;
}

interface ISiteParameters {
	categories: [];
	directedAtChildren: boolean;
	esrbRating: string;
	mpaRating: string;
	siteName: string;
	top1000: boolean | null;
	tags: TaxonomyTags;
	taxonomy: string[];
}

interface IPageParameters {
	articleId: number;
	lang: string;
	pageId: number;
	pageName: string;
	pageType: string;
	tags: TaxonomyTags;
	wordCount: number;
}

interface IPartnersParameters {
	directedAtChildren: boolean;
	blockthrough: {
		directedAtChildren: boolean;
	};
}

interface ITargetingParameters {
	[key: string]: string | number;
}

interface IVideoParameters {
	playerLoaded: boolean;
	playerName: string;
}

interface WindowFandomContext {
	site: Partial<ISiteParameters>;
	page: Partial<IPageParameters>;
	tracking: Partial<ITrackingParameters>;
	targeting: Partial<ITargetingParameters>;
	partners: Partial<IPartnersParameters>;
	video?: Partial<IVideoParameters>;
}
