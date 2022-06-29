import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { Context } from '../models/context';

export class PageContextStrategy extends CommonStrategy implements TargetingStrategy {
	constructor(private skin: string, private context: Context) {
		super();
	}

	execute(): Partial<Targeting> {
		const wiki: MediaWikiAdsContext = context.get('wiki');

		const targeting: Partial<Targeting> = {
			artid: this.context.page.articleId ? this.context.page.articleId.toString() : '',
			age: this.context.page.tags?.age || [],
			esrb: this.context.site.esrbRating,
			gnre: this.context.page.tags?.gnre || [],
			kid_wiki: this.context.site.directedAtChildren ? '1' : '0',
			lang: this.context.page.lang || 'unknown',
			media: this.context.page.tags?.media || [],
			pform: this.context.page.tags?.pform || [],
			pub: this.context.page.tags?.pub || [],
			s0: this.context.site.vertical,
			s0c: this.context.site.categories,
			s1: utils.targeting.getRawDbName(this.context.site.siteName),
			s2: this.getAdLayout(this.context.page.pageType || 'article'),
			sex: this.context.page.tags?.sex || [],
			theme: this.context.page.tags?.theme || [],
			tv: this.context.page.tags?.tv || [],
			wpage: this.context.page.pageName && this.context.page.pageName.toLowerCase(),
		};

		if (this.context.site.top1000) {
			targeting.top = '1k';
		}

		return this.addCommonParams(targeting, wiki, this.skin);
	}
}
