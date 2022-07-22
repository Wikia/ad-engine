export class Context {
	constructor(public readonly site: Site, public readonly page: Page) {}
}

export class Site {
	public readonly categories: [];
	public readonly directedAtChildren: boolean;
	public readonly esrbRating: string;
	public readonly siteName: string;
	public readonly top1000: boolean;
	public readonly tags: any;
	public readonly vertical: string;

	constructor(
		categories: [],
		directedAtChildren: boolean,
		esrbRating: string,
		siteName: string,
		top1000: boolean,
		tags: object,
		vertical: string,
	) {
		this.categories = typeof categories === 'object' ? categories : null;
		this.directedAtChildren = typeof directedAtChildren === 'boolean' ? directedAtChildren : null;
		this.esrbRating = typeof esrbRating === 'string' ? esrbRating : null;
		this.siteName = typeof siteName === 'string' ? siteName : null;
		this.top1000 = typeof top1000 === 'boolean' ? top1000 : null;
		this.tags = typeof tags === 'object' ? tags : null;
		this.vertical = typeof vertical === 'string' ? vertical : null;
	}
}

export class Page {
	public readonly articleId: number;
	public readonly hasFeaturedVideo: boolean;
	public readonly lang: string;
	public readonly pageId: number;
	public readonly pageName: string;
	public readonly pageType: string;
	public readonly tags: any;

	constructor(
		articleId: number,
		hasFeaturedVideo: boolean,
		lang: string,
		pageId: number,
		pageName: string,
		pageType: string,
		tags: object,
	) {
		this.articleId = typeof articleId === 'number' ? articleId : null;
		this.hasFeaturedVideo = typeof hasFeaturedVideo === 'boolean' ? hasFeaturedVideo : null;
		this.lang = typeof lang === 'string' ? lang : null;
		this.pageId = typeof pageId === 'number' ? pageId : null;
		this.pageName = typeof pageName === 'string' ? pageName : null;
		this.pageType = typeof pageType === 'string' ? pageType : null;
		this.tags = typeof tags === 'object' ? tags : null;
	}
}
