export class FandomContext {
	constructor(
		public readonly site: Site,
		public readonly page: Page,
		public tracking: Partial<Tracking> = {},
		public partners: unknown = {},
	) {}
}

export class Site {
	public readonly categories: string[];
	public readonly directedAtChildren: boolean;
	public readonly esrbRating: string;
	public readonly siteName: string;
	public readonly top1000: boolean;
	public readonly tags: TaxonomyTags;
	public readonly taxonomy: string[];
	public readonly mpaRating: string;

	constructor(
		categories: string[],
		directedAtChildren: boolean,
		siteName: string,
		top1000: boolean,
		tags: object,
		taxonomy: string[],
	) {
		this.categories = typeof categories === 'object' ? categories : null;
		this.directedAtChildren = typeof directedAtChildren === 'boolean' ? directedAtChildren : null;
		this.siteName = typeof siteName === 'string' ? siteName : null;
		this.top1000 = typeof top1000 === 'boolean' ? top1000 : null;
		this.tags = typeof tags === 'object' ? tags : null;
		this.taxonomy = Array.isArray(taxonomy) ? taxonomy : null;
	}
}

export class Page {
	public readonly articleId: number;
	public readonly lang: string;
	public readonly pageId: number;
	public readonly pageName: string;
	public readonly pageType: string;
	public readonly tags: TaxonomyTags;
	public readonly wordCount: number;

	constructor(
		articleId: number,
		lang: string,
		pageId: number,
		pageName: string,
		pageType: string,
		tags: object,
		wordCount: number,
	) {
		this.articleId = typeof articleId === 'number' ? articleId : null;
		this.lang = typeof lang === 'string' ? lang : null;
		this.pageId = typeof pageId === 'number' ? pageId : null;
		this.pageName = typeof pageName === 'string' ? pageName : null;
		this.pageType = typeof pageType === 'string' ? pageType : null;
		this.tags = typeof tags === 'object' ? tags : null;
		this.wordCount = typeof wordCount === 'number' ? wordCount : -1;
	}
}

export class Tracking {
	public readonly beaconId: string;
	public readonly pvNumber: number;
	public readonly pvNumberGlobal: number;
	public readonly sessionId: string;
	public readonly pvUID: string;

	constructor(
		beaconId: string,
		pvNumber: number,
		pvNumberGlobal: number,
		sessionId: string,
		pvUID: string,
	) {
		this.beaconId = typeof beaconId === 'string' ? beaconId : null;
		this.pvNumber = typeof pvNumber === 'number' ? pvNumber : null;
		this.pvNumberGlobal = typeof pvNumberGlobal === 'number' ? pvNumberGlobal : null;
		this.sessionId = typeof sessionId === 'string' ? sessionId : null;
		this.pvUID = typeof pvUID === 'string' ? pvUID : null;
	}
}
