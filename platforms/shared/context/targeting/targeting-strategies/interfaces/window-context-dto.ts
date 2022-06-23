export interface WindowContextDto {
	site: {
		categories: [];
		directedAtChildren: boolean;
		esrbRating: string;
		siteName: string;
		top1000: boolean | null;
		tags: any;
		vertical: string;
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
		this.categories = typeof categories === 'object' ? categories : undefined;
		this.directedAtChildren =
			typeof directedAtChildren === 'boolean' ? directedAtChildren : undefined;
		this.esrbRating = typeof esrbRating === 'string' ? esrbRating : undefined;
		this.siteName = typeof siteName === 'string' ? siteName : undefined;
		this.top1000 = typeof top1000 === 'boolean' ? top1000 : undefined;
		this.tags = typeof tags === 'object' ? tags : undefined;
		this.vertical = typeof vertical === 'string' ? vertical : undefined;
	}
}

export class Page {
	public readonly articleId: number;
	public readonly lang: string;
	public readonly pageId: number;
	public readonly pageName: string;
	public readonly pageType: string;
	public readonly tags: any;
	constructor(
		articleId: number,
		lang: string,
		pageId: number,
		pageName: string,
		pageType: string,
		tags: object,
	) {
		this.articleId = typeof articleId === 'number' ? articleId : undefined;
		this.lang = typeof lang === 'string' ? lang : undefined;
		this.pageId = typeof pageId === 'number' ? pageId : undefined;
		this.pageName = typeof pageName === 'string' ? pageName : undefined;
		this.pageType = typeof pageType === 'string' ? pageType : undefined;
		this.tags = typeof tags === 'object' ? tags : undefined;
	}
}
