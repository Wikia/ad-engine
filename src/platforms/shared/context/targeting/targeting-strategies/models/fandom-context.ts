export class FandomContext {
	constructor(public readonly site: Site, public readonly page: Page) {}
}

export class Site {
	public readonly categories: [];
	public readonly directedAtChildren: boolean;
	public readonly esrbRating: string;
	public readonly siteName: string;
	public readonly top1000: boolean;
	public readonly tags: TaxonomyTags;
	public readonly taxonomy: string[];
	public readonly mpaRating: string;

	constructor(
		categories: [],
		directedAtChildren: boolean,
		esrbRating: string,
		siteName: string,
		top1000: boolean,
		tags: object,
		taxonomy: string[],
		mpaRating: string,
	) {
		this.categories = typeof categories === 'object' ? categories : null;
		this.directedAtChildren = typeof directedAtChildren === 'boolean' ? directedAtChildren : null;
		this.esrbRating = typeof esrbRating === 'string' ? esrbRating : null;
		this.mpaRating = typeof mpaRating === 'string' ? mpaRating : null;
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
