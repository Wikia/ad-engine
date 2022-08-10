import { context, Targeting, utils } from '@wikia/ad-engine';

import { CommonStrategy } from './common-strategy';
import { createTaxonomyTags } from '../factories/create-taxonomy-tags';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { FandomContext } from '../models/fandom-context';

export class CombinedStrategy extends CommonStrategy implements TargetingStrategy {
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing CombinedStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		let targeting: Partial<Targeting> = {
			artid: this.context.page.articleId ? this.context.page.articleId.toString() : '',
			age: this.context.site.tags?.age || [],
			esrb: this.context.site.esrbRating || [],
			kid_wiki: this.context.site.directedAtChildren ? '1' : '0',
			lang: this.context.page.lang || 'unknown',
			s0: this.context.site.vertical,
			s0c: this.context.site.categories,
			s1: utils.targeting.getRawDbName(wiki.targeting.wikiDbName),
			s2: this.getAdLayout(wiki.targeting.pageType || 'article'),
			sex: this.context.site.tags?.sex || [],
			wpage: this.context.page.pageName && this.context.page.pageName.toLowerCase(),
		};

		const pageLevelTags: TaxonomyTags = createTaxonomyTags(this.context.page.tags);
		const siteLevelTags: TaxonomyTags = createTaxonomyTags(this.context.site.tags);

		this.addPagePrefixToValues(pageLevelTags);

		targeting = {
			...targeting,
			...this.combineSiteAndPageTags(siteLevelTags, pageLevelTags),
		};

		if (this.context.site.top1000) {
			targeting.top = '1k';
		}

		return this.addCommonParams(targeting, wiki, this.skin);
	}

	combineSiteAndPageTags(siteTags: TaxonomyTags, pageTags: TaxonomyTags): TaxonomyTags {
		const combinedTags: TaxonomyTags = {};

		for (const [key, value] of Object.entries(siteTags)) {
			if (Array.isArray(value) && value.length > 0) {
				combinedTags[key] = siteTags[key].concat(pageTags[key]);
			} else if (Array.isArray(value) && value.length === 0) {
				combinedTags[key] = pageTags[key];
			}
		}

		return combinedTags;
	}
}
