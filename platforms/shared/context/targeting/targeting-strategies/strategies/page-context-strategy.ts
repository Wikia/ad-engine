import { context, Targeting, utils } from '@wikia/ad-engine';

import { CommonStrategy } from './common-strategy';
import { createTaxonomyTags } from '../factories/create-taxonomy-tags';
import { Context } from '../models/context';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategy } from '../interfaces/targeting-strategy';

export class PageContextStrategy extends CommonStrategy implements TargetingStrategy {
	constructor(private skin: string, private context: Context) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing PageContextStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		let targeting: Partial<Targeting> = {
			age: this.context.page.tags?.age || [],
			artid: this.context.page.articleId ? this.context.page.articleId.toString() : '',
			esrb: this.context.site.esrbRating,
			kid_wiki: this.context.site.directedAtChildren ? '1' : '0',
			lang: this.context.page.lang || 'unknown',
			sex: this.context.page.tags?.sex || [],
			s0: this.context.site.vertical,
			s0c: this.context.site.categories,
			s1: utils.targeting.getRawDbName(this.context.site.siteName),
			s2: this.getAdLayout(this.context.page.pageType || 'article'),
			wpage: this.context.page.pageName && this.context.page.pageName.toLowerCase(),
		};

		const pageLevelTags: TaxonomyTags = createTaxonomyTags(this.context.page);

		this.addPagePrefixToValues(pageLevelTags);

		targeting = { ...targeting, ...pageLevelTags };

		if (this.context.site.top1000) {
			targeting.top = '1k';
		}

		return this.addCommonParams(targeting, wiki, this.skin);
	}
}
